'use client';

import { FileInput, GitBranch, FileBarChart } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const STEPS = [
    {
        step: 1,
        title: 'Informe o hash',
        description: 'Cole o hash da transação e o valor reportado. É possível incluir múltiplas transações por caso.',
        icon: FileInput,
    },
    {
        step: 2,
        title: 'Rastreio automático',
        description: 'O sistema mapeia o fluxo em múltiplas chains até o destino final: exchanges e hot wallets.',
        icon: GitBranch,
    },
    {
        step: 3,
        title: 'Relatório e grafo',
        description: 'Visualize o grafo, edite nomes e posições, e exporte relatórios para uso jurídico ou pericial.',
        icon: FileBarChart,
    },
] as const;

export function LandingHowItWorks() {
    return (
        <section
            id="como-funciona"
            className="relative border-y border-border/60 bg-background/50 landing-section"
            aria-labelledby="how-heading"
        >
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 id="how-heading" className="landing-animate-in text-center landing-h2 text-foreground">
                    Como funciona
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Três passos para obter o mapeamento completo do fluxo de fundos.
                </p>
                <ol className="landing-stagger mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
                    {STEPS.map((item, i) => (
                        <li key={i} className="relative text-center sm:text-left">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border/80 bg-secondary/50 text-primary">
                                <item.icon className="h-6 w-6" aria-hidden />
                            </div>
                            <p className="mt-4 text-xs font-medium uppercase tracking-wider text-primary">
                                Passo {item.step}
                            </p>
                            <h3 className="mt-2 font-semibold text-foreground">{item.title}</h3>
                            <p className="mt-2 landing-body-sm">{item.description}</p>
                        </li>
                    ))}
                </ol>
            </LandingAnimateOnScroll>
        </section>
    );
}
