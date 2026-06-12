import React from 'react';
import { useVaultStore } from '../store/vaultStore';

export const AuditConsole: React.FC = () => {
  const { auditLogs } = useVaultStore();

  const handleExport = () => {
    const payload = localStorage.getItem('encryptedPayload');
    if (!payload) return alert('No data to export.');
    
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-backup-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePurge = () => {
    if (confirm("Are you sure you want to permanently delete your stored cryptographic payloads and WebAuthn credentials? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col h-full min-h-[500px] p-6 md:p-10">
      <div className="font-bold text-center mb-6 pb-2 border-b border-gray-300">Security Audit & Local Subsystem Log</div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start mb-10 gap-6 md:gap-0">
        <span className="text-[10px] font-bold tracking-[0.2em] text-gray-800 uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
          System Telemetry
        </span>
        
        <div className="flex flex-col gap-4 text-right">
          <button onClick={handleExport} className="text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-[#001b94] transition-colors border-b border-transparent hover:border-[#001b94]">
            Export Encrypted Backup File to Disk
          </button>
          <button onClick={handlePurge} className="text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-red-600 transition-colors border-b border-transparent hover:border-red-600">
            Purge Local Storage Footprints
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        {auditLogs.length === 0 ? (
          <div className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            No events
          </div>
        ) : (
          <div className="flex flex-col">
            {auditLogs.map((log) => (
              <div key={log.id} className="border-b border-gray-200 py-4 flex flex-col gap-1">
                <div className="flex justify-between items-start gap-4">
                  <span className="font-bold text-[10px] tracking-[0.2em] text-gray-800 uppercase">{log.event}</span>
                  <span className="text-[10px] font-mono text-gray-400 shrink-0">
                    {new Date(log.timestamp).toISOString().split('T')[1].replace('Z', '')}
                  </span>
                </div>
                {log.details && (
                  <div className="text-[10px] font-mono text-gray-500 leading-relaxed break-all">
                    {log.details}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
