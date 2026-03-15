'use client';

import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const CHAINS = [
    'Ethereum',
    'BSC',
    'Polygon',
    'Arbitrum',
    'Base',
    'Avalanche',
] as const;

export function LandingChains() {
    return (
        <section className="relative border-y border-border/60 bg-card/20 landing-section" aria-labelledby="chains-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 id="chains-heading" className="landing-animate-in text-center landing-h2">
                    Blockchains suportadas
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Rastreio e análise em múltiplas redes. Novas chains são integradas conforme demanda.
                </p>
                <ul className="landing-stagger mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
                    {CHAINS.map((chain, i) => (
                        <li
                            key={i}
                            className="rounded-lg border border-border/70 bg-background/80 px-4 py-2.5 text-sm font-medium text-foreground/90 backdrop-blur sm:px-5 sm:py-3"
                        >
                            {chain}
                        </li>
                    ))}
                </ul>
            </LandingAnimateOnScroll>
        </section>
    );
}
