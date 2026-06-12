import React, { useEffect, useState } from 'react';

interface SplashProps {
  onComplete: () => void;
}

export const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  const [isFading, setIsFading] = useState(false);

  const handleEnter = () => {
    setIsFading(true);
    setTimeout(onComplete, 800); // Wait for fade out animation
  };

  // Auto-enter after 4 seconds to allow animations to finish
  useEffect(() => {
    const timer = setTimeout(handleEnter, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes draw {
            from { stroke-dashoffset: 100; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-draw path, .animate-draw rect, .animate-draw circle {
            stroke-dasharray: 100;
            stroke-dashoffset: 100;
            animation: draw 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          /* Add staggered delay to grid items */
          .animate-draw circle { animation-delay: 0.2s; }
          .animate-draw path:nth-of-type(1) { animation-delay: 0.4s; }
          .animate-draw rect { animation-delay: 0.6s; }
          .animate-draw path:nth-of-type(2) { animation-delay: 0.8s; }
          .animate-draw path:nth-of-type(3) { animation-delay: 1.0s; }

          /* Staggered letter animations */
          .letter-l { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
          .letter-u { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards; opacity: 0; }
          .letter-m { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards; opacity: 0; }
          .letter-a { animation: fadeUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards; opacity: 0; }
        `}
      </style>
      <div 
        className={`fixed inset-0 z-50 flex flex-col justify-between transition-opacity duration-700 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: '#f9f8f4', color: '#111' }}
      >
        {/* Header */}
        <header className="flex flex-wrap justify-between items-center p-6 md:p-10 shrink-0 gap-6">
          <div className="flex items-center gap-3 text-xs font-bold tracking-widest">
            <span>SYS</span>
            <div className="w-10 h-5 border border-gray-400 rounded-full flex items-center p-0.5">
              <div className="w-4 h-4 bg-[#001b94] rounded-full"></div>
            </div>
            <span>SEC</span>
          </div>
          <button 
            onClick={handleEnter}
            className="flex items-center gap-2 text-xs font-bold tracking-widest hover:text-[#001b94] transition-colors uppercase cursor-pointer"
          >
            Enter Vault
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </header>

        {/* Main Content (Center Logo + Vertical Text) */}
        <main className="flex-1 flex items-center justify-between w-full max-w-[1600px] mx-auto px-6 md:px-12 overflow-hidden">
          
          {/* Massive LUMA SVG */}
          <div className="flex-1 flex justify-center items-center h-full max-h-[70vh]">
            <svg viewBox="0 0 1320 510" className="w-full h-full drop-shadow-sm max-w-[1200px]" preserveAspectRatio="xMidYMid meet">
              {/* L */}
              <g transform="translate(0, 0)">
                <g className="letter-l">
                  <path d="M0,0 H90 V510 H0 Z" fill="#001b94" />
                  <path d="M90,420 H180 A90,90 0 0,1 270,510 H90 Z" fill="#001b94" />
                </g>
              </g>
              
              {/* U */}
              <g transform="translate(290, 0)">
                <g className="letter-u">
                  <path d="M0,0 H90 V350 A70,70 0 0,0 230,350 V0 H320 V350 A160,160 0 0,1 0,350 Z" fill="#001b94" />
                </g>
              </g>

              {/* M */}
              <g transform="translate(630, 0)">
                <g className="letter-m">
                  {/* Main solid block */}
                  <path d="M0,110 A110,110 0 0,1 110,0 H240 A110,110 0 0,1 350,110 V510 H0 Z" fill="#001b94" />
                  {/* Cutout 1 */}
                  <path d="M90,510 V200 A25,25 0 0,1 140,200 V510 Z" fill="#f9f8f4" />
                  {/* Cutout 2 */}
                  <path d="M210,510 V200 A25,25 0 0,1 260,200 V510 Z" fill="#f9f8f4" />
                </g>
              </g>

              {/* A */}
              <g transform="translate(1000, 0)">
                <g className="letter-a">
                  {/* Solid block with rounded top */}
                  <path d="M0,160 A160,160 0 0,1 320,160 V510 H0 Z" fill="#001b94" />
                  {/* Bottom Cutout */}
                  <path d="M90,510 V350 H230 V510 Z" fill="#f9f8f4" />
                  {/* Eye Cutout (Leaf shape) */}
                  <path d="M110,180 Q160,110 210,180 Q160,250 110,180 Z" fill="#f9f8f4" />
                </g>
              </g>
            </svg>
          </div>

          {/* Right side Vertical Text & Symbols - Re-aligned to use Flex Layout (No Absolute Position Overlap) */}
          <div className="hidden lg:flex flex-col items-center gap-6 shrink-0 w-16 ml-8">
            <div className="flex flex-col gap-1 items-end" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-800 whitespace-nowrap">Biometric Authentication Local Lockbox</span>
              <span className="text-[10px] font-medium tracking-[0.2em] text-gray-500 whitespace-nowrap">Hardware Bound Enclave</span>
            </div>
            <div className="w-[1px] h-12 bg-gray-400"></div>
            
            {/* Original simpler abstract symbols block to prevent messiness */}
            <svg width="40" height="120" viewBox="0 0 40 120" stroke="#111" strokeWidth="1" fill="none" className="animate-draw shrink-0">
              <circle cx="20" cy="20" r="15" />
              <path d="M5 20 H35 M20 5 V35" />
              <rect x="5" y="45" width="30" height="30" />
              <path d="M5 45 L35 75 M35 45 L5 75" />
              <path d="M5 110 L20 85 L35 110 Z" />
            </svg>
          </div>

        </main>

        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-start md:items-end p-6 md:p-10 shrink-0 gap-6 md:gap-0">
          <div className="flex flex-col text-[10px] font-medium tracking-widest text-gray-500 uppercase">
             VERSION 1.0<br/>© 2026 LUMA SYSTEMS
          </div>
          <div className="flex gap-8 md:gap-12 text-[10px] font-medium tracking-widest text-gray-500 uppercase">
             <span>AES-GCM<br/>256</span>
             <span>WEBAUTHN<br/>PRF</span>
          </div>
        </footer>
      </div>
    </>
  );
};
