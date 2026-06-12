import { useEffect, useState } from 'react';
import { VaultController } from './components/VaultController';
import { VaultStage } from './components/VaultStage';
import { AuditConsole } from './components/AuditConsole';
import { useVaultStore } from './store/vaultStore';
import { Splash } from './components/Splash';

function App() {
  const wipeMemory = useVaultStore((state) => state.wipeMemory);
  const isLocked = useVaultStore((state) => state.isLocked);
  const [showSplash, setShowSplash] = useState(true);

  // Auto-Locking Memory Wipe Matrix on visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && !showSplash) {
        wipeMemory();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wipeMemory, showSplash]);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f9f8f4', color: '#111' }}>
      
      {/* Premium Minimalist Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 md:p-10 shrink-0 gap-4 md:gap-0">
        <div className="flex items-center gap-3 text-xs font-bold tracking-widest uppercase">
          <span className="text-gray-400">SYS</span>
          <div className="w-10 h-5 border border-gray-400 rounded-full flex items-center p-0.5 cursor-pointer hover:border-[#001b94] transition-colors">
            <div className="w-4 h-4 bg-[#001b94] rounded-full ml-auto"></div>
          </div>
          <span className="text-[#001b94]">SEC</span>
        </div>
        
        <button 
          onClick={wipeMemory}
          className="flex items-center gap-2 text-xs font-bold tracking-widest hover:text-[#001b94] transition-colors uppercase cursor-pointer"
        >
          Enforce Manual Vault Relock
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        <VaultController />
        
        {/* We only show VaultStage and AuditConsole if the vault is unlocked! */}
        {!isLocked && (
          <div className="flex flex-col lg:flex-row gap-0 w-full flex-1">
            <div className="flex-1 border-t border-r border-gray-300">
               <VaultStage />
            </div>
            <div className="w-full lg:w-1/3 border-t border-gray-300">
               <AuditConsole />
            </div>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
