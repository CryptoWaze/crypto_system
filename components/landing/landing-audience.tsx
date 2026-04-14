'use client';

import type { CSSProperties } from 'react';
import { Scale, Search, ShieldCheck, Wallet } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const AUDIENCE_ITEMS = [
    {
        tag: 'JURIDICO',
        title: 'Escritórios de advocacia',
        description: 'Tenha o grafo de fluxo de fundos pronto para anexar ao processo e laudos técnicos em minutos.',
        icon: Scale,
        tone: 'rgba(74,126,217,0.42)',
    },
    {
        tag: 'FORENSE',
        title: 'Perícia e investigação',
        description: 'Rastreio de transações para perícias criminais e cíveis, com identificação de destinos e correlação de endereços.',
        icon: Search,
        tone: 'rgba(56,189,248,0.4)',
    },
    {
        tag: 'RISCO',
        title: 'Compliance',
        description: 'Análise de movimentações para conformidade regulatória, due diligence e monitoramento de operações.',
        icon: ShieldCheck,
        tone: 'rgba(99,102,241,0.42)',
    },
    {
        tag: 'RECUPERACAO',
        title: 'Recuperação de ativos',
        description: 'Mapeamento do caminho dos valores até exchanges e carteiras de destino para ações de recuperação.',
        icon: Wallet,
        tone: 'rgba(167,139,250,0.4)',
    },
] as const;

export function LandingAudience() {
    return (
        <section
            className="relative landing-section"
            style={{ background: 'rgba(20, 21, 26, 0.28)' }}
            aria-labelledby="audience-heading"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="chains-life-beam absolute left-1/2 top-1/2 h-[310px] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-65" />
            </div>
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in flex justify-center">
                    <span className="rounded-full border border-primary/20 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        PERFIS ATENDIDOS
                    </span>
                </div>
                <h2 id="audience-heading" className="landing-animate-in text-center landing-h2">
                    Para quem
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Profissionais e equipes que precisam de inteligência on-chain confiável.
                </p>
                <ul className="landing-stagger audience-flow mt-12 grid grid-cols-1 gap-8 md:mx-auto md:max-w-5xl md:grid-cols-2 md:gap-x-10 md:gap-y-12">
                    {AUDIENCE_ITEMS.map((item, i) => (
                        <li key={i} className="audience-flow-item group relative max-w-136 pl-15 sm:pl-16 md:mx-auto" style={{ '--audience-tone': item.tone } as CSSProperties}>
                            <div className="audience-flow-line absolute left-5 top-14 bottom-[-1.1rem] w-px md:left-5" />
                            <div className="audience-flow-node absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-[#10141f] text-primary shadow-[0_0_26px_-8px_rgba(74,126,217,0.5)] transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                                <item.icon className="h-5 w-5" aria-hidden />
                            </div>
                            <p className="text-[10px] font-semibold tracking-[0.16em] text-primary/85">{item.tag}</p>
                            <h3 className="mt-1 text-xl font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 max-w-[46ch] landing-body-sm leading-relaxed text-white/72">{item.description}</p>
                            <div className="mt-4 h-px w-full max-w-[280px] bg-linear-to-r from-primary/45 via-primary/15 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                            <span className="pointer-events-none absolute -left-3 top-2 h-16 w-16 rounded-full blur-xl audience-flow-orb" />
                        </li>
                    ))}
                </ul>
            </LandingAnimateOnScroll>
        </section>
    );
}
