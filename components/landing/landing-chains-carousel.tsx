'use client';

import { useEffect, useState } from 'react';
import { getChains } from '@/lib/services/chains/get-chains.service';
import type { Chain } from '@/lib/types/chain';
import { cn } from '@/lib/utils';

const CAROUSEL_CHAIN_SLUGS = ['eth', 'bsc', 'polygon', 'arbitrum', 'avalanche', 'bitcoin', 'solana'] as const;
const CHAIN_LOCAL_ICONS: Record<string, string> = {
    eth: '/moedas/ethereum-eth-logo.png',
    bsc: '/moedas/bnb-bnb-logo.png',
    polygon: '/moedas/polygon-matic-logo.png',
    arbitrum: '/moedas/arbitrum-arb-logo.png',
    avalanche: '/moedas/avalanche-avax-logo.png',
    bitcoin: '/moedas/bitcoin-btc-logo.png',
    solana: '/moedas/solana-sol-logo.png',
};

const FALLBACK_CHAINS: Chain[] = [
    { slug: 'eth', name: 'Ethereum', iconUrl: null },
    { slug: 'bsc', name: 'BSC', iconUrl: null },
    { slug: 'polygon', name: 'Polygon', iconUrl: null },
    { slug: 'arbitrum', name: 'Arbitrum', iconUrl: null },
    { slug: 'avalanche', name: 'Avalanche', iconUrl: null },
    { slug: 'bitcoin', name: 'Bitcoin', iconUrl: null },
    { slug: 'solana', name: 'Solana', iconUrl: null },
];

function filterChainsForCarousel(chains: Chain[]): Chain[] {
    const allowed = new Set(CAROUSEL_CHAIN_SLUGS);
    const filtered = chains.filter((c) => allowed.has(c.slug as (typeof CAROUSEL_CHAIN_SLUGS)[number]));
    if (filtered.length > 0) return filtered;
    return FALLBACK_CHAINS;
}

function ChainLogo({ chain, index, embedded = false }: { chain: Chain; index: number; embedded?: boolean }) {
    const [imageError, setImageError] = useState(false);
    const logoSrc = CHAIN_LOCAL_ICONS[chain.slug] ?? chain.iconUrl ?? null;
    const showImage = logoSrc && !imageError;

    return (
        <li
            className={cn(
                'chains-carousel-item flex shrink-0 items-center justify-center px-6 py-4',
                embedded
                    ? 'rounded-2xl border border-white/8 bg-[#111218]/80 shadow-[0_10px_28px_-16px_rgba(0,0,0,0.9),0_0_24px_-14px_rgba(74,126,217,0.5)] backdrop-blur-sm'
                    : 'rounded-xl border border-border/40 bg-card/40',
            )}
            style={{ '--i': index } as React.CSSProperties}
        >
            {showImage && logoSrc ? (
                <img
                    src={logoSrc}
                    alt={chain.name ?? chain.slug}
                    width={48}
                    height={48}
                    className="h-10 w-10 object-contain sm:h-12 sm:w-12"
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="text-sm font-medium text-muted-foreground sm:text-base">{chain.name ?? chain.slug}</span>
            )}
        </li>
    );
}

type LandingChainsCarouselProps = {
    embedded?: boolean;
};

export function LandingChainsCarousel({ embedded = false }: LandingChainsCarouselProps) {
    const [chains, setChains] = useState<Chain[]>(FALLBACK_CHAINS);

    useEffect(() => {
        getChains().then((result) => {
            if (result.ok && result.data.length > 0) {
                setChains(filterChainsForCarousel(result.data));
            }
        });
    }, []);

    const marqueeChains = Array.from({ length: 3 }, () => chains).flat();

    return (
        <section
            className={
                embedded
                    ? 'relative w-screen max-w-none -ml-[calc(50vw-50%)] overflow-x-hidden overflow-y-visible py-4 sm:py-6 mt-2'
                    : 'relative w-full overflow-hidden py-8'
            }
            aria-label="Blockchains suportadas"
        >
            {!embedded ? <div className="absolute inset-0 bg-linear-to-b from-background via-[#0a0a0c] to-background" aria-hidden /> : null}
            {embedded ? (
                <div className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-linear-to-b from-background/85 to-transparent" aria-hidden />
            ) : null}
            <div
                className={
                    embedded
                        ? 'relative flex w-full flex-col justify-center overflow-x-hidden overflow-y-visible py-3'
                        : 'relative flex w-full flex-col justify-center py-6 overflow-hidden'
                }
            >
                <div className="chains-carousel-marquee">
                    <ul className={cn('chains-carousel-track chains-carousel-track-a', embedded ? 'gap-3' : 'gap-4')}>
                        {marqueeChains.map((chain, i) => (
                            <ChainLogo key={`a-${chain.slug}-${i}`} chain={chain} index={i} embedded={embedded} />
                        ))}
                    </ul>
                    <ul className={cn('chains-carousel-track chains-carousel-track-b', embedded ? 'gap-3' : 'gap-4')} aria-hidden>
                        {marqueeChains.map((chain, i) => (
                            <ChainLogo key={`b-${chain.slug}-${i}`} chain={chain} index={i} embedded={embedded} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
