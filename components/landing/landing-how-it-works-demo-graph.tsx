'use client';

import { useState } from 'react';
import { Radar, Expand, Sparkles } from 'lucide-react';
import { FlowGraphReadOnly } from '@/components/flow/FlowGraphReadOnly';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DEMO_TRACKING_FLOW_GRAPH } from '@/lib/landing/demo-tracking-flow-graph';

const PREVIEW_SHOTS = [
    {
        title: 'Mapa inicial',
        subtitle: 'Entrada do hash e rastreio',
        glow: 'rgba(74,126,217,0.22)',
    },
    {
        title: 'Fluxo expandido',
        subtitle: 'Conexoes entre carteiras',
        glow: 'rgba(56,189,248,0.24)',
    },
    {
        title: 'Conclusao',
        subtitle: 'Destino final e evidencias',
        glow: 'rgba(167,139,250,0.22)',
    },
] as const;

export function LandingHowItWorksDemoGraph() {
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    return (
        <div className="landing-animate-in landing-animate-in-delay-2 mt-12 w-full">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#101117]/75 p-4 shadow-[0_0_90px_-30px_rgba(74,126,217,0.22)] sm:p-6">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_20%,rgba(74,126,217,0.1),transparent_55%),radial-gradient(ellipse_at_80%_80%,rgba(167,139,250,0.08),transparent_55%)]" />
                <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {PREVIEW_SHOTS.map((shot, i) => (
                        <article key={shot.title} className="group relative overflow-hidden rounded-xl border border-white/8 bg-[#0f1016] p-3">
                            <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-white/8 bg-black/35">
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        background: `radial-gradient(ellipse at 25% 25%, ${shot.glow}, transparent 62%), linear-gradient(180deg, rgba(20,22,30,0.85), rgba(9,10,14,0.96))`,
                                    }}
                                />
                                <div className="absolute inset-x-4 top-4 h-2 rounded-full bg-white/18" />
                                <div className="absolute left-4 top-9 h-6 w-1/3 rounded-md bg-primary/30" />
                                <div className="absolute right-4 top-9 h-6 w-1/4 rounded-md bg-white/10" />
                                <div className="absolute left-4 right-4 top-20 h-px bg-linear-to-r from-transparent via-primary/45 to-transparent" />
                                <div className="absolute left-4 top-26 h-10 w-12 rounded-lg border border-primary/30 bg-primary/15" />
                                <div className="absolute left-19 top-26 right-4 h-3 rounded-full bg-white/12" />
                                <div className="absolute left-19 top-31 right-10 h-2 rounded-full bg-white/10" />
                                <div className="absolute left-4 right-4 bottom-4 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
                                <div className="absolute inset-y-0 -left-1/2 w-[45%] bg-linear-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 group-hover:translate-x-[300%]" />
                            </div>
                            <div className="mt-3">
                                <p className="text-sm font-semibold text-foreground">{shot.title}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{shot.subtitle}</p>
                            </div>
                            <span className="absolute right-3 top-3 h-9 w-9 rounded-full blur-xl" style={{ background: shot.glow }} />
                            <span className="absolute inset-0 rounded-xl ring-1 ring-transparent transition duration-300 group-hover:ring-primary/35" />
                        </article>
                    ))}
                </div>
                <div className="relative z-10 mt-6 flex justify-center">
                    <Button
                        type="button"
                        onClick={() => setIsDemoOpen(true)}
                        className="h-11 rounded-[8px] bg-primary px-6 text-white shadow-[0_0_30px_-8px_rgba(74,126,217,0.5)] hover:bg-primary/90"
                    >
                        <Radar className="mr-2 h-4 w-4" aria-hidden />
                        Abrir demonstracao interativa
                    </Button>
                </div>
            </div>

            <Dialog open={isDemoOpen} onOpenChange={setIsDemoOpen}>
                <DialogContent className="data-[state=closed]:zoom-out-98 data-[state=open]:zoom-in-98 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-3 rounded-3xl border border-white/12 bg-[linear-gradient(180deg,rgba(17,19,26,0.94),rgba(11,12,18,0.96))] p-3 shadow-[0_36px_90px_-30px_rgba(0,0,0,0.88),0_0_0_1px_rgba(91,141,239,0.14)] backdrop-blur-xl sm:w-[calc(100vw-2rem)] sm:max-w-5xl sm:p-5 **:data-[slot=dialog-close]:top-5 **:data-[slot=dialog-close]:right-5 **:data-[slot=dialog-close]:rounded-full **:data-[slot=dialog-close]:border **:data-[slot=dialog-close]:border-white/12 **:data-[slot=dialog-close]:bg-white/5 **:data-[slot=dialog-close]:p-1 **:data-[slot=dialog-close]:text-white/70 **:data-[slot=dialog-close]:hover:bg-white/10 **:data-[slot=dialog-close]:hover:text-white">
                    <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-primary/55 to-transparent" aria-hidden />
                    <DialogHeader className="gap-2 px-1">
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-primary/90">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden />
                            MODO INTERATIVO
                        </span>
                        <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Demonstracao de rastreio</DialogTitle>
                        <DialogDescription className="text-left text-xs text-white/62 sm:text-sm">
                            Explore o fluxo de fundos em visualizacao real. O scroll atua no grafo enquanto este painel estiver aberto.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-1 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)]">
                        <div className="h-[min(62dvh,32rem)] w-full min-h-80 sm:h-[min(68dvh,38rem)] sm:min-h-96">
                            <FlowGraphReadOnly
                                graph={DEMO_TRACKING_FLOW_GRAPH}
                                className="h-full w-full rounded-xl border-0 min-h-0!"
                                fitViewOnMount
                                fillContainer
                                endpointExchangeName="Exchange"
                                preventScrolling
                                zoomOnScroll
                            />
                        </div>
                    </div>
                    <p className="px-1 text-[11px] text-white/45 sm:text-xs">Dica: use os controles no canto direito para zoom e ajuste da visualizacao.</p>
                </DialogContent>
            </Dialog>
        </div>
    );
}
