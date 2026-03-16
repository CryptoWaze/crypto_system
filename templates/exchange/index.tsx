'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type ExchangeTemplateProps = {
  slug?: string;
};

export function ExchangeTemplate({ slug }: ExchangeTemplateProps) {
  const router = useRouter();
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [mounted, status, router]);

  if (!mounted || status === 'loading') {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  const name = (slug ?? 'binance').toUpperCase();

  return (
    <div className="min-h-screen w-full overflow-auto bg-background">
      <AppHeader />
      <div className="h-14 shrink-0" aria-hidden />

      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-6xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        {/* Ticker mockado */}
        <section className="relative overflow-hidden rounded-[6px] border border-border bg-card/80 px-4 py-2">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card to-transparent" />
          <div className="flex animate-[ticker_22s_linear_infinite] gap-10 whitespace-nowrap text-xs font-mono text-muted-foreground">
            {[
              ['BTC', '$84.201', '+2,4%'],
              ['ETH', '$3.182', '+1,1%'],
              ['SOL', '$142,50', '-0,8%'],
              ['BNB', '$412', '+0,5%'],
              ['USDT', '$1,00', '+0,0%'],
              ['XRP', '$0,614', '+3,2%'],
            ].flatMap((t, idx) => [
              <span key={`${t[0]}-${idx}-a`} className="flex items-center gap-2">
                <span className="text-muted-foreground">{t[0]}</span>
                <span className="text-foreground">{t[1]}</span>
                <span className={t[2].startsWith('-') ? 'text-red-400' : 'text-emerald-400'}>{t[2]}</span>
              </span>,
            ])}
          </div>
        </section>

        {/* Cover + perfil */}
        <section className="overflow-hidden rounded-[10px] border border-border bg-[#15161b] shadow-[0_0_40px_-18px_var(--glow-blue)]">
          <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-sky-900/70 via-sky-800/50 to-slate-900">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(79,195,247,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(79,195,247,0.12) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />
            <div
              className="pointer-events-none absolute inset-x-[-10%] bottom-[-40%]"
              style={{
                height: '160px',
                background:
                  'radial-gradient(ellipse at center, rgba(79,195,247,0.35) 0%, transparent 70%)',
              }}
            />
            <div className="absolute left-6 top-5 rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-yellow-300 shadow-[0_0_16px_rgba(250,204,21,0.35)]">
              ⬡ RANK #1 — CEX GLOBAL
            </div>
            <div className="absolute right-6 top-5 text-right text-xs font-mono">
              <p className="text-xs tracking-[0.18em] text-muted-foreground">VOLUME 24H</p>
              <p className="mt-1 text-lg font-semibold text-emerald-400 drop-shadow-[0_0_16px_rgba(16,185,129,0.6)]">
                $28,4B
              </p>
            </div>
          </div>

          <div className="border-t border-border bg-[#191b22]/95 px-6 pb-6 pt-4">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="-mt-12">
                  <div className="relative h-20 w-20 rounded-[6px] border border-primary/80 bg-gradient-to-br from-sky-900 via-slate-900 to-slate-950 shadow-[0_0_32px_rgba(56,189,248,0.55)]">
                    <div className="flex h-full w-full items-center justify-center font-mono text-3xl font-black text-primary">
                      {name.charAt(0) || 'E'}
                    </div>
                    <span className="absolute inset-0 rounded-[6px] border border-sky-400/30" />
                    <span className="absolute -left-1 -top-1 h-2 w-2 border-l border-t border-cyan-300" />
                    <span className="absolute -right-1 -top-1 h-2 w-2 border-r border-t border-cyan-300" />
                    <span className="absolute -left-1 -bottom-1 h-2 w-2 border-l border-b border-cyan-300" />
                    <span className="absolute -right-1 -bottom-1 h-2 w-2 border-r border-b border-cyan-300" />
                    <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full border border-emerald-400 bg-emerald-400 shadow-[0_0_10px_rgba(74,222,128,0.9)]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-display text-2xl font-semibold tracking-[0.22em] text-foreground">
                      {name}
                    </h1>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-white shadow-[0_0_14px_rgba(59,130,246,0.8)]">
                      ✓
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-primary">
                    @{slug ?? 'binance'} · exchange.bnb
                  </p>
                  <p className="mt-2 max-w-xl text-xs text-muted-foreground">
                    A maior exchange centralizada do mundo por volume. Oferece spot, futuros, staking,
                    launchpad e custódia em múltiplas redes, com foco em liquidez e infraestrutura
                    global.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-mono tracking-[0.16em]">
                    <span className="rounded-[3px] border border-emerald-400/60 bg-emerald-400/10 px-2 py-0.5 text-emerald-300">
                      ● OPERACIONAL
                    </span>
                    <span className="rounded-[3px] border border-sky-400/60 bg-sky-400/10 px-2 py-0.5 text-sky-300">
                      CEX
                    </span>
                    <span className="rounded-[3px] border border-sky-400/60 bg-sky-400/10 px-2 py-0.5 text-sky-300">
                      CUSTODIAL
                    </span>
                    <span className="rounded-[3px] border border-amber-300/70 bg-amber-300/10 px-2 py-0.5 text-amber-200">
                      KYC OBRIGATÓRIO
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="h-9 rounded-[6px] border-primary/70 bg-transparent px-4 text-[11px] font-semibold tracking-[0.18em] text-primary hover:bg-primary/10"
                >
                  Seguir exchange
                </Button>
                <Button className="h-9 rounded-[6px] bg-primary px-4 text-[11px] font-semibold tracking-[0.18em] text-white shadow-[0_0_26px_-4px_var(--glow-blue)] hover:bg-primary/90">
                  Ver wallets
                </Button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-[1px] rounded-[4px] border border-border bg-border/60 text-center sm:grid-cols-5">
              {[
                ['USUÁRIOS', '185M'],
                ['PAÍSES', '180+'],
                ['PARES', '1.400+'],
                ['VOL 24H', '$28,4B'],
                ['RESERVAS', '$121B'],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col bg-[#191b22] px-4 py-3 text-xs hover:bg-[#1f2330]"
                >
                  <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                    {label}
                  </span>
                  <span className="mt-1 font-mono text-sm font-semibold text-sky-300">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Conteúdo principal */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)]">
          {/* Coluna esquerda: hot wallets + atividade */}
          <div className="flex flex-col gap-5">
            <div className="relative overflow-hidden rounded-[8px] border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border/80 bg-muted/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-sky-300">
                  <span className="h-3 w-[3px] rounded-sm bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  HOT WALLETS
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  8 ENDEREÇOS RASTREADOS
                </span>
              </div>

              <div className="divide-y divide-border/60">
                {[
                  {
                    icon: '₿',
                    name: 'BTC Hot Wallet 1',
                    addr: '1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s',
                    chain: 'BITCOIN',
                    chainClass: 'border-amber-400/60 text-amber-300 bg-amber-400/10',
                    usd: '$4,2B',
                    change: '▲ 1,8%',
                    changeClass: 'text-emerald-400',
                  },
                  {
                    icon: 'Ξ',
                    name: 'ETH Hot Wallet 1',
                    addr: '0x28C6c06298d514Db089934071355E5743bf21d60',
                    chain: 'ETHEREUM',
                    chainClass: 'border-indigo-400/60 text-indigo-300 bg-indigo-400/10',
                    usd: '$2,8B',
                    change: '▲ 3,2%',
                    changeClass: 'text-emerald-400',
                  },
                  {
                    icon: '◎',
                    name: 'SOL Hot Wallet 1',
                    addr: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
                    chain: 'SOLANA',
                    chainClass: 'border-fuchsia-400/60 text-fuchsia-300 bg-fuchsia-400/10',
                    usd: '$890M',
                    change: '▼ 0,6%',
                    changeClass: 'text-red-400',
                  },
                  {
                    icon: '⬡',
                    name: 'BNB Chain Wallet',
                    addr: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
                    chain: 'BNB CHAIN',
                    chainClass: 'border-yellow-300/60 text-yellow-200 bg-yellow-300/10',
                    usd: '$3,4B',
                    change: '▲ 0,9%',
                    changeClass: 'text-emerald-400',
                  },
                ].map((w) => (
                  <div
                    key={w.addr}
                    className="grid grid-cols-[40px,minmax(0,1fr),auto,auto] items-center gap-3 px-4 py-3 hover:bg-muted/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[4px] border border-border bg-background text-lg">
                      {w.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate font-mono text-xs font-semibold text-foreground">
                          {w.name}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                        {w.addr}
                      </p>
                    </div>
                    <span
                      className={`ml-2 rounded-[3px] border px-2 py-0.5 text-[10px] font-mono tracking-[0.12em] ${w.chainClass}`}
                    >
                      {w.chain}
                    </span>
                    <div className="ml-3 text-right">
                      <p className="font-mono text-xs text-foreground">{w.usd}</p>
                      <p className={`mt-0.5 font-mono text-[10px] ${w.changeClass}`}>{w.change}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border/80 bg-muted/10 px-4 py-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-sky-300">
                  <span className="h-3 w-[3px] rounded-sm bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  ATIVIDADE RECENTE
                </div>
                <span className="font-mono text-[11px] text-emerald-400">LIVE</span>
              </div>
              <div className="divide-y divide-border/60">
                {[
                  {
                    color: 'bg-emerald-400',
                    text: 'Transferência recebida de 21.400 USDT via Tron Network.',
                    time: 'há 2 minutos',
                  },
                  {
                    color: 'bg-red-400',
                    text: 'Saída de 142 BTC para cold wallet marcada como custódia interna.',
                    time: 'há 18 minutos',
                  },
                  {
                    color: 'bg-sky-400',
                    text: 'Novo endereço ETH associado ao cluster da exchange detectado.',
                    time: 'há 1 hora',
                  },
                  {
                    color: 'bg-amber-300',
                    text: 'Atualização de reservas: +$340M em BTC adicionados às reservas declaradas.',
                    time: 'há 3 horas',
                  },
                ].map((a, idx) => (
                  <div key={idx} className="flex gap-3 px-4 py-3">
                    <span
                      className={`mt-1 h-2 w-2 rounded-full shadow-[0_0_10px_rgba(248,250,252,0.5)] ${a.color}`}
                    />
                    <div className="text-xs">
                      <p className="text-muted-foreground">{a.text}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita: score + info geral */}
          <div className="flex flex-col gap-5">
            <div className="overflow-hidden rounded-[8px] border border-border bg-card">
              <div className="border-b border-border/80 bg-muted/10 px-4 py-3">
                <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-sky-300">
                  <span className="h-3 w-[3px] rounded-sm bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  SECURITY SCORE
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 px-4 pb-4 pt-5">
                <div className="relative h-28 w-28">
                  <svg viewBox="0 0 120 120" className="h-28 w-28 -rotate-90">
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="fill-none stroke-background stroke-[6]"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      className="fill-none stroke-emerald-400 stroke-[6] drop-shadow-[0_0_8px_rgba(74,222,128,0.9)]"
                      strokeDasharray={314}
                      strokeDashoffset={47}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-2xl font-black text-emerald-400 drop-shadow-[0_0_14px_rgba(74,222,128,0.9)]">
                    85
                  </span>
                </div>
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
                  CONFIABILIDADE GERAL
                </p>
              </div>
              <div className="space-y-3 px-4 pb-4">
                {[
                  ['Proof of Reserves', '92%'],
                  ['Transparência', '78%'],
                  ['Histórico', '70%'],
                  ['Segurança técnica', '88%'],
                ].map(([label, value], idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">{label}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-24 overflow-hidden rounded-full bg-muted/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.7)]"
                          style={{ width: value }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-sky-200">{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[8px] border border-border bg-card">
              <div className="border-b border-border/80 bg-muted/10 px-4 py-3">
                <p className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-sky-300">
                  <span className="h-3 w-[3px] rounded-sm bg-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.9)]" />
                  DADOS GERAIS
                </p>
              </div>
              <div className="divide-y divide-border/60 text-xs">
                {[
                  ['Fundada', '2017 — Cingapura'],
                  ['CEO', 'Richard Teng'],
                  ['Regulação', 'Parcial'],
                  ['Proof of Reserves', 'ATIVO'],
                  ['Carteiras rastreadas', '127'],
                  ['Última atualização', '12 Mar 2026, 14:22'],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-4 py-2.5 text-[11px]"
                  >
                    <span className="font-mono text-muted-foreground">{label}</span>
                    <span className="max-w-[55%] text-right font-mono text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

