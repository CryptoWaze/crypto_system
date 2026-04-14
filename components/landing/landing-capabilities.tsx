'use client';

import { Shield, GitBranch, FileBarChart, Network } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const CAPABILITIES = [
    {
        tag: 'INTELIGENCIA',
        title: 'Rede de inteligência on-chain',
        description: 'Infraestrutura de análise que correlaciona endereços, transações e fluxos de valor em múltiplas chains para suporte a investigações e compliance.',
        icon: Network,
        tint: 'rgba(74,126,217,0.35)',
        layout: 'md:col-span-6 lg:col-span-3',
    },
    {
        tag: 'RASTREAMENTO',
        title: 'Rastreio de fluxo de fundos',
        description: 'Do endereço de origem ao destino final: mapeamento automático de hops, identificação de exchanges e hot wallets com suporte a milhares de tokens.',
        icon: GitBranch,
        tint: 'rgba(56,189,248,0.32)',
        layout: 'md:col-span-6 lg:col-span-3',
    },
    {
        tag: 'EVIDENCIAS',
        title: 'Relatórios e evidências',
        description: 'Documentação técnica pronta para processos jurídicos, laudos periciais e recuperação de ativos, com histórico de casos e exportação.',
        icon: FileBarChart,
        tint: 'rgba(99,102,241,0.35)',
        layout: 'md:col-span-3 lg:col-span-2',
    },
    {
        tag: 'SEGURANCA',
        title: 'Segurança e confidencialidade',
        description: 'Acesso restrito, dados tratados conforme boas práticas de segurança da informação e suporte a workflows de equipes especializadas.',
        icon: Shield,
        tint: 'rgba(167,139,250,0.32)',
        layout: 'md:col-span-3 lg:col-span-4',
    },
] as const;

export function LandingCapabilities() {
    return (
        <section
            className="relative landing-section"
            style={{ background: 'rgba(10, 11, 14, 0.62)' }}
            aria-labelledby="capabilities-heading"
        >
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in flex justify-center">
                    <span className="rounded-full border border-primary/20 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        CAPABILIDADES CORE
                    </span>
                </div>
                <h2 id="capabilities-heading" className="landing-animate-in text-center landing-h2">
                    O que a plataforma oferece
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Ferramentas de inteligência on-chain para investigação, compliance e recuperação de ativos.
                </p>
                <ul className="landing-stagger mt-12 grid grid-cols-1 gap-5 md:grid-cols-6 md:auto-rows-[minmax(190px,1fr)] lg:gap-6">
                    {CAPABILITIES.map((item, i) => (
                        <li
                            key={i}
                            className={cn(
                                'capability-bento-card group relative overflow-hidden rounded-2xl border border-white/8 bg-[#121218]/70 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/25 hover:bg-[#16161f]/75 sm:p-7',
                                item.layout
                            )}
                            style={{ '--cap-tint': item.tint } as React.CSSProperties}
                        >
                            <div className="pointer-events-none absolute -right-14 -top-16 h-44 w-44 rounded-full blur-2xl capability-bento-orb" />
                            <div className="pointer-events-none absolute -inset-px rounded-2xl capability-bento-shimmer opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            <div className="relative z-10 flex items-start justify-between gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/8 text-primary shadow-[0_0_24px_-8px_rgba(74,126,217,0.35)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    <item.icon className="h-5 w-5" aria-hidden />
                                </div>
                                <span className="rounded-full border border-white/10 bg-white/3 px-2.5 py-1 text-[10px] font-medium tracking-[0.12em] text-white/70">
                                    {item.tag}
                                </span>
                            </div>
                            <h3 className="relative z-10 mt-5 text-lg font-semibold text-foreground sm:text-[1.1rem]">{item.title}</h3>
                            <p className="relative z-10 mt-2.5 landing-body-sm leading-relaxed text-white/72">{item.description}</p>
                        </li>
                    ))}
                </ul>
            </LandingAnimateOnScroll>
        </section>
    );
}
