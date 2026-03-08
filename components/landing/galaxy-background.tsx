'use client';

import { useMemo } from 'react';

function useStarPositions(count: number) {
  return useMemo(() => {
    const positions: { left: number; top: number; delay: number; size: number }[] = [];
    const seed = (s: number) => {
      const x = Math.sin(s * 12.9898) * 43758.5453;
      return x - Math.floor(x);
    };
    for (let i = 0; i < count; i++) {
      positions.push({
        left: seed(i * 1.1) * 100,
        top: seed(i * 2.3) * 100,
        delay: seed(i * 0.7) * 25,
        size: seed(i * 5.1) > 0.7 ? 2 : 1.5,
      });
    }
    return positions;
  }, [count]);
}

export function GalaxyBackground() {
  const stars = useStarPositions(32);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse 100% 70% at 50% -15%, rgba(251, 191, 36, 0.14), rgba(245, 158, 11, 0.06) 35%, transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className="galaxy-dot absolute rounded-full bg-white"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: 0.45,
              animationDelay: `${s.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
