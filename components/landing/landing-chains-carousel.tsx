'use client';

import { useEffect, useState } from 'react';
import { getChains } from '@/lib/services/chains/get-chains.service';
import type { Chain } from '@/lib/types/chain';

const CAROUSEL_CHAIN_SLUGS = ['eth', 'bsc', 'polygon', 'arbitrum', 'avalanche', 'bitcoin', 'solana'] as const;

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

function ChainLogo({ chain, index }: { chain: Chain; index: number }) {
    const [imageError, setImageError] = useState(false);
    const showImage = chain.iconUrl && !imageError;

    return (
        <li
            className="chains-carousel-item flex shrink-0 items-center justify-center rounded-xl border border-border/40 bg-card/40 px-6 py-4"
            style={{ '--i': index } as React.CSSProperties}
        >
            {showImage && chain.iconUrl ? (
                <img
                    src={chain.iconUrl}
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

export function LandingChainsCarousel() {
    const [chains, setChains] = useState<Chain[]>(FALLBACK_CHAINS);

    useEffect(() => {
        getChains().then((result) => {
            if (result.ok && result.data.length > 0) {
                setChains(filterChainsForCarousel(result.data));
            }
        });
    }, []);

    const repeated = Array.from({ length: 4 }, () => chains).flat();

    return (
        <section className="relative w-full overflow-hidden py-8" aria-label="Blockchains suportadas">
            <div className="absolute inset-0 bg-gradient-to-b from-background via-[#0a0a0c] to-background" aria-hidden />
            <div className="relative flex w-full flex-col justify-center py-6 overflow-hidden">
                <div className="chains-carousel-track flex w-max gap-4">
                    {repeated.map((chain, i) => (
                        <ChainLogo key={`${chain.slug}-${i}`} chain={chain} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
