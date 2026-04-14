'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Radar } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const CHAINS = [
    { name: 'Ethereum', tone: 'rgba(129,140,248,0.42)', desktopClass: 'left-[50%] top-5 -translate-x-1/2', icon: '/moedas/ethereum-eth-logo.png' },
    { name: 'BSC', tone: 'rgba(250,204,21,0.4)', desktopClass: 'left-[14%] top-[26%]', icon: '/moedas/bnb-bnb-logo.png' },
    { name: 'Polygon', tone: 'rgba(139,92,246,0.42)', desktopClass: 'right-[14%] top-[26%]', icon: '/moedas/polygon-matic-logo.png' },
    { name: 'Arbitrum', tone: 'rgba(59,130,246,0.42)', desktopClass: 'left-[6%] top-[52%] -translate-y-1/2', icon: '/moedas/arbitrum-arb-logo.png' },
    { name: 'Avalanche', tone: 'rgba(239,68,68,0.4)', desktopClass: 'right-[6%] top-[52%] -translate-y-1/2', icon: '/moedas/avalanche-avax-logo.png' },
    { name: 'Bitcoin', tone: 'rgba(251,146,60,0.42)', desktopClass: 'left-[22%] bottom-[10%]', icon: '/moedas/bitcoin-btc-logo.png' },
    { name: 'Solana', tone: 'rgba(45,212,191,0.4)', desktopClass: 'right-[22%] bottom-[10%]', icon: '/moedas/solana-sol-logo.png' },
] as const;

export function LandingChains() {
    return (
        <section className="relative landing-section" style={{ background: 'rgba(20, 21, 26, 0.28)' }} aria-labelledby="chains-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in flex justify-center">
                    <span className="rounded-full border border-primary/20 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        REDES RASTREAVEIS
                    </span>
                </div>
                <h2 id="chains-heading" className="landing-animate-in text-center landing-h2">
                    Blockchains suportadas
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Rastreio e análise em múltiplas redes. Novas chains são integradas conforme demanda.
                </p>
                <div className="landing-stagger mt-12 md:hidden">
                    <ul className="relative mx-auto flex w-full max-w-sm flex-col gap-3.5">
                        {CHAINS.map((chain, i) => (
                            <li
                                key={i}
                                className="chain-pill-live group relative overflow-hidden rounded-2xl border border-white/8 bg-[#12131a]/70 py-3 pl-14 pr-4 text-sm font-medium text-foreground/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30"
                                style={{ '--chain-tone': chain.tone } as CSSProperties}
                            >
                                <span className="pointer-events-none absolute -right-6 -top-7 h-14 w-14 rounded-full blur-xl chain-pill-orb" />
                                <span className="absolute left-[13px] top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-primary/30 bg-[#0f1422] shadow-[0_0_20px_-10px_rgba(74,126,217,0.8)]">
                                    <img src={chain.icon} alt={chain.name} className="h-4 w-4 rounded-full object-contain" loading="lazy" />
                                </span>
                                <span className="relative z-10 block text-[15px] font-semibold text-foreground">{chain.name}</span>
                                <span className="relative z-10 mt-0.5 block text-[10px] uppercase tracking-[0.14em] text-primary/75">
                                    Rede rastreável
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="landing-stagger relative mt-14 hidden md:block">
                    <div className="relative h-96 overflow-hidden rounded-3xl border border-white/10 bg-[#0f1118]/72 shadow-[0_0_100px_-30px_rgba(74,126,217,0.22)] backdrop-blur-sm">
                        <svg
                            className="chains-network-link absolute inset-0 h-full w-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden
                        >
                            <line x1="50" y1="50" x2="50" y2="12" />
                            <line x1="50" y1="50" x2="20" y2="28" />
                            <line x1="50" y1="50" x2="80" y2="28" />
                            <line x1="50" y1="50" x2="10" y2="50" />
                            <line x1="50" y1="50" x2="90" y2="50" />
                            <line x1="50" y1="50" x2="28" y2="82" />
                            <line x1="50" y1="50" x2="72" y2="82" />
                        </svg>

                        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
                            <Link
                                href="/login"
                                aria-label="Acessar plataforma"
                                className="chains-network-core flex h-28 w-28 flex-col items-center justify-center rounded-full border border-primary/30 bg-[#121727]/85 text-center text-primary shadow-[0_0_40px_-10px_rgba(74,126,217,0.6)] transition-transform duration-300 hover:scale-[1.03] hover:border-primary/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                            >
                                <Radar className="h-5 w-5" aria-hidden />
                                <span className="mt-1 text-[10px] font-semibold tracking-[0.14em] text-primary/90">AUTOTRACK</span>
                                <span className="text-[10px] text-white/62">ENGINE</span>
                            </Link>
                        </div>

                        {CHAINS.map((chain) => (
                            <div
                                key={chain.name}
                                className={`chains-network-node absolute ${chain.desktopClass}`}
                                style={{ '--chain-tone': chain.tone } as CSSProperties}
                            >
                                <span className="pointer-events-none absolute -right-6 -top-6 h-12 w-12 rounded-full blur-xl chain-pill-orb" />
                                <span className="relative z-10 inline-flex items-center gap-2">
                                    <img src={chain.icon} alt={chain.name} className="h-4 w-4 rounded-full object-contain" loading="lazy" />
                                    {chain.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </LandingAnimateOnScroll>
        </section>
    );
}
