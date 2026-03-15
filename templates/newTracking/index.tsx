'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import type { FlowToExchangeSuccess, FlowToExchangeFailure } from '@/lib/types/tracking';
import { createCase, type CreateCaseMode } from '@/lib/services/cases/create-case.service';
import { connectSocket } from '@/lib/services/socket/socket.service';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/toast-context';
import { Loader2 } from 'lucide-react';
import type { HashValueRow, TrackingPayload } from './types';
import { initialRow, nextId } from './utils';
import { Stepper } from './Stepper';
import { Step1DadosDoCaso } from './steps/Step1DadosDoCaso';
import { Step2Rastreamento } from './steps/Step2Rastreamento';
import { Step3Resultados } from './steps/Step3Resultados';

export function NewTrackingTemplate() {
    const router = useRouter();
    const toast = useToast();
    const { status, data: session } = useSession();
    const accessToken = session?.user?.accessToken;
    const [meusCasosOpen, setMeusCasosOpen] = useState(false);
    const [caseName, setCaseName] = useState('');
    const [mode, setMode] = useState<CreateCaseMode>('basic');
    const [rows, setRows] = useState<HashValueRow[]>(() => [initialRow()]);
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [trackingLogs, setTrackingLogs] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [caseNameError, setCaseNameError] = useState<string | null>(null);
    const [dadosError, setDadosError] = useState<string | null>(null);
    const [trackingPayload, setTrackingPayload] = useState<TrackingPayload | null>(null);
    const [trackingResult, setTrackingResult] = useState<FlowToExchangeSuccess | FlowToExchangeFailure | null>(null);
    const [trackingError, setTrackingError] = useState<string | null>(null);
    const [caseId, setCaseId] = useState<string | null>(null);
    const traceIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    const hasData = caseName.trim() !== '' || rows.some((r) => r.hash.trim() !== '' || r.value.trim() !== '');

    const goDashboard = useCallback(() => router.push('/dashboard'), [router]);

    const handleCancelClick = useCallback(() => {
        if (hasData) setConfirmCloseOpen(true);
        else goDashboard();
    }, [hasData, goDashboard]);

    const confirmCloseAndCancel = useCallback(() => {
        setConfirmCloseOpen(false);
        goDashboard();
    }, [goDashboard]);

    const addRow = useCallback(() => {
        setRows((prev) => [...prev, { id: nextId(), hash: '', value: '' }]);
    }, []);

    const removeRow = useCallback(
        (index: number) => {
            if (rows.length <= 1) {
                toast.error('Não é possível excluir. É necessário manter pelo menos um item.');
                return;
            }
            setRows((prev) => prev.filter((_, i) => i !== index));
        },
        [rows.length, toast],
    );

    const updateRow = useCallback((index: number, field: 'hash' | 'value', value: string) => {
        setDadosError(null);
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
    }, []);

    const handleSubmit = useCallback(() => {
        const name = caseName.trim();
        const entries = rows
            .filter((r) => r.hash.trim() !== '' && r.value.trim() !== '')
            .map((r) => ({
                hash: r.hash.trim(),
                value: r.value.trim() ? parseFloat(r.value.replace(',', '.')) : undefined,
            }));

        setCaseNameError(null);
        setDadosError(null);

        if (!name) {
            setCaseNameError('Preencha o nome do caso.');
            toast.error('Preencha o nome do caso.');
            return;
        }
        if (entries.length === 0) {
            setDadosError('Preencha pelo menos uma linha com hash e valor da transação.');
            toast.error('Preencha pelo menos uma linha com hash e valor da transação.');
            return;
        }
        const invalidEntry = entries.find((e) => e.value == null || !Number.isFinite(e.value) || e.value <= 0);
        if (invalidEntry) {
            setDadosError('Cada linha deve ter valor numérico maior que zero.');
            toast.error('Cada linha deve ter valor numérico maior que zero.');
            return;
        }
        if (!accessToken) {
            toast.error('Sessão expirada. Faça login novamente.');
            return;
        }

        const seeds = entries.map((e) => ({
            txHash: e.hash,
            reportedLossAmount: e.value as number,
        }));

        setTrackingPayload({ caseName: name, entries });
        setTrackingLogs(['Iniciando rastreamento...']);
        setTrackingResult(null);
        setTrackingError(null);
        setCaseId(null);
        setIsTracking(true);

        (async () => {
            const result = await createCase({ name, mode, seeds }, accessToken);

            if (!result.ok) {
                setIsTracking(false);
                setTrackingError(result.message);
                toast.error(result.message);
                setShowResults(true);
                return;
            }

            const { traceId, caseId: responseCaseId, seedsCount } = result.data;
            setCaseId(responseCaseId);
            traceIdRef.current = traceId;

            try {
                const socket = connectSocket();
                socket.emit('subscribe-flow-trace', { traceId });
                for (let i = 0; i < seedsCount; i++) {
                    socket.emit('subscribe-flow-trace', { traceId: `${traceId}-${i}` });
                }
                const currentTraceId = traceId;
                socket.off('flow-trace-progress');
                socket.off('case-created');
                socket.on('flow-trace-progress', (payload: { message?: string }) => {
                    const msg = payload?.message;
                    if (msg) setTrackingLogs((prev) => [...prev, msg]);
                });
                socket.on('case-created', (payload: FlowToExchangeSuccess | FlowToExchangeFailure | { graph?: unknown }) => {
                    if (traceIdRef.current !== currentTraceId) return;
                    const hasGraph = payload && typeof payload === 'object' && 'graph' in payload;
                    if (hasGraph && payload.graph) {
                        setTrackingResult(payload as FlowToExchangeSuccess | FlowToExchangeFailure);
                        setTrackingError(null);
                        setTrackingLogs((prev) => [...prev, 'Rastreamento concluído.']);
                    } else {
                        setTrackingLogs((prev) => [...prev, 'Caso criado.']);
                    }
                    setIsTracking(false);
                    setShowResults(true);
                });
            } catch {
                setTrackingLogs((prev) => [...prev, 'Caso enviado. Aguardando conclusão...']);
            }
        })();
    }, [caseName, rows, toast, accessToken]);

    useEffect(() => {
        if (showResults && trackingResult?.success === true) {
            toast.success('Rastreamento concluído com sucesso.');
        }
    }, [showResults, trackingResult?.success, toast]);

    const currentStep = showResults ? 3 : isTracking ? 2 : 1;
    const shouldWarnUnsaved = hasData && currentStep === 1;

    useEffect(() => {
        if (!shouldWarnUnsaved) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [shouldWarnUnsaved]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
            </div>
        );
    }
    if (status === 'unauthenticated') return null;

    return (
        <div className="min-h-screen w-full overflow-auto bg-background">
            <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="mx-auto min-h-[calc(100vh-7rem)] max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 sm:pb-20">
                <div className="w-full py-4 mx-auto">
                    <Stepper currentStep={currentStep} />
                </div>

                {currentStep === 1 && (
                    <Step1DadosDoCaso
                        caseName={caseName}
                        setCaseName={setCaseName}
                        mode={mode}
                        setMode={setMode}
                        rows={rows}
                        caseNameError={caseNameError}
                        setCaseNameError={setCaseNameError}
                        dadosError={dadosError}
                        setDadosError={setDadosError}
                        onAddRow={addRow}
                        onRemoveRow={removeRow}
                        onUpdateRow={updateRow}
                        onSubmit={handleSubmit}
                    />
                )}
                {currentStep === 2 && <Step2Rastreamento trackingPayload={trackingPayload} trackingLogs={trackingLogs} />}

                {currentStep === 3 && trackingPayload && (
                    <Step3Resultados
                        trackingPayload={trackingPayload}
                        trackingLogs={trackingLogs}
                        trackingResult={trackingResult}
                        trackingError={trackingError}
                        caseId={caseId}
                        onNovoRastreamento={() => {
                            setShowResults(false);
                            setTrackingPayload(null);
                            setTrackingResult(null);
                            setTrackingError(null);
                            setCaseId(null);
                        }}
                        onMeusCasos={() => setMeusCasosOpen(true)}
                    />
                )}
            </main>

            {currentStep === 1 && (
                <footer className="fixed inset-x-0 bottom-0 z-10 flex h-14 w-full items-center justify-center border-t border-border/80 bg-background/90 px-4 backdrop-blur sm:px-6">
                    <div className="mx-auto flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-2">
                        <Button type="button" variant="outline" onClick={handleCancelClick} className="h-10 w-full rounded-[6px] sm:w-auto">
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="rastreio-novo-form"
                            className="h-10 w-full rounded-[6px] bg-primary text-white hover:bg-primary/90 sm:w-auto"
                        >
                            Iniciar rastreamento
                        </Button>
                    </div>
                </footer>
            )}

            <Dialog open={confirmCloseOpen} onOpenChange={setConfirmCloseOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] sm:max-w-md sm:p-6"
                >
                    <DialogHeader className="gap-1.5 sm:gap-2">
                        <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Descartar alterações?</DialogTitle>
                        <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                            Os dados preenchidos serão perdidos e não poderão ser recuperados. Deseja sair mesmo assim?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex flex-col-reverse gap-3 sm:mt-3 sm:flex-row sm:justify-end sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-full rounded-[6px] sm:w-auto"
                            onClick={() => setConfirmCloseOpen(false)}
                        >
                            Continuar editando
                        </Button>
                        <Button
                            type="button"
                            onClick={confirmCloseAndCancel}
                            className="h-10 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
