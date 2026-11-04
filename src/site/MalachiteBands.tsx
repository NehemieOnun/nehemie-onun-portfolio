import React, { useMemo } from 'react';

/**
 * Bandes concentriques inspirées de la malachite du Katanga, dessinées en SVG.
 * Les formes sont générées de façon déterministe (même dessin à chaque visite).
 */
export const MalachiteBands: React.FC<{ className?: string }> = ({ className }) => {
  const paths = useMemo(() => {
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const rings: { d: string; tone: number }[] = [];
    const cx = 150;
    const cy = 250;
    const count = 22;
    for (let i = count; i >= 1; i--) {
      const r = 10 + i * 14;
      const phase = rand() * Math.PI * 2;
      const wobble = 3 + rand() * 4;
      const pts: string[] = [];
      const steps = 72;
      for (let k = 0; k <= steps; k++) {
        const a = (k / steps) * Math.PI * 2;
        const rr = r + Math.sin(a * 3 + phase) * wobble + Math.sin(a * 5 + phase * 1.7) * (wobble / 2);
        pts.push(`${(cx + Math.cos(a) * rr * 1.08).toFixed(1)},${(cy + Math.sin(a) * rr * 0.94).toFixed(1)}`);
      }
      rings.push({ d: `M${pts.join('L')}Z`, tone: i % 3 });
    }
    return rings;
  }, []);

  return (
    <svg viewBox="0 0 400 420" aria-hidden="true" className={className} preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="420" fill="var(--c-accent-strong)" />
      {paths.map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.tone === 0 ? 'var(--c-accent)' : p.tone === 1 ? 'var(--c-accent-strong)' : 'var(--c-accent-soft)'}
          opacity={p.tone === 2 ? 1 : 0.92}
        />
      ))}
    </svg>
  );
};
