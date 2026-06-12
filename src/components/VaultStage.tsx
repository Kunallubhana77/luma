import React, { useEffect, useState } from 'react';
import { useVaultStore } from '../store/vaultStore';
import { encryptData } from '../services/crypto';

export const EncryptedPayloadViewer: React.FC = () => {
  const isLocked = useVaultStore((state) => state.isLocked);
  const decryptedData = useVaultStore((state) => state.decryptedData);
  const [encryptedDisplay, setEncryptedDisplay] = useState<string>('N/A');

  // Load raw ciphertext for display
  useEffect(() => {
    const storedPayload = localStorage.getItem('encryptedPayload');
    if (storedPayload) {
      try {
        const parsed = JSON.parse(storedPayload);
        setEncryptedDisplay(parsed.ciphertext);
      } catch (e) {
        setEncryptedDisplay('Corrupted Data Matrix');
      }
    } else {
      setEncryptedDisplay('No data matrix initialized.');
    }
  }, [isLocked, decryptedData]);

  return (
    <div className="flex-1 flex flex-col border-b border-gray-300 p-6 md:p-10 relative">
      <div className="font-bold mb-4 pb-2 border-b border-gray-300">EncryptedPayloadViewer</div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-2 md:gap-0">
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase">
          Encrypted Data Matrix
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400">
          VOLATILE MEMORY
        </span>
      </div>
      
      <div className="flex-1 overflow-auto break-all font-mono text-[10px] tracking-widest text-gray-400 select-none leading-relaxed">
        {encryptedDisplay}
      </div>
    </div>
  );
};

export const DecryptedSecretNotebook: React.FC = () => {
  const { isLocked, decryptedData, setDecryptedData, cryptoKey, addAuditLog } = useVaultStore();

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setDecryptedData(newText);
    
    if (cryptoKey) {
      try {
        const { ciphertextBase64, ivBase64 } = await encryptData(newText, cryptoKey);
        localStorage.setItem('encryptedPayload', JSON.stringify({
          ciphertext: ciphertextBase64,
          iv: ivBase64
        }));
      } catch (err: any) {
        addAuditLog('Encryption Engine Error', err.message);
      }
    }
  };

  return (
    <div className={`flex-1 flex flex-col p-6 md:p-10 transition-colors ${isLocked ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="font-bold mb-4 pb-2 border-b border-gray-300">DecryptedSecretNotebook</div>
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-2 md:gap-0">
        <span className="text-[10px] font-bold tracking-[0.2em] text-[#001b94] uppercase">
          Hardware Unlocked Workspace
        </span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400">
          AES-GCM
        </span>
      </div>
      
      {isLocked ? (
        <div className="flex-1 flex items-center justify-center">
           <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase text-center max-w-xs">
              Awaiting Hardware Enclave Unlock to decrypt contents
           </span>
        </div>
      ) : (
        <textarea
          className="flex-1 w-full bg-transparent resize-none focus:outline-none text-[13px] md:text-[15px] font-serif text-gray-900 leading-loose"
          style={{ 
             backgroundImage: 'linear-gradient(transparent, transparent 31px, #e5e7eb 31px)', 
             backgroundSize: '100% 32px',
             lineHeight: '32px' 
          }}
          value={decryptedData}
          onChange={handleTextChange}
          placeholder="ENTER SECURE PAYLOAD, CREDENTIALS, OR INTEL..."
        />
      )}
    </div>
  );
};

export const VaultStage: React.FC = () => {
  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="font-bold text-center mt-4 pb-2 border-b border-gray-300 mx-6">Secure Text Workbench & Data Staging Workspace</div>
      <EncryptedPayloadViewer />
      <DecryptedSecretNotebook />
    </div>
  );
};
