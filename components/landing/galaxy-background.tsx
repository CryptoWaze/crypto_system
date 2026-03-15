'use client';


const STAR_POSITIONS: { left: string; top: string; delay: string; size: string; variant: number }[] = (() => {
  const positions: { left: string; top: string; delay: string; size: string; variant: number }[] = [];
  const seed = (s: number) => {
    const x = Math.sin(s * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  for (let i = 0; i < 32; i++) {
    positions.push({
      left: `${(seed(i * 1.1) * 100).toFixed(2)}%`,
      top: `${(seed(i * 2.3) * 100).toFixed(2)}%`,
      delay: `${(seed(i * 0.7) * 30).toFixed(2)}s`,
      size: `${seed(i * 5.1) > 0.7 ? 4 : 3}px`,
      variant: (i % 3) + 1,
    });
  }
  return positions;
})();

function useStarPositions() {
  return STAR_POSITIONS;
}

export function GalaxyBackground() {
  const stars = useStarPositions();

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: 'radial-gradient(ellipse 110% 77% at 50% -15%, rgba(251, 191, 36, 0.14), rgba(245, 158, 11, 0.06) 35%, transparent 55%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden [contain:layout]" aria-hidden>
        {stars.map((s, i) => (
          <span
            key={i}
            className={`galaxy-dot galaxy-dot-${s.variant} absolute rounded-full bg-white`}
            style={{
              left: s.left,
              top: s.top,
              width: s.size,
              height: s.size,
              opacity: '0.45',
              animationDelay: s.delay,
            }}
          />
        ))}
      </div>
    </>
  );
}
