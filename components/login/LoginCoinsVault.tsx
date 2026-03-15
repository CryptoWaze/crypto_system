'use client';

import { useEffect, useState } from 'react';
import { getTop500Tokens } from '@/lib/services/tokens/top-500.service';
import type { TopToken } from '@/lib/types/token';

const COIN_SIZE_MIN = 60;
const COIN_SIZE_MAX = 120;
const TOTAL_COINS = 98;

function seed(step: number) {
  const x = Math.sin(step * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function LoginCoinsVault() {
  const [tokens, setTokens] = useState<TopToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTop500Tokens()
      .then((list) => {
        const withImage = list.filter((t) => t.imageUrl);
        setTokens(withImage);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || tokens.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-secondary/20">
        <div
          className="absolute inset-4 flex items-center justify-center rounded-2xl border-2 border-white/10 bg-black/20 backdrop-blur-sm lg:inset-6"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
        >
          {loading && (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          )}
        </div>
      </div>
    );
  }

  const coins = tokens.slice(0, TOTAL_COINS);

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-secondary/20">
      <div
        className="absolute inset-4 flex flex-col rounded-2xl border-2 border-white/10 bg-black/20 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)] backdrop-blur-sm lg:inset-6"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        <div className="relative h-full w-full flex-1 overflow-hidden">
          {coins.map((t, i) => {
            const size =
              COIN_SIZE_MIN +
              Math.floor(seed(i * 17) * (COIN_SIZE_MAX - COIN_SIZE_MIN));
            const leftPct = seed(i * 7) * 100;
            const bottomPx = Math.floor(seed(i * 13) * 260);
            const duration = 5 + seed(i * 11) * 4;
            const delay = seed(i * 23) * 35;
            return (
              <div
                key={`coin-${t.symbol}-${i}`}
                className="login-coin-falling absolute z-10 rounded-full bg-secondary/80 shadow-lg"
                style={{
                  left: `max(0%, min(${leftPct}%, calc(100% - ${size}px)))`,
                  bottom: bottomPx,
                  width: size,
                  height: size,
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                  transform: 'translateY(-100vh)',
                }}
              >
                {t.imageUrl ? (
                  <img
                    src={t.imageUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-lg font-bold text-muted-foreground">
                    {t.symbol.slice(0, 2)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
