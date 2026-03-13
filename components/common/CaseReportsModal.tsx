'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2, X } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import { getOrCreateCaseReport } from '@/lib/services/cases/get-or-create-case-report.service';
import { listCaseReports } from '@/lib/services/cases/list-case-reports.service';
import { downloadCaseReport } from '@/lib/services/cases/download-case-report.service';
import type { CaseReportListItem } from '@/lib/services/cases/list-case-reports.service';

export type CaseReportsModalProps = {
    open: boolean;
    onClose: () => void;
    caseId: string;
    accessToken: string;
};

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatReportDate(iso: string): string {
    try {
        const d = new Date(iso);
        return d.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch {
        return iso;
    }
}

function getMonthYearKey(iso: string | undefined): string {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    } catch {
        return '—';
    }
}

function getMonthYearLabel(iso: string | undefined): string {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        return `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
    } catch {
        return '—';
    }
}

function formatLabel(format: string): string {
    const f = (format || '').toLowerCase();
    if (f === 'pdf') return 'PDF';
    if (f === 'docx') return 'DOCX';
    return format || 'Arquivo';
}

export function CaseReportsModal({ open, onClose, caseId, accessToken }: CaseReportsModalProps) {
    const toast = useToast();
    const [reports, setReports] = useState<CaseReportListItem[]>([]);
    const [loadingList, setLoadingList] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const loadReports = useCallback(async () => {
        if (!caseId || !accessToken) return;
        setLoadingList(true);
        try {
            const result = await listCaseReports(caseId, accessToken);
            if (result.ok) setReports(result.data);
            else toast.error(result.message);
        } finally {
            setLoadingList(false);
        }
    }, [caseId, accessToken, toast]);

    useEffect(() => {
        if (open && caseId && accessToken) loadReports();
    }, [open, caseId, accessToken, loadReports]);

    const handleGenerate = async () => {
        if (!caseId || !accessToken) return;
        setGenerating(true);
        try {
            const result = await getOrCreateCaseReport(caseId, accessToken);
            if (!result.ok) {
                toast.error(result.message);
                return;
            }
            toast.success(result.data.generated ? 'Relatório gerado com sucesso.' : 'Relatório já existente.');
            loadReports();
        } catch {
            toast.error('Não foi possível gerar o relatório.');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownload = async (report: CaseReportListItem) => {
        if (!caseId || !accessToken) return;
        setDownloadingId(report.id);
        try {
            const result = await downloadCaseReport(caseId, report.id, accessToken, report.format);
            if (result.ok) toast.success('Download iniciado.');
            else toast.error(result.message);
        } finally {
            setDownloadingId(null);
        }
    };

    const groupedByMonth = useMemo(() => {
        if (!reports?.length) return new Map<string, CaseReportListItem[]>();
        const map = new Map<string, CaseReportListItem[]>();
        for (const r of reports) {
            const key = getMonthYearKey(r.generatedAt);
            const arr = map.get(key) ?? [];
            arr.push(r);
            map.set(key, arr);
        }
        const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
        const ordered = new Map<string, CaseReportListItem[]>();
        for (const k of keys) {
            const items = (map.get(k) ?? []).slice().sort((a, b) => (b.generatedAt ?? '').localeCompare(a.generatedAt ?? ''));
            ordered.set(k, items);
        }
        return ordered;
    }, [reports]);

    return (
        <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
            <SheetContent
                side="right"
                showClose={false}
                className="flex h-full w-full min-h-0 flex-col border-l border-border bg-card p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] sm:max-w-md"
            >
                <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-[6px] border border-border bg-muted/50 sm:size-10">
                            <FileText className="size-5 text-muted-foreground sm:size-5" aria-hidden />
                        </div>
                        <SheetTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Relatórios do caso</SheetTitle>
                    </div>
                    <SheetClose
                        className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none sm:size-10 cursor-pointer"
                        aria-label="Fechar"
                    >
                        <X className="size-4 sm:size-5" aria-hidden />
                    </SheetClose>
                </SheetHeader>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden -mt-4">
                    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
                        {loadingList ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-14">
                                <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
                                <p className="text-sm text-muted-foreground">Carregando relatórios...</p>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="flex min-h-full flex-1 flex-col items-center justify-center px-5 py-10 text-center sm:py-14">
                                <div className="mb-5 flex size-14 items-center justify-center rounded-[6px] border border-border bg-muted/30 sm:size-16">
                                    <FileText className="size-7 text-muted-foreground sm:size-8" aria-hidden />
                                </div>
                                <h3 className="text-sm font-semibold text-foreground sm:text-base">Nenhum relatório ainda</h3>
                                <p className="mt-2 max-w-sm text-sm text-muted-foreground">Gere um novo relatório usando o botão abaixo.</p>
                                <Button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="mt-6 h-10 cursor-pointer rounded-[6px] bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                                            Gerando...
                                        </>
                                    ) : (
                                        'Gerar novo relatório'
                                    )}
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5 pb-1">
                                {Array.from(groupedByMonth.entries()).map(([_key, items]) => (
                                    <section key={_key}>
                                        <h4 className="mb-2 px-4 pt-4 text-sm font-semibold text-foreground">
                                            {getMonthYearLabel(items[0]?.generatedAt)}
                                        </h4>
                                        <div className="border-b border-border pb-2" aria-hidden />
                                        <ul className="flex flex-col gap-0" role="list">
                                            {items.map((r) => (
                                                <li key={r.id}>
                                                    <div className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50 last:border-b-0">
                                                        <div className="min-w-0 flex-1">
                                                            <span className="block truncate text-sm font-semibold text-foreground">
                                                                {formatLabel(r.format)}
                                                            </span>
                                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                                {formatReportDate(r.generatedAt)}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDownload(r)}
                                                            disabled={downloadingId === r.id}
                                                            className="h-9 shrink-0 gap-1 rounded-[6px] px-3"
                                                        >
                                                            {downloadingId === r.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                                                            ) : (
                                                                <Download className="h-4 w-4" aria-hidden />
                                                            )}
                                                            Baixar
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        )}
                    </div>
                    {reports.length > 0 && (
                        <div className="shrink-0 border-t border-border px-4 py-4">
                            <Button
                                type="button"
                                onClick={handleGenerate}
                                disabled={generating}
                                className="w-full cursor-pointer rounded-[6px] bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-primary/90"
                            >
                                {generating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                                        Gerando...
                                    </>
                                ) : (
                                    'Gerar novo relatório'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
