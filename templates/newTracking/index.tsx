'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth-storage';
import type { UserResponse } from '@/lib/types/auth';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/lib/toast-context';
import type { HashValueRow, TrackingPayload } from './types';
import { initialRow, nextId, truncateHash, formatStepDuration } from './utils';
import { Stepper } from './Stepper';
import { Step1DadosDoCaso } from './steps/Step1DadosDoCaso';
import { Step2Rastreamento } from './steps/Step2Rastreamento';
import { Step3Resultados } from './steps/Step3Resultados';

export function NewTrackingTemplate() {
    const router = useRouter();
    const toast = useToast();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [meusCasosOpen, setMeusCasosOpen] = useState(false);
    const [caseName, setCaseName] = useState('');
    const [rows, setRows] = useState<HashValueRow[]>(() => [initialRow()]);
    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const [isTracking, setIsTracking] = useState(false);
    const [trackingLogs, setTrackingLogs] = useState<string[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [caseNameError, setCaseNameError] = useState<string | null>(null);
    const [dadosError, setDadosError] = useState<string | null>(null);
    const [trackingPayload, setTrackingPayload] = useState<TrackingPayload | null>(null);

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.replace('/login');
            return;
        }
        setUser(u);
    }, [router]);

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
        const hasValidRow = rows.some((r) => r.hash.trim() !== '' || r.value.trim() !== '');

        setCaseNameError(null);
        setDadosError(null);

        if (!name) {
            setCaseNameError('Preencha o nome do caso.');
            toast.error('Preencha o nome do caso.');
            return;
        }
        if (!hasValidRow) {
            setDadosError('Preencha pelo menos uma linha (hash ou valor da transação).');
            toast.error('Preencha pelo menos uma linha (hash ou valor da transação).');
            return;
        }

        const entries = rows
            .filter((r) => r.hash.trim() !== '' || r.value.trim() !== '')
            .map((r) => ({
                hash: r.hash.trim(),
                value: r.value.trim() ? parseFloat(r.value.replace(',', '.')) : undefined,
            }));

        setTrackingPayload({ caseName: name, entries });
        setTrackingLogs([]);
        setIsTracking(true);
    }, [caseName, rows, toast]);

    useEffect(() => {
        if (!isTracking || !trackingPayload) return;

        const TOTAL_MS = 20000;
        const { caseName: name, entries } = trackingPayload;
        const n = entries.length;

        const steps: { delay: number; message: string }[] = [
            { delay: 0, message: 'Iniciando rastreamento...' },
            { delay: 200, message: `Caso: "${name}"` },
            { delay: 500, message: `Entradas: ${n} transação(ões) para rastrear` },
            ...entries.flatMap((e, i) => [
                {
                    delay: 800 + i * 250,
                    message: `  [${i + 1}] Hash: ${truncateHash(e.hash)}${e.value != null ? ` | Valor: ${e.value}` : ''}`,
                },
            ]),
            { delay: 1500, message: 'Conectando à rede blockchain...' },
            { delay: 3500, message: `Validando ${n} hash(es) informado(s)...` },
            { delay: 5500, message: 'Localizando transação(ões) na cadeia...' },
            ...entries.map((e, i) => ({
                delay: 7000 + (i * 5000) / Math.max(n, 1),
                message: `Rastreando transação ${i + 1}/${n}: ${truncateHash(e.hash)}`,
            })),
            { delay: 12000, message: 'Mapeando endereços de origem e destino...' },
            { delay: 14000, message: 'Analisando histórico de carteiras vinculadas...' },
            { delay: 16000, message: 'Consolidando dados do rastreio...' },
            { delay: 17500, message: 'Gerando relatório preliminar...' },
            { delay: 19000, message: 'Finalizando análise...' },
            { delay: TOTAL_MS, message: `Rastreamento do caso "${name}" concluído com sucesso.` },
        ];

        const timeouts: ReturnType<typeof setTimeout>[] = [];

        steps.forEach(({ delay, message }, i) => {
            const isLast = i === steps.length - 1;
            const nextDelay = isLast ? delay : steps[i + 1].delay;
            const durationMs = nextDelay - delay;
            const durationStr = isLast ? '— concluído' : formatStepDuration(durationMs);
            const line = `${message}  ${durationStr}`;
            const t = setTimeout(() => {
                setTrackingLogs((prev) => [...prev, line]);
            }, delay);
            timeouts.push(t);
        });

        const tFinal = setTimeout(() => {
            setIsTracking(false);
            setShowResults(true);
        }, TOTAL_MS);
        timeouts.push(tFinal);

        return () => timeouts.forEach(clearTimeout);
    }, [isTracking, trackingPayload]);

    useEffect(() => {
        if (showResults) {
            toast.success('Rastreamento concluído com sucesso.');
        }
    }, [showResults, toast]);

    const currentStep = showResults ? 3 : isTracking ? 2 : 1;

    if (!user) return null;

    return (
        <div className="min-h-screen w-full overflow-auto bg-background">
            <AppHeader user={user} meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="mx-auto min-h-[calc(100vh-7rem)] max-w-4xl px-4 pb-20 pt-8 sm:px-6 sm:pt-10 sm:pb-20">
                <div className="mx-auto w-full py-4">
                    <Stepper currentStep={currentStep} />
                </div>

                {currentStep === 1 && (
                    <Step1DadosDoCaso
                        caseName={caseName}
                        setCaseName={setCaseName}
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
                {currentStep === 2 && (
                    <Step2Rastreamento trackingPayload={trackingPayload} trackingLogs={trackingLogs} />
                )}
                {currentStep === 3 && trackingPayload && (
                    <Step3Resultados
                        trackingPayload={trackingPayload}
                        onNovoRastreamento={() => {
                            setShowResults(false);
                            setTrackingPayload(null);
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
                            className="h-10 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
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
                        <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Fechar sem salvar?</DialogTitle>
                        <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                            Tem certeza de que deseja fechar? Os dados preenchidos serão perdidos e não poderão ser recuperados.
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
