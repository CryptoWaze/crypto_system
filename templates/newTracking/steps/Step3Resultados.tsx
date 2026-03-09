'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/common/pageHeader';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { TrackingPayload } from '../types';
import type { FlowToExchangeSuccess, FlowToExchangeFailure } from '@/lib/types/tracking';
import { buildGraphFromTrackingResult } from '@/lib/utils/flow-track-graph';
import { RotateCcw, Eye, FolderOpen } from 'lucide-react';

type Step3ResultadosProps = {
    trackingPayload: TrackingPayload;
    trackingLogs: string[];
    trackingResult: FlowToExchangeSuccess | FlowToExchangeFailure | null;
    trackingError: string | null;
    caseId: string | null;
    onNovoRastreamento: () => void;
    onMeusCasos: () => void;
};

export function Step3Resultados({
    trackingPayload,
    trackingLogs,
    trackingResult,
    trackingError,
    caseId,
    onNovoRastreamento,
    onMeusCasos,
}: Step3ResultadosProps) {
    const router = useRouter();
    const graphForDetail = useMemo(() => {
        if (!trackingResult) return null;
        return buildGraphFromTrackingResult(trackingResult);
    }, [trackingResult]);

    const canViewDetail = Boolean(caseId);

    const handleVerDetalhado = () => {
        if (!caseId) return;
        router.push(`/dashboard/case/history/${caseId}`);
    };

    if (trackingError) {
        return (
            <div className="mx-auto">
                <PageHeader className="mt-5" title="Erro no rastreamento" description={trackingError} />
                <div className="mt-6 flex flex-wrap gap-2">
                    <Button
                        type="button"
                        onClick={onNovoRastreamento}
                        className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <RotateCcw className="h-4 w-4" aria-hidden />
                        Novo rastreamento
                    </Button>
                    <Button type="button" onClick={onMeusCasos} variant="outline" className="rounded-[6px]">
                        Meus casos
                    </Button>
                </div>
                {trackingPayload && (
                    <div className="mt-6 space-y-6">
                        <div className="rounded-lg border border-border bg-muted/20 p-4">
                            <h2 className="mb-3 text-sm font-semibold text-foreground">Dados enviados</h2>
                            <dl className="space-y-2 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">Nome do caso</dt>
                                    <dd className="font-medium text-foreground">{trackingPayload.caseName}</dd>
                                </div>
                                <div>
                                    <dt className="text-muted-foreground">Transações informadas</dt>
                                    <dd className="font-medium text-foreground">{trackingPayload.entries.length}</dd>
                                </div>
                            </dl>
                            <div className="mt-3 divide-y divide-border rounded bg-muted/50">
                                {trackingPayload.entries.map((entry, i) => (
                                    <div key={i} className="p-3">
                                        <div className="font-mono text-xs text-foreground break-all">Hash: {entry.hash || '—'}</div>
                                        {entry.value != null && (
                                            <div className="mt-1 text-xs text-muted-foreground">Valor reportado: {entry.value}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Accordion type="single" collapsible className="rounded-lg border border-border bg-muted/30">
                            <AccordionItem value="log" className="border-b-0">
                                <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium text-foreground hover:no-underline">
                                    Saída do rastreio
                                </AccordionTrigger>
                                <AccordionContent className="px-4 font-mono text-xs">
                                    <div className="max-h-[280px] space-y-1 overflow-y-auto pb-2">
                                        {trackingLogs.map((log, i) => (
                                            <div key={i} className="text-foreground">
                                                <span className="text-muted-foreground">&gt;</span> {log}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="mx-auto">
            <PageHeader
                className="mt-5"
                title="Resultados do rastreio"
                description={
                    canViewDetail
                        ? 'Confira os dados preenchidos e o log. Use "Ver detalhado" para o grafo do fluxo.'
                        : 'Confira os dados que você enviou e o log do rastreamento.'
                }
            />
            <div className="mt-6 flex flex-wrap gap-2">
                <Button type="button" onClick={onNovoRastreamento} className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90">
                    <RotateCcw className=" h-4 w-4" aria-hidden />
                    Novo rastreamento
                </Button>
                <Button type="button" onClick={handleVerDetalhado} disabled={!canViewDetail} variant="outline" className="rounded-[6px]">
                    <Eye className=" h-4 w-4" aria-hidden />
                    Ver detalhado
                </Button>
                <Button type="button" onClick={onMeusCasos} variant="outline" className="rounded-[6px]">
                    <FolderOpen className=" h-4 w-4" aria-hidden />
                    Meus casos
                </Button>
            </div>
            <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <h2 className="mb-3 text-sm font-semibold text-foreground">Dados preenchidos</h2>
                    <dl className="space-y-2 text-sm">
                        <div>
                            <dt className="text-muted-foreground">Nome do caso</dt>
                            <dd className="font-medium text-foreground">{trackingPayload.caseName}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Transações informadas</dt>
                            <dd className="font-medium text-foreground">{trackingPayload.entries.length}</dd>
                        </div>
                    </dl>
                    <div className="mt-3 divide-y divide-border rounded bg-muted/50">
                        {trackingPayload.entries.map((entry, i) => (
                            <div key={i} className="p-3">
                                <div className="font-mono text-xs text-foreground break-all">Hash: {entry.hash || '—'}</div>
                                {entry.value != null && <div className="mt-1 text-xs text-muted-foreground">Valor reportado: {entry.value}</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <Accordion type="single" collapsible className="rounded-lg border border-border bg-muted/30">
                    <AccordionItem value="log" className="border-b-0">
                        <AccordionTrigger className="px-4 py-3 text-left text-sm font-medium text-foreground hover:no-underline">
                            Saída do rastreio
                        </AccordionTrigger>
                        <AccordionContent className="px-4 font-mono text-xs">
                            <div className="max-h-[280px] space-y-1 overflow-y-auto pb-2">
                                {trackingLogs.map((log, i) => (
                                    <div key={i} className="text-foreground">
                                        <span className="text-muted-foreground">&gt;</span> {log}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
}
