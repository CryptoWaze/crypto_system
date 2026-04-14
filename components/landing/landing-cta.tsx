'use client';

import Link from 'next/link';
import { ArrowRight, Radar, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

export function LandingCta() {
    return (
        <section
            className="relative landing-section pb-6 sm:pb-8"
            style={{ background: 'radial-gradient(ellipse 90% 70% at 50% 50%, rgba(74,126,217,0.07) 0%, rgba(10,11,14,0.55) 55%, transparent 85%)' }}
            aria-labelledby="cta-heading"
        >
            <LandingAnimateOnScroll className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="landing-animate-in relative overflow-hidden rounded-2xl border border-white/10 bg-[#101219]/75 p-6 backdrop-blur-sm shadow-[0_0_90px_-32px_rgba(74,126,217,0.28)] sm:p-8">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(74,126,217,0.12),transparent_58%),radial-gradient(ellipse_at_80%_78%,rgba(167,139,250,0.1),transparent_62%)]" />
                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary/85 sm:text-xs">
                                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                                ACESSO IMEDIATO
                            </span>
                            <h2 id="cta-heading" className="mt-4 landing-h2 text-left">
                                Acesse a plataforma e inicie seu próximo rastreio em minutos
                            </h2>
                            <p className="landing-animate-in-delay-1 mt-4 max-w-[60ch] landing-body-sm text-left text-white/72">
                                Estruture investigações, acompanhe o fluxo em múltiplas chains e gere evidências técnicas com rapidez e consistência operacional.
                            </p>
                            <div className="landing-animate-in-delay-2 mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                                <Button size="lg" className="h-11 rounded-[8px] bg-primary px-7 text-white shadow-[0_0_30px_-8px_rgba(74,126,217,0.5)] hover:bg-primary/90" asChild>
                                    <Link href="/login" className="inline-flex items-center">
                                        Acessar plataforma
                                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="h-11 rounded-[8px] border-white/15 bg-white/4 px-6 hover:bg-white/8" asChild>
                                    <Link href="#como-funciona" className="inline-flex items-center">
                                        Ver demonstração
                                        <Radar className="ml-2 h-4 w-4" aria-hidden />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                        <div className="landing-animate-in-delay-3 rounded-xl border border-white/8 bg-[#0f1118]/65 p-4 sm:p-5">
                            <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary/85">Confianca operacional</h3>
                            <ul className="mt-4 space-y-3">
                                <li className="flex items-start gap-2 text-sm text-white/75">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                                    Dados tratados com confidencialidade e controles de acesso.
                                </li>
                                <li className="flex items-start gap-2 text-sm text-white/75">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                                    Fluxo de trabalho orientado para uso jurídico e pericial.
                                </li>
                                <li className="flex items-start gap-2 text-sm text-white/75">
                                    <ShieldCheck className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                                    Histórico de casos e rastreios centralizados na conta.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </LandingAnimateOnScroll>
        </section>
    );
}
