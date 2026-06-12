import React from 'react';

export const GlyphGrid: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg width="100%" height="100%" viewBox="0 0 90 240" stroke="currentColor" strokeWidth="1" fill="none" className={className}>
    {/* Row 1 */}
    <g transform="translate(0, 0)"><path d="M0 0 Q15 15 30 0 M0 30 Q15 15 30 30 M15 0 V30" /></g>
    <g transform="translate(30, 0)"><path d="M0 0 L30 30 M0 30 L30 0 M15 0 V30 M0 15 H30" /></g>
    <g transform="translate(60, 0)"><rect x="0" y="0" width="30" height="30" /><circle cx="15" cy="15" r="15" /><path d="M15 0 V30" /></g>
    {/* Row 2 */}
    <g transform="translate(0, 30)"><path d="M0 0 Q15 15 30 0 M0 30 Q15 15 30 30 M0 15 H30" /></g>
    <g transform="translate(30, 30)"><rect x="0" y="0" width="30" height="30" /><path d="M15 0 V30 M0 15 H30" /></g>
    <g transform="translate(60, 30)"><path d="M0 0 H30 M15 0 V30 M0 30 H30 M0 0 A15 15 0 0 0 30 0 M0 30 A15 15 0 0 1 30 30" /></g>
    {/* Row 3 */}
    <g transform="translate(0, 60)"><path d="M0 30 L15 0 L30 30 M15 0 V30" /></g>
    <g transform="translate(30, 60)"><path d="M0 0 L15 30 L30 0 M15 0 V30" /></g>
    <g transform="translate(60, 60)"><path d="M0 0 L30 30 M0 30 L30 0 M0 0 H30 M0 30 H30" /></g>
    {/* Row 4 */}
    <g transform="translate(0, 90)"><path d="M0 30 L15 0 L30 30 M15 0 V30" /></g>
    <g transform="translate(30, 90)"><path d="M0 30 L15 0 L30 30 M15 0 V30 M0 30 H30" /></g>
    <g transform="translate(60, 90)"><path d="M0 0 L30 30 M0 30 L30 0 M0 0 H30 M0 30 H30 M15 0 V30" /></g>
    {/* Row 5 */}
    <g transform="translate(0, 120)"><path d="M0 0 H30 M15 0 V30 M0 30 H30 M0 0 A15 15 0 0 0 30 0 M0 30 A15 15 0 0 1 30 30" /></g>
    <g transform="translate(30, 120)"><rect x="0" y="0" width="30" height="30" /><path d="M0 15 H30" /></g>
    <g transform="translate(60, 120)"><rect x="0" y="0" width="30" height="30" /><path d="M15 0 V30 M0 15 H30 M0 0 L30 30 M0 30 L30 0" /></g>
    {/* Row 6 */}
    <g transform="translate(0, 150)"><path d="M0 0 H30 M15 0 V30 M0 30 H30 M10 0 V30 M20 0 V30" /></g>
    <g transform="translate(30, 150)"><rect x="0" y="0" width="30" height="30" /><path d="M0 15 H30" /></g>
    <g transform="translate(60, 150)"><path d="M0 0 H30 M15 0 V30 M0 30 H30 M10 0 V30 M20 0 V30" /></g>
    {/* Row 7 */}
    <g transform="translate(0, 180)"><rect x="0" y="0" width="30" height="30" /></g>
    <g transform="translate(30, 180)"><path d="M0 0 L30 30 M0 30 L30 0 M15 0 V30" /></g>
    <g transform="translate(60, 180)"><path d="M0 0 Q15 15 30 0 M0 30 Q15 15 30 30 M15 0 V30" /></g>
    {/* Row 8 */}
    <g transform="translate(0, 210)"><path d="M0 0 L30 30 M0 30 L30 0 M0 15 H30" /></g>
    <g transform="translate(30, 210)"><rect x="0" y="0" width="30" height="30" /><circle cx="15" cy="15" r="15" /></g>
    <g transform="translate(60, 210)"><path d="M0 0 H30 M15 0 V30 M0 30 H30 M0 0 A15 15 0 0 0 30 0 M0 30 A15 15 0 0 1 30 30" /></g>
  </svg>
);

export const GlyphCircle: React.FC<{ className?: string, size?: number }> = ({ className = '', size = 500 }) => {
  const radius = 220;
  const cx = 250;
  const cy = 250;
  
  // A set of path instructions for individual glyphs to be placed in a circle
  const glyphs = [
    <path d="M-10,-10 L10,10 M-10,10 L10,-10 M0,-15 V15" />,
    <path d="M-15,0 H15 M0,-15 V15 M-10,0 A10,10 0 0 0 10,0 M-10,0 A10,10 0 0 1 10,0" />,
    <g><rect x="-10" y="-10" width="20" height="20" /><circle cx="0" cy="0" r="10" /></g>,
    <path d="M-10,10 L0,-10 L10,10 M0,-10 V15" />,
    <path d="M-15,-10 H15 M-15,10 H15 M-5,-10 V10 M5,-10 V10" />,
    <circle cx="0" cy="0" r="12" />,
    <path d="M-10,-10 L10,10 M-10,10 L10,-10 M-15,0 H15 M0,-15 V15" />,
    <g><rect x="-12" y="-12" width="24" height="24" /><path d="M-12,-12 L12,12 M-12,12 L12,-12" /></g>,
    <g><rect x="-12" y="-12" width="24" height="24" /><path d="M-12,0 H12 M0,-12 V12" /></g>,
    <path d="M-15,0 Q0,15 15,0 M0,0 V15" />,
    <g><circle cx="0" cy="0" r="12" /><circle cx="0" cy="0" r="4" fill="currentColor"/></g>,
    <path d="M-10,-10 L0,10 L10,-10 M0,-10 V15" />,
    <g><rect x="-12" y="-12" width="24" height="24" /><path d="M-12,0 H12" /></g>,
    <path d="M-10,10 Q0,-10 10,10 M0,-5 V15" />,
    <g><circle cx="0" cy="0" r="12" /><path d="M-12,0 H12 M0,-12 V12" /></g>,
    <path d="M-10,-10 Q0,10 10,-10 M-10,10 Q0,-10 10,10" />
  ];

  return (
    <svg width={size} height={size} viewBox="0 0 500 500" stroke="currentColor" strokeWidth="1.5" fill="none" className={className}>
      {glyphs.map((g, i) => {
        const angle = (i / glyphs.length) * Math.PI * 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        const rotation = (angle * 180) / Math.PI + 90; // Rotate to face outward/inward
        return (
          <g key={i} transform={`translate(${x}, ${y}) rotate(${rotation})`}>
            {g}
          </g>
        );
      })}
    </svg>
  );
};
