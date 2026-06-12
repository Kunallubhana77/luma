import React, { useEffect, useState } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { registerCredential, authenticateCredential } from '../services/webauthn';
import { importKeyFromBytes, uint8ArrayToBase64, decryptData } from '../services/crypto';
import { GlyphCircle } from './Decorators';

export const HardwareTelemetryScoreboard: React.FC<{ idleTime: number }> = ({ idleTime }) => {
  const cipherClass = useVaultStore((state) => state.cipherClass);
  return (
    <div className="flex flex-col border-b border-gray-300 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 gap-4 md:gap-0">
        <div className="flex flex-col">
          <span className="font-bold uppercase">Current Authenticator Status: UNSEALED</span>
          <span className="font-medium text-gray-500">Cryptographic Cipher Class: {cipherClass}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold uppercase">Active Memory Clear Timers</span>
          <span className="font-medium text-gray-500">{60 - idleTime}S REMAINING</span>
        </div>
      </div>
    </div>
  );
};

export const SecurityActionStrip: React.FC<{ onRegister: () => void, onUnlock: () => void, error: string | null }> = ({ onRegister, onUnlock, error }) => {
  const isRegistered = useVaultStore((state) => state.isRegistered);
  
  if (!isRegistered) {
    return (
      <>
        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase">NO HARDWARE BOUND</p>
        <h2 className="text-7xl md:text-9xl font-serif text-[#001b94] tracking-tighter mb-12">
          ENROLL
        </h2>
        {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}
        <button 
          onClick={onRegister}
          className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-800 hover:text-[#001b94] transition-colors border-b border-black hover:border-[#001b94] pb-1 cursor-pointer"
        >
          Register Device Biometric Key 
          <span className="ml-2">↓</span>
        </button>
      </>
    );
  }

  return (
    <>
      <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 mb-6 uppercase">AWAITING BIOMETRIC VERIFICATION</p>
      <h2 className="text-7xl md:text-9xl font-serif text-[#001b94] tracking-tighter mb-12" style={{ letterSpacing: '-0.05em' }}>
        SEALED
      </h2>
      {error && <p className="text-red-500 text-sm mb-4 font-bold">{error}</p>}
      <button 
        onClick={onUnlock}
        className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-800 hover:text-[#001b94] transition-colors border-b border-black hover:border-[#001b94] pb-1 cursor-pointer"
      >
        Initialize Biometric Verification Loop
        <span className="ml-2">↓</span>
      </button>
    </>
  );
};

export const VaultController: React.FC = () => {
  const { 
    isLocked, setLocked, setRegistered, 
    setCryptoKey, setCipherClass, setLatencyMs, addAuditLog,
    wipeMemory, setDecryptedData
  } = useVaultStore();

  const [idleTime, setIdleTime] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Idle timer logic
  useEffect(() => {
    let timer: number;
    const resetIdle = () => setIdleTime(0);

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetIdle));

    timer = setInterval(() => {
      setIdleTime(prev => {
        const newTime = prev + 1;
        if (newTime >= 60 && !isLocked) { // 60 seconds idle auto-lock
          wipeMemory();
        }
        return newTime;
      });
    }, 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdle));
      clearInterval(timer);
    };
  }, [isLocked, wipeMemory]);

  const handleRegister = async () => {
    try {
      setErrorMessage(null);
      addAuditLog('Initiated Hardware Registration');
      const { credential, prfKeyBytes } = await registerCredential();
      
      localStorage.setItem('credentialId', credential.id);
      
      let finalKeyBytes = prfKeyBytes;
      if (!finalKeyBytes) {
        addAuditLog('PRF Extension unsupported by authenticator', 'Using fallback memory key generation');
        // Fallback: Generate random key and store it locally
        finalKeyBytes = window.crypto.getRandomValues(new Uint8Array(32));
        localStorage.setItem('fallback_key', uint8ArrayToBase64(finalKeyBytes));
        setCipherClass('AES-GCM (256-bit) [Fallback]');
      } else {
        setCipherClass('AES-GCM (256-bit) [Hardware PRF]');
        addAuditLog('Asymmetric Key Tier Generated', 'Hardware Enclave bound successfully');
      }

      setRegistered(true);
      addAuditLog('Registration complete', `Credential ID: ${credential.id.substring(0, 10)}...`);
    } catch (error: any) {
      setErrorMessage(error.message);
      addAuditLog('Registration failed', error.message);
    }
  };

  const handleUnlock = async () => {
    try {
      setErrorMessage(null);
      const credId = localStorage.getItem('credentialId');
      if (!credId) throw new Error("No credential registered");

      addAuditLog('Initiating Biometric Verification Loop');
      const { prfKeyBytes, latency } = await authenticateCredential(credId);
      
      setLatencyMs(latency);
      addAuditLog(`WebAuthn Handshake Success Rates`, `Cipher Verification Latencies (ms): ${latency.toFixed(2)}ms`);

      let finalKeyBytes = prfKeyBytes;
      if (!finalKeyBytes) {
         const fallback = localStorage.getItem('fallback_key');
         if (fallback) {
           finalKeyBytes = new Uint8Array(atob(fallback).split('').map(c => c.charCodeAt(0)));
           setCipherClass('AES-GCM (256-bit) [Fallback]');
         } else {
           throw new Error("No PRF derived key and no fallback key found.");
         }
      } else {
         setCipherClass('AES-GCM (256-bit) [Hardware PRF]');
      }

      const cryptoKey = await importKeyFromBytes(finalKeyBytes);
      setCryptoKey(cryptoKey);
      
      // Decrypt stored data
      const storedPayload = localStorage.getItem('encryptedPayload');
      if (storedPayload) {
        try {
          const { ciphertext, iv } = JSON.parse(storedPayload);
          const dec = await decryptData(ciphertext, iv, cryptoKey);
          setDecryptedData(dec);
          addAuditLog('Data Matrix Unlocked', 'Ciphertext decrypted in volatile memory');
        } catch (e: any) {
          addAuditLog('Decryption Failed', e.message);
        }
      }

      setLocked(false);

    } catch (error: any) {
      setErrorMessage(error.message);
      addAuditLog('Verification failed', error.message);
    }
  };

  if (!isLocked) {
    // UNLOCKED STATE
    return (
      <>
        <div className="font-bold text-center mb-4 pb-2 border-b border-gray-300">Master Authenticator Portal & Security Deck</div>
        <div className="font-bold text-center mb-4 text-gray-500">HardwareTelemetryScoreboard</div>
        <HardwareTelemetryScoreboard idleTime={idleTime} />
      </>
    );
  }

  // LOCKED STATE - Master Authenticator Portal & Security Deck
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] relative py-20 overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
        <GlyphCircle size={600} className="text-[#001b94] animate-[spin_40s_linear_infinite]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="font-bold mb-4 pb-2 border-b border-gray-300 w-full">Master Authenticator Portal & Security Deck</div>
        <div className="font-bold mb-6 text-gray-500">SecurityActionStrip</div>
        <SecurityActionStrip onRegister={handleRegister} onUnlock={handleUnlock} error={errorMessage} />
      </div>

    </div>
  );
};
