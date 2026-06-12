import { create } from 'zustand';

export interface AuditLog {
  id: string;
  timestamp: string;
  event: string;
  details?: string;
}

interface VaultState {
  isLocked: boolean;
  isRegistered: boolean;
  decryptedData: string;
  cryptoKey: CryptoKey | null;
  cipherClass: string;
  latencyMs: number;
  auditLogs: AuditLog[];

  // Actions
  setLocked: (locked: boolean) => void;
  setRegistered: (registered: boolean) => void;
  setDecryptedData: (data: string) => void;
  setCryptoKey: (key: CryptoKey | null) => void;
  setCipherClass: (cipherClass: string) => void;
  setLatencyMs: (ms: number) => void;
  addAuditLog: (event: string, details?: string) => void;
  clearAuditLogs: () => void;
  wipeMemory: () => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  isLocked: true,
  isRegistered: !!localStorage.getItem('credentialId'),
  decryptedData: '',
  cryptoKey: null,
  cipherClass: 'AES-GCM (256-bit)',
  latencyMs: 0,
  auditLogs: [],

  setLocked: (locked) => set({ isLocked: locked }),
  setRegistered: (registered) => set({ isRegistered: registered }),
  setDecryptedData: (data) => set({ decryptedData: data }),
  setCryptoKey: (key) => set({ cryptoKey: key }),
  setCipherClass: (cipherClass) => set({ cipherClass }),
  setLatencyMs: (latencyMs) => set({ latencyMs }),
  
  addAuditLog: (event, details) => set((state) => {
    const newLog: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event,
      details,
    };
    return { auditLogs: [newLog, ...state.auditLogs] };
  }),
  
  clearAuditLogs: () => set({ auditLogs: [] }),

  wipeMemory: () => set((state) => {
    // Only log if it was actually unlocked
    if (!state.isLocked) {
      const newLog: AuditLog = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        event: 'Memory Force-Wipe Event',
        details: 'Decrypted strings and keys purged from volatile memory.',
      };
      return { 
        isLocked: true, 
        decryptedData: '', 
        cryptoKey: null,
        auditLogs: [newLog, ...state.auditLogs]
      };
    }
    return state;
  })
}));
