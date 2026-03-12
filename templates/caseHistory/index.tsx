'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCaseById } from '@/lib/services/cases/get-case-by-id.service';
import { editCase } from '@/lib/services/cases/edit-case.service';
import { caseByIdResponseToFlowGraph } from '@/lib/utils/case-api-to-flow-graph';
import { FlowGraphView } from '@/components/flow/FlowGraphView';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Loader2, FileX2 } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import type { FlowGraphWithTimestamps } from '@/lib/utils/flow-track-graph';
import type { EditCaseWalletPayload } from '@/lib/services/cases/edit-case.service';
import type { SoftDeleteTransactionItem } from '@/lib/utils/flow-track-graph';

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
    const [refreshKey, setRefreshKey] = useState(0);
    const accessToken = session?.user?.accessToken;
    const toast = useToast();

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
    }, [id, status, accessToken, router, refreshKey]);

    const handleEditWallets = useCallback(
        async (wallets: EditCaseWalletPayload[]) => {
            if (!id || !accessToken || wallets.length === 0) return;
            const result = await editCase(id, { wallets }, accessToken);
            if (result.ok) {
                toast.success('Alterações salvas.');
            } else {
                toast.error(result.message ?? 'Erro ao salvar alterações.');
            }
        },
        [id, accessToken, toast],
    );

    const handleSoftDeleteTransactions = useCallback(
        async (items: SoftDeleteTransactionItem[]) => {
            if (!id || !accessToken || items.length === 0) return;
            const result = await editCase(id, { softDeleteTransactions: items }, accessToken);
            if (result.ok) {
                setRefreshKey((k) => k + 1);
                toast.success('Nó excluído do fluxo.');
            } else {
                toast.error(result.message ?? 'Erro ao excluir nó.');
            }
        },
        [id, accessToken, toast],
    );

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
            <div className="flex min-h-screen w-full flex-col overflow-auto bg-background">
                <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
                <div className="h-14 shrink-0" aria-hidden />
                <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
                    <div
                        className="flex w-full max-w-md flex-col items-center rounded-2xl border border-border bg-card px-8 py-10 text-center shadow-lg"
                        role="alert"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                            <FileX2 size={28} strokeWidth={1.5} aria-hidden />
                        </div>
                        <h1 className="mt-5 text-lg font-semibold text-foreground">
                            {error?.includes('sem dados') ? 'Caso sem dados' : 'Caso não encontrado'}
                        </h1>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {id ? (
                                error?.includes('sem dados') ? (
                                    <>O caso com o ID {id} não possui dados de grafo para exibir. Tente outro caso ou volte mais tarde.</>
                                ) : (
                                    <>
                                        Não foi possível encontrar um caso com o ID {id}. O caso pode não existir ou você não tem permissão para
                                        acessá-lo.
                                    </>
                                )
                            ) : (
                                'O endereço do caso é inválido. Volte à lista de casos e tente novamente.'
                            )}
                        </p>
                        <Button variant="default" className="mt-8 h-10 rounded-[6px] px-6" onClick={() => router.replace('/dashboard/rastreio/novo')}>
                            Voltar ao AutoTrack
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    if (!graphData || !id || !accessToken) return null;

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
                    caseId={id}
                    onEditWallets={handleEditWallets}
                    onSoftDeleteTransactions={handleSoftDeleteTransactions}
                />
            </main>
        </div>
    );
}
