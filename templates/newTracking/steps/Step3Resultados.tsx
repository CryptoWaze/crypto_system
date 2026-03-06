'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/pageHeader';
import type { TrackingPayload } from '../types';

type Step3ResultadosProps = {
    trackingPayload: TrackingPayload;
    onNovoRastreamento: () => void;
    onMeusCasos: () => void;
};

export function Step3Resultados({ trackingPayload, onNovoRastreamento, onMeusCasos }: Step3ResultadosProps) {
    return (
        <>
            <PageHeader
                className="mx-auto mt-5"
                title="Resultados do rastreio"
                description="Resumo do rastreamento realizado. Os dados abaixo são simulados para demonstração."
            />
            <div className="mt-6 space-y-6">
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                    <h2 className="mb-3 text-sm font-semibold text-foreground">Resumo do caso</h2>
                    <dl className="space-y-2 text-sm">
                        <div>
                            <dt className="text-muted-foreground">Nome do caso</dt>
                            <dd className="font-medium text-foreground">{trackingPayload.caseName}</dd>
                        </div>
                        <div>
                            <dt className="text-muted-foreground">Transações rastreadas</dt>
                            <dd className="font-medium text-foreground">{trackingPayload.entries.length}</dd>
                        </div>
                    </dl>
                </div>
                <div className="rounded-lg border border-border overflow-hidden">
                    <div className="bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Endereços e movimentações identificados (simulado)
                    </div>
                    <div className="divide-y divide-border">
                        {trackingPayload.entries.map((entry, i) => (
                            <div key={i} className="px-3 py-3 text-sm">
                                <div className="font-mono text-xs text-muted-foreground break-all">
                                    {entry.hash || '(hash não informado)'}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                                    <span>
                                        <span className="text-muted-foreground">Valor informado:</span>{' '}
                                        {entry.value != null ? `${entry.value} BTC` : '—'}
                                    </span>
                                    <span>
                                        <span className="text-muted-foreground">Endereços vinculados:</span> {Math.max(1, (i + 2) * 3)}{' '}
                                        (simulado)
                                    </span>
                                    <span>
                                        <span className="text-muted-foreground">Transações relacionadas:</span> {Math.max(2, (i + 1) * 5)}{' '}
                                        (simulado)
                                    </span>
                                </div>
                                <div className="mt-2 rounded bg-muted/30 px-2 py-1.5 font-mono text-xs text-foreground">
                                    Exemplo origem: 0x7a3f...b2c1 · Destino: 0x9e1d...4a8f (simulado)
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        onClick={onNovoRastreamento}
                        className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Novo rastreamento
                    </Button>
                    <Button type="button" onClick={onMeusCasos} variant="outline" className="rounded-[6px]">
                        Meus casos
                    </Button>
                </div>
            </div>
        </>
    );
}
