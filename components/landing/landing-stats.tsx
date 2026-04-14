'use client';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import { AnimatedCounter } from './animated-counter';

const STATS = [
    { type: 'counter' as const, end: 7, suffix: '+', formatThousands: false, label: 'Blockchains suportadas' },
    { type: 'counter' as const, end: 9000, suffix: '+', formatThousands: true, label: 'Tokens rastreaveis' },
    { type: 'text' as const, value: 'Rede', label: 'Inteligência on-chain' },
] as const;

type LandingStatsProps = {
    embedded?: boolean;
};

export function LandingStats({ embedded = false }: LandingStatsProps) {
    const { ref, isInView } = useInView({ triggerOnce: true });

    return (
        <section
            ref={ref}
            className={cn('landing-animate-on-scroll relative', embedded ? 'pt-3 pb-7 sm:pb-9' : 'landing-section', isInView && 'landing-in-view')}
            style={
                embedded
                    ? undefined
                    : { background: 'linear-gradient(180deg, transparent 0%, rgba(15,15,17,0.55) 25%, rgba(15,15,17,0.55) 75%, transparent 100%)' }
            }
            aria-labelledby="stats-heading"
        >
            <div className={cn('mx-auto sm:px-6', embedded ? 'max-w-4xl px-3' : 'max-w-6xl px-4')}>
                <h2 id="stats-heading" className="sr-only">
                    Capacidades da plataforma
                </h2>
                <ul className={cn('landing-stagger grid', embedded ? 'grid-cols-3 gap-2 sm:gap-12' : 'grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-12')}>
                    {STATS.map((stat, i) => (
                        <li
                            key={i}
                            className={cn(
                                'min-w-0 text-center',
                                embedded && 'relative px-2 sm:px-6',
                                embedded && i > 0 && 'border-l border-white/10',
                            )}
                        >
                            <p
                                className={cn(
                                    'font-serif font-semibold tracking-tight text-foreground',
                                    embedded ? 'text-[1.9rem] leading-[0.95] sm:text-5xl' : 'text-4xl sm:text-5xl',
                                )}
                                style={{ textShadow: '0 0 40px rgba(74,126,217,0.25)' }}
                            >
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
                            <p
                                className={cn(
                                    'text-muted-foreground',
                                    embedded ? 'mt-1.5 text-[10px] leading-tight tracking-[0.08em] text-white/65 sm:mt-2 sm:text-sm sm:tracking-normal' : 'mt-2 text-sm sm:text-base',
                                )}
                            >
                                {stat.label}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
