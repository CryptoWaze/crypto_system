'use client';

import { useEffect, useMemo, useState } from 'react';
import { getTop500Tokens } from '@/lib/services/tokens/top-500.service';
import type { TopToken } from '@/lib/types/token';

const COIN_SIZE_MIN = 60;
const COIN_SIZE_MAX = 120;
const TOTAL_COINS = 98;
const GAP = 8;
const REF_WIDTH = 1100;
const MAX_PILE_HEIGHT = 1600;

function seed(step: number) {
  const x = Math.sin(step * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function shuffledDelays(n: number, maxSeconds: number): number[] {
  const arr = Array.from({ length: n }, (_, i) => (i / (n - 1 || 1)) * maxSeconds);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seed(7731 + i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function packCoins(
  coins: { token: TopToken; size: number; index: number; landingTime: number }[]
): { leftPct: number; bottomPx: number; size: number }[] {
  const sorted = [...coins].sort((a, b) => a.landingTime - b.landingTime);
  const placed: { x: number; y: number; size: number }[] = [];

  for (const coin of sorted) {
    const { size } = coin;
    let found = false;
    for (let y = 0; y <= MAX_PILE_HEIGHT - size && !found; y += Math.max(4, GAP)) {
      for (let x = 0; x <= REF_WIDTH - size && !found; x += Math.max(4, GAP)) {
        const overlaps = placed.some(
          (p) =>
            x < p.x + p.size + GAP &&
            x + size + GAP > p.x &&
            y < p.y + p.size + GAP &&
            y + size + GAP > p.y
        );
        if (!overlaps) {
          placed.push({ x, y, size });
          found = true;
        }
      }
    }
    if (!found) {
      const maxBottom = placed.length > 0
        ? Math.max(...placed.map((p) => p.y + p.size)) + GAP
        : 0;
      placed.push({
        x: 0,
        y: maxBottom,
        size,
      });
    }
  }

  const byIndex = new Map<number, { x: number; y: number; size: number }>();
  sorted.forEach((c, i) => {
    byIndex.set(c.index, placed[i]);
  });

  return coins.map((c) => {
    const p = byIndex.get(c.index)!;
    return {
      leftPct: (p.x / REF_WIDTH) * 100,
      bottomPx: p.y,
      size: p.size,
    };
  });
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

  const coinsWithPositions = useMemo(() => {
    if (tokens.length === 0) return [];
    const delays = shuffledDelays(TOTAL_COINS, 6);
    const coins = tokens.slice(0, TOTAL_COINS).map((t, i) => {
      const duration = (5 + seed(i * 11) * 4) / 12;
      const delay = delays[i];
      return {
        token: t,
        size:
          COIN_SIZE_MIN +
          Math.floor(seed(i * 17) * (COIN_SIZE_MAX - COIN_SIZE_MIN)),
        index: i,
        landingTime: delay + duration,
        delay,
        duration,
      };
    });
    const positions = packCoins(coins);
    return coins.map((c, i) => ({ ...c, ...positions[i] }));
  }, [tokens]);

  if (loading || coinsWithPositions.length === 0) {
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

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-secondary/20">
      <div
        className="absolute inset-4 flex flex-col rounded-2xl border-2 border-white/10 bg-black/20 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)] backdrop-blur-sm lg:inset-6"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        <div className="relative h-full w-full flex-1 overflow-hidden">
          {coinsWithPositions.map(({ token: t, leftPct, bottomPx, size, delay, duration }, i) => {
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
