'use client';

import { useEffect, useRef } from 'react';
import { PageHeader } from '@/components/common/pageHeader';
import { Loader2 } from 'lucide-react';
import type { TrackingPayload } from '../types';

type Step2RastreamentoProps = {
    trackingPayload: TrackingPayload | null;
    trackingLogs: string[];
};

export function Step2Rastreamento({ trackingPayload, trackingLogs }: Step2RastreamentoProps) {
    const logsEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [trackingLogs]);

    return (
        <>
            <PageHeader
                className="mx-auto mt-5"
                title="Rastreamento em andamento"
                description="Aguarde. Esta é a etapa de processamento. Abaixo você acompanha o andamento de cada passo."
            />
            <div className="mt-4 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 text-foreground">
                        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
                        <span className="text-sm font-medium">Rastreando...</span>
                    </div>
                    {trackingPayload && (
                        <p className="text-xs text-muted-foreground">
                            Caso: {trackingPayload.caseName} · {trackingPayload.entries.length} transação(ões)
                        </p>
                    )}
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-xs">
                    <div className="mb-2 text-muted-foreground">Saída do rastreio:</div>
                    <div className="max-h-[280px] space-y-1 overflow-y-auto">
                        {trackingLogs.map((log, i) => (
                            <div key={i} className="text-foreground">
                                <span className="text-muted-foreground">&gt;</span> {log}
                            </div>
                        ))}
                        <div ref={logsEndRef} aria-hidden />
                    </div>
                </div>
            </div>
        </>
    );
}
