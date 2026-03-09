'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCaseById } from '@/lib/services/cases/get-case-by-id.service';
import { caseByIdResponseToFlowGraph } from '@/lib/utils/case-api-to-flow-graph';
import { FlowGraphView } from '@/components/flow/FlowGraphView';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { FlowGraphWithTimestamps } from '@/lib/utils/flow-track-graph';

export function CaseHistoryTemplate() {
    const params = useParams();
    const router = useRouter();
    const { status, data: session } = useSession();
    const id = typeof params?.id === 'string' ? params.id : null;
    const [ready, setReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [graphData, setGraphData] = useState<FlowGraphWithTimestamps | null>(null);
    const [caseName, setCaseName] = useState<string | null>(null);
    const [endpointExchangeName, setEndpointExchangeName] = useState<string | null>(null);
    const [endpointHotWalletLabel, setEndpointHotWalletLabel] = useState<string | null>(null);
    const [meusCasosOpen, setMeusCasosOpen] = useState(false);
    const accessToken = session?.user?.accessToken;

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    useEffect(() => {
        if (!id) {
            router.replace('/dashboard/flowtrack');
            return;
        }
        if (status !== 'authenticated' || !accessToken) return;

        let cancelled = false;
        (async () => {
            const result = await getCaseById(id, accessToken);
            console.log(result);
            if (cancelled) return;
            if (!result.ok) {
                setError(result.message);
                setReady(true);
                return;
            }
            setCaseName(result.data.name ?? null);
            const firstFlow = result.data.flows?.[0];
            setEndpointExchangeName(firstFlow?.endpointExchangeName ?? null);
            setEndpointHotWalletLabel(firstFlow?.endpointHotWalletLabel ?? null);
            const graph = caseByIdResponseToFlowGraph(result.data);
            if (!graph.nodes?.length) {
                setError('Caso sem dados de grafo.');
                setReady(true);
                return;
            }
            setGraphData(graph);
            setError(null);
            setReady(true);
        })();
        return () => {
            cancelled = true;
        };
    }, [id, status, accessToken, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
            </div>
        );
    }
    if (status === 'unauthenticated') return null;

    if (!ready) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen w-full overflow-auto bg-background">
                <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
                <div className="h-14 shrink-0" aria-hidden />
                <main className="flex flex-col items-center justify-center px-4 py-16">
                    <p className="text-sm text-destructive" role="alert">
                        {error}
                    </p>
                    <Button variant="outline" className="mt-4 rounded-[6px]" onClick={() => router.replace('/dashboard/flowtrack')}>
                        Voltar ao FlowTrack
                    </Button>
                </main>
            </div>
        );
    }

    if (!graphData) return null;

    return (
        <div className="min-h-screen w-full overflow-auto bg-background">
            <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="h-[calc(100vh-3.5rem)] w-full">
                <FlowGraphView
                    graph={graphData}
                    className="h-full w-full"
                    caseName={caseName}
                    endpointExchangeName={endpointExchangeName}
                    endpointHotWalletLabel={endpointHotWalletLabel}
                />
            </main>
        </div>
    );
}
