'use client';

import { FileInput, GitBranch, FileBarChart } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';
import { LandingHowItWorksDemoGraph } from './landing-how-it-works-demo-graph';

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
            className="relative landing-section"
            style={{ background: 'rgba(10, 11, 14, 0.62)' }}
            aria-labelledby="how-heading"
        >
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in flex justify-center">
                    <span className="rounded-full border border-primary/20 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        FLUXO EM 3 ETAPAS
                    </span>
                </div>
                <h2 id="how-heading" className="landing-animate-in text-center landing-h2 text-foreground">
                    Como funciona
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Três passos para obter o mapeamento completo do fluxo de fundos.
                </p>
                <ol className="landing-stagger relative mt-14 grid grid-cols-1 gap-10 sm:mt-16 sm:grid-cols-3 sm:gap-8">
                    <span className="pointer-events-none absolute left-[1.1rem] top-5 bottom-5 w-px bg-linear-to-b from-primary/10 via-primary/45 to-primary/10 sm:hidden" aria-hidden />
                    <span className="pointer-events-none absolute left-0 right-0 top-5 hidden h-px bg-linear-to-r from-primary/8 via-primary/45 to-primary/8 sm:block" aria-hidden />
                    {STEPS.map((item, i) => (
                        <li key={i} className="group relative pl-10 sm:pl-0 sm:pt-12">
                            <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-primary/35 bg-[#101725] text-xs font-semibold tracking-[0.16em] text-primary shadow-[0_0_24px_-8px_rgba(74,126,217,0.55)] sm:left-1/2 sm:-translate-x-1/2">
                                {String(item.step).padStart(2, '0')}
                            </div>
                            <div className="flex items-center gap-3 sm:justify-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/8 text-primary transition-transform duration-500 group-hover:scale-105">
                                    <item.icon className="h-4 w-4" aria-hidden />
                                </div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/85 sm:hidden">Passo {item.step}</p>
                            </div>
                            <h3 className="mt-4 text-left text-xl font-semibold text-foreground sm:text-center">{item.title}</h3>
                            <p className="mt-2 text-left landing-body-sm leading-relaxed text-white/72 sm:mx-auto sm:max-w-[28ch] sm:text-center">{item.description}</p>
                        </li>
                    ))}
                </ol>
                <LandingHowItWorksDemoGraph />
            </LandingAnimateOnScroll>
        </section>
    );
}
