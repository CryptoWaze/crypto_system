'use client';

import { Shield, GitBranch, FileBarChart, Network } from 'lucide-react';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

const CAPABILITIES = [
    {
        title: 'Rede de inteligência on-chain',
        description: 'Infraestrutura de análise que correlaciona endereços, transações e fluxos de valor em múltiplas chains para suporte a investigações e compliance.',
        icon: Network,
    },
    {
        title: 'Rastreio de fluxo de fundos',
        description: 'Do endereço de origem ao destino final: mapeamento automático de hops, identificação de exchanges e hot wallets com suporte a milhares de tokens.',
        icon: GitBranch,
    },
    {
        title: 'Relatórios e evidências',
        description: 'Documentação técnica pronta para processos jurídicos, laudos periciais e recuperação de ativos, com histórico de casos e exportação.',
        icon: FileBarChart,
    },
    {
        title: 'Segurança e confidencialidade',
        description: 'Acesso restrito, dados tratados conforme boas práticas de segurança da informação e suporte a workflows de equipes especializadas.',
        icon: Shield,
    },
] as const;

export function LandingCapabilities() {
    return (
        <section className="relative landing-section" aria-labelledby="capabilities-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 id="capabilities-heading" className="landing-animate-in text-center landing-h2">
                    O que a plataforma oferece
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mx-auto mt-4 max-w-[70ch] text-center landing-body-sm">
                    Ferramentas de inteligência on-chain para investigação, compliance e recuperação de ativos.
                </p>
                <ul className="landing-stagger mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-10">
                    {CAPABILITIES.map((item, i) => (
                        <li
                            key={i}
                            className="rounded-xl border border-border/60 bg-card/40 p-6 transition-colors hover:border-border hover:bg-card/60 sm:p-8"
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
