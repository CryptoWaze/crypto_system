'use client';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './animated-counter';

const STATS = [
    { type: 'counter' as const, end: 7, suffix: '+', formatThousands: false, label: 'Blockchains suportadas' },
    { type: 'counter' as const, end: 9000, suffix: '+', formatThousands: true, label: 'Tokens rastreaveis' },
    { type: 'text' as const, value: 'Rede', label: 'Inteligência on-chain' },
] as const;

export function LandingStats() {
    const { ref, isInView } = useInView({ triggerOnce: true });

    return (
        <section
            ref={ref}
            className={cn('landing-animate-on-scroll relative bg-background/50 landing-section', isInView && 'landing-in-view')}
            aria-labelledby="stats-heading"
        >
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 id="stats-heading" className="sr-only">
                    Capacidades da plataforma
                </h2>
                <ul className="landing-stagger grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12">
                    {STATS.map((stat, i) => (
                        <li key={i} className="text-center">
                            <p className="font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                                {stat.type === 'counter' ? (
                                    <AnimatedCounter
                                        end={stat.end}
                                        suffix={stat.suffix}
                                        formatThousands={stat.formatThousands ?? false}
                                        isInView={isInView}
                                    />
                                ) : (
                                    stat.value
                                )}
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground sm:text-base">{stat.label}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
