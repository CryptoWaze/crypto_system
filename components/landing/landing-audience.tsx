'use client';

import { Scale, Search, ShieldCheck, Wallet } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const AUDIENCE_ITEMS = [
    {
        title: 'Escritórios de advocacia',
        description: 'Tenha o grafo de fluxo de fundos pronto para anexar ao processo e laudos técnicos em minutos.',
        icon: Scale,
    },
    {
        title: 'Perícia e investigação',
        description: 'Rastreio de transações para perícias criminais e cíveis, com identificação de destinos e correlação de endereços.',
        icon: Search,
    },
    {
        title: 'Compliance',
        description: 'Análise de movimentações para conformidade regulatória, due diligence e monitoramento de operações.',
        icon: ShieldCheck,
    },
    {
        title: 'Recuperação de ativos',
        description: 'Mapeamento do caminho dos valores até exchanges e carteiras de destino para ações de recuperação.',
        icon: Wallet,
    },
] as const;

export function LandingAudience() {
    return (
        <section className="relative border-y border-border/60 bg-card/20 landing-section" aria-labelledby="audience-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 id="audience-heading" className="landing-animate-in text-center landing-h2">
                    Para quem
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Profissionais e equipes que precisam de inteligência on-chain confiável.
                </p>
                <ul className="landing-stagger mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
                    {AUDIENCE_ITEMS.map((item, i) => (
                        <li
                            key={i}
                            className="rounded-xl border border-border/60 bg-background/60 p-6 transition-colors hover:border-border hover:bg-background/80 sm:p-8"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/80 bg-secondary/50 text-primary">
                                <item.icon className="h-5 w-5" aria-hidden />
                            </div>
                            <h3 className="mt-4 font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 landing-body-sm leading-relaxed">{item.description}</p>
                        </li>
                    ))}
                </ul>
            </LandingAnimateOnScroll>
        </section>
    );
}
