'use client';

import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import { getTop500Tokens } from '@/lib/services/tokens/top-500.service';
import type { TopToken } from '@/lib/types/token';

const COIN_RADIUS_MIN = 28;
const COIN_RADIUS_MAX = 52;
const TOTAL_COINS = 98;
const WALL_THICKNESS = 40;
const SPAWN_INTERVAL_MS = 18;
const GRAVITY = 0.8;
const GRAVITY_SCALE = 0.0112;
const RESTITUTION = 0.12;
const FRICTION = 0.45;
const MAX_SPEED = 1.8;
const VERTICAL_PADDING = 60;
const INITIAL_FALL_SPEED = 0.9;
const FAST_PHASE_MS = 5000;
const FAST_PHASE_TIME_SCALE = 3;
const TRAY_HEIGHT_PX = 200;

function seed(step: number) {
  const x = Math.sin(step * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export function LoginCoinsVault() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const coinBodiesRef = useRef<Matter.Body[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const tokensRef = useRef<TopToken[]>([]);
  const animationRef = useRef<number>(0);
  const spawnTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const spawnRewardCoinRef = useRef<(() => void) | null>(null);
  const spawnCoinInExitRef = useRef<(() => void) | null>(null);
  const setActiveExitCoinRef = useRef<React.Dispatch<React.SetStateAction<{ id: number; imageUrl: string | null; symbol: string } | null>> | null>(null);

  const [tokens, setTokens] = useState<TopToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [imagesReady, setImagesReady] = useState(false);
  const [knobRotation, setKnobRotation] = useState(0);
  const [purpleButtonRotation, setPurpleButtonRotation] = useState(0);
  const [activeExitCoin, setActiveExitCoin] = useState<{ id: number; imageUrl: string | null; symbol: string } | null>(null);
  const [exitCoinPopping, setExitCoinPopping] = useState(false);
  setActiveExitCoinRef.current = setActiveExitCoin;

  useEffect(() => {
    if (!activeExitCoin) return;
    const popTimer = setTimeout(() => setExitCoinPopping(true), 4000);
    const clearTimer = setTimeout(() => {
      setActiveExitCoin(null);
      setExitCoinPopping(false);
    }, 4600);
    return () => {
      clearTimeout(popTimer);
      clearTimeout(clearTimer);
    };
  }, [activeExitCoin?.id]);

  useEffect(() => {
    getTop500Tokens()
      .then((list) => {
        const withImage = list.filter((t) => t.imageUrl);
        setTokens(withImage.slice(0, TOTAL_COINS));
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tokens.length === 0) return;
    const shuffled = shuffleArray(tokens);
    const urls = shuffled.map((t) => t.imageUrl ?? '').filter(Boolean);
    Promise.all(urls.map((url) => loadImage(url)))
      .then((imgs) => {
        imagesRef.current = imgs;
        tokensRef.current = shuffled;
        setImagesReady(true);
      })
      .catch(() => setImagesReady(true));
  }, [tokens]);

  useEffect(() => {
    if (!imagesReady || !containerRef.current || !canvasRef.current || tokensRef.current.length === 0) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    const tokensList = tokensRef.current;
    const images = imagesRef.current;
    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    let width = container.clientWidth;
    let height = container.clientHeight;
    if (width <= 0 || height <= 0) return;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: GRAVITY, scale: GRAVITY_SCALE },
      positionIterations: 17.5,
      velocityIterations: 12.5,
    });
    engineRef.current = engine;
    const { world } = engine;

    const floor = Matter.Bodies.rectangle(
      width / 2,
      height + WALL_THICKNESS / 2,
      width + WALL_THICKNESS * 2,
      WALL_THICKNESS,
      { isStatic: true, slop: 0 }
    );
    const leftWall = Matter.Bodies.rectangle(
      -WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height + WALL_THICKNESS * 2,
      { isStatic: true, slop: 0 }
    );
    const rightWall = Matter.Bodies.rectangle(
      width + WALL_THICKNESS / 2,
      height / 2,
      WALL_THICKNESS,
      height + WALL_THICKNESS * 2,
      { isStatic: true, slop: 0 }
    );
    Matter.World.add(world, [floor, leftWall, rightWall]);

    const coinBodies: Matter.Body[] = [];
    coinBodiesRef.current = coinBodies;

    const spawnOne = (index: number) => {
      if (index >= tokensList.length) return;
      const radius =
        COIN_RADIUS_MIN + Math.floor(seed(index * 17) * (COIN_RADIUS_MAX - COIN_RADIUS_MIN));
      const x = radius + seed(index * 7) * (width - radius * 2);
      const y = -radius * 2;
      const vx = (seed(index * 13) - 0.5) * 1.2;
      const body = Matter.Bodies.circle(x, y, radius, {
        restitution: RESTITUTION,
        friction: FRICTION,
        frictionAir: 0.0005,
        density: 0.008,
        slop: 0,
      });
      (body as Matter.Body & { coinRadius: number }).coinRadius = radius;
      Matter.Body.setVelocity(body, { x: vx, y: INITIAL_FALL_SPEED });
      Matter.World.add(world, body);
      coinBodies.push(body);
    };

    let spawnIndex = 0;
    const scheduleSpawn = () => {
      if (spawnIndex >= tokensList.length) return;
      const t = setTimeout(() => {
        spawnOne(spawnIndex);
        spawnIndex += 1;
        scheduleSpawn();
      }, SPAWN_INTERVAL_MS);
      spawnTimeoutsRef.current.push(t);
    };
    scheduleSpawn();

    const spawnRewardCoin = () => {
      if (tokensList.length === 0 || coinBodies.length === 0) return;
      const xPositions = [80, width / 2, width - 80];
      const baseSeed = Date.now() % 1e6;
      xPositions.forEach((x, i) => {
        const tokenIndex = Math.floor(Math.random() * tokensList.length);
        const radius = COIN_RADIUS_MIN + Math.floor(seed(baseSeed + i * 7) * (COIN_RADIUS_MAX - COIN_RADIUS_MIN));
        const safeX = Math.max(radius + 10, Math.min(width - radius - 10, x));
        const y = -radius * 2;
        const body = Matter.Bodies.circle(safeX, y, radius, {
          restitution: RESTITUTION,
          friction: FRICTION,
          frictionAir: 0.0005,
          density: 0.008,
          slop: 0,
        });
        (body as Matter.Body & { coinRadius: number }).coinRadius = radius;
        (body as Matter.Body & { tokenIndex: number }).tokenIndex = tokenIndex;
        Matter.Body.setVelocity(body, { x: 0, y: INITIAL_FALL_SPEED });
        Matter.World.add(world, body);
        coinBodies.push(body);
      });
    };
    spawnRewardCoinRef.current = spawnRewardCoin;

    const spawnCoinInExit = () => {
      if (tokensList.length === 0) return;
      const tokenIndex = Math.floor(Math.random() * tokensList.length);
      const token = tokensList[tokenIndex];
      setActiveExitCoinRef.current?.({ id: Date.now(), imageUrl: token.imageUrl, symbol: token.symbol ?? '' });
    };
    spawnCoinInExitRef.current = spawnCoinInExit;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = performance.now();
    let lastTime = 0;
    const scale = dpr;

    const clampBodyInBounds = (body: Matter.Body, r: number) => {
      const minX = r;
      const maxX = width - r;
      const minY = -r - VERTICAL_PADDING;
      const maxY = height - r;
      const x = Math.max(minX, Math.min(maxX, body.position.x));
      const y = Math.max(minY, Math.min(maxY, body.position.y));
      if (x !== body.position.x || y !== body.position.y) {
        Matter.Body.setPosition(body, { x, y });
      }
      const vx = body.velocity.x;
      const vy = body.velocity.y;
      const speed = Math.sqrt(vx * vx + vy * vy);
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed;
        Matter.Body.setVelocity(body, { x: vx * scale, y: vy * scale });
      }
    };

    const draw = (time: number) => {
      const elapsed = time - startTime;
      engine.timing.timeScale = elapsed < FAST_PHASE_MS ? FAST_PHASE_TIME_SCALE : 1;
      const deltaMs = Math.min(time - lastTime, 50);
      lastTime = time;
      Matter.Engine.update(engine, deltaMs);

      coinBodies.forEach((body) => {
        const r = (body as Matter.Body & { coinRadius?: number }).coinRadius ?? 30;
        clampBodyInBounds(body, r);
      });

      ctx.save();
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
      ctx.clearRect(0, 0, width, height);

      coinBodies.forEach((body, i) => {
        const pos = body.position;
        const angle = body.angle;
        const radius = (body as Matter.Body & { coinRadius?: number }).coinRadius ?? 30;
        const tokenIndex = (body as Matter.Body & { tokenIndex?: number }).tokenIndex ?? i;
        const img = images[tokenIndex] ?? null;
        const token = tokensList[tokenIndex];

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        if (img) {
          ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fill();
          ctx.restore();
          ctx.save();
          ctx.translate(pos.x, pos.y);
          ctx.rotate(angle);
          ctx.fillStyle = 'rgba(255,255,255,0.7)';
          ctx.font = `${Math.max(12, radius * 0.5)}px system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(
            token?.symbol?.slice(0, 2) ?? '?',
            0,
            0
          );
        }
        ctx.restore();
      });

      ctx.restore();
      animationRef.current = requestAnimationFrame(draw);
    };
    animationRef.current = requestAnimationFrame(draw);

    return () => {
      spawnRewardCoinRef.current = null;
      spawnCoinInExitRef.current = null;
      spawnTimeoutsRef.current.forEach(clearTimeout);
      spawnTimeoutsRef.current = [];
      cancelAnimationFrame(animationRef.current);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      engineRef.current = null;
      coinBodiesRef.current = [];
    };
  }, [imagesReady]);

  if (loading || tokens.length === 0) {
    return (
      <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
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
    <div className="relative flex min-h-screen w-full overflow-hidden bg-black">
      <div
        className="absolute inset-4 flex flex-col rounded-2xl border-2 border-white/10 bg-black/20 shadow-[inset_0_0_80px_rgba(0,0,0,0.2)] backdrop-blur-sm lg:inset-6"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        <div
          ref={containerRef}
          className="relative min-h-0 flex-1 w-full overflow-hidden"
          style={{ minHeight: '320px' }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{ display: 'block' }}
          />
        </div>
        <div
          className="relative flex-shrink-0 w-full rounded-b-xl border-t border-white/10 bg-zinc-700/90"
          style={{ height: TRAY_HEIGHT_PX, boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.25)' }}
        >
          <img
            src="/logo.png"
            alt="CryptoForense"
            className="absolute left-1/2 top-1/2 h-[2.925rem] w-auto -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-90"
            width={182}
            height={47}
          />
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-zinc-500/90 bg-gradient-to-b from-zinc-500 to-zinc-700 pointer-events-none flex items-center justify-center overflow-hidden"
            style={{ boxShadow: 'inset 0 6px 16px rgba(0,0,0,0.5), inset 0 -2px 4px rgba(0,0,0,0.2)' }}
            aria-hidden
          >
            {activeExitCoin && (
              <div
                className="absolute inset-0 rounded-full bg-zinc-600/80 border border-white/10 overflow-hidden flex items-center justify-center exit-coin-enter transition-all duration-300 ease-out"
                style={
                  exitCoinPopping
                    ? { transform: 'scale(1.5)', opacity: 0 }
                    : undefined
                }
              >
                {activeExitCoin.imageUrl ? (
                  <img
                    src={activeExitCoin.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-xl font-medium text-white/80">{activeExitCoin.symbol.slice(0, 2)}</span>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              if (activeExitCoin) return;
              setKnobRotation((r) => r + 720);
              spawnCoinInExitRef.current?.();
            }}
            disabled={activeExitCoin !== null}
            className="absolute left-8 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full border-2 border-zinc-500/80 disabled:opacity-50 disabled:pointer-events-none bg-gradient-to-br from-zinc-400 to-zinc-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-transform duration-[1250ms] ease-out"
            style={{ transform: `rotate(${knobRotation}deg)` }}
            aria-label="Manivela"
          >
            <span
              className="w-4 h-5 rounded-sm bg-zinc-500/90 -translate-y-1 shadow-sm"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              aria-hidden
            />
          </button>
          <button
            type="button"
            onClick={() => {
              setPurpleButtonRotation((r) => r + 720);
              spawnRewardCoinRef.current?.();
            }}
            className="absolute left-[7.5rem] top-[calc(50%+1.25rem)] w-9 h-9 rounded-full border-2 border-purple-500/80 bg-gradient-to-br from-purple-400 to-purple-600 shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),0_2px_6px_rgba(0,0,0,0.3)] flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 transition-transform duration-[1250ms] ease-out"
            style={{ transform: `rotate(${purpleButtonRotation}deg)` }}
            aria-label="Girar e soltar bolinha"
          >
            <span
              className="w-2 h-2.5 rounded-sm bg-purple-500/90 -translate-y-0.5 shadow-sm"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </div>
  );
}
