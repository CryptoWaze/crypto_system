'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FolderOpen, X, Loader2, ChevronRight } from 'lucide-react';

const MONTH_NAMES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

function formatCreatedAt(iso: string | undefined): string {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${h}:${min}`;
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

function truncateHash(hash: string, head = 8, tail = 6): string {
    if (!hash || hash.length <= head + tail) return hash;
    return `${hash.slice(0, head)}...${hash.slice(-tail)}`;
}

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getCasesHistory } from '@/lib/services/cases/get-cases-history.service';
import type { CaseHistoryItem } from '@/lib/types/case-api';

type MyCasesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

function formatAmount(decimal: string): string {
    const n = parseFloat(decimal);
    if (!Number.isFinite(n)) return decimal;
    if (n >= 0.01) return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
    if (n === 0) return '0';
    return decimal;
}

export function ModalCases({ open, onOpenChange }: MyCasesModalProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [list, setList] = useState<CaseHistoryItem[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || status !== 'authenticated') return;
        const id = session?.user?.id;
        const token = session?.user?.accessToken;
        if (!id || !token) {
            setList([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        getCasesHistory(id, token).then((result) => {
            setLoading(false);
            if (result.ok) setList(result.data);
            else setError(result.message);
        });
    }, [open, status, session?.user?.id, session?.user?.accessToken]);

    const handleCreateFirstCase = () => {
        onOpenChange(false);
        router.push('/dashboard/rastreio/novo');
    };

    const handleCaseClick = (caseId: string) => {
        onOpenChange(false);
        router.push(`/dashboard/case/history/${caseId}`);
    };

    const hasCases = Array.isArray(list) && list.length > 0;

    const groupedByMonth = (() => {
        if (!list?.length) return new Map<string, CaseHistoryItem[]>();
        const map = new Map<string, CaseHistoryItem[]>();
        for (const item of list) {
            const key = getMonthYearKey(item.createdAt);
            const arr = map.get(key) ?? [];
            arr.push(item);
            map.set(key, arr);
        }
        const keys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
        const ordered = new Map<string, CaseHistoryItem[]>();
        for (const k of keys) ordered.set(k, map.get(k)!);
        return ordered;
    })();

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showClose={false}
                className="flex h-full w-full min-h-0 flex-col border-l border-border bg-card p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] sm:max-w-md"
            >
                <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-[6px] border border-border bg-muted/50 sm:size-10">
                            <FolderOpen className="size-5 text-muted-foreground sm:size-5" aria-hidden />
                        </div>
                        <SheetTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Meus casos</SheetTitle>
                    </div>
                    <SheetClose
                        className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none sm:size-10 cursor-pointer"
                        aria-label="Fechar"
                    >
                        <X className="size-4 sm:size-5" aria-hidden />
                    </SheetClose>
                </SheetHeader>

                {loading && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-14">
                        <Loader2 className="size-8 animate-spin text-muted-foreground" aria-hidden />
                        <p className="text-sm text-muted-foreground">Carregando histórico...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-14 text-center">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}

                {!loading && !error && hasCases && (
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden -mt-4">
                        <div className="modal-cases-list min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="flex flex-col gap-5 pb-1">
                                {Array.from(groupedByMonth.entries()).map(([key, items]) => (
                                    <section key={key}>
                                        <h3 className="mb-2 text-sm font-semibold text-foreground px-4 pt-4">
                                            {getMonthYearLabel(items[0]?.createdAt)}
                                        </h3>
                                        <div className="border-b border-border pb-2" aria-hidden />
                                        <ul className="flex flex-col gap-0" role="list">
                                            {items.map((item) => (
                                                <li key={item.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCaseClick(item.id)}
                                                        className="flex w-full cursor-pointer items-center gap-3 border-b border-border py-3 text-left transition-colors px-4 hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-inset last:border-b-0"
                                                    >
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50">
                                                            <FolderOpen className="size-5 text-muted-foreground" aria-hidden />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="block truncate text-sm font-semibold text-foreground capitalize">
                                                                {item.name || 'Sem nome'}
                                                            </span>
                                                            {(item.seeds?.length ?? 0) > 0 && (
                                                                <span className="mt-0.5 block font-mono text-[11px] text-muted-foreground">
                                                                    {item.seeds!.length === 1
                                                                        ? truncateHash(item.seeds![0].txHash)
                                                                        : item.seeds!.map((s) => truncateHash(s.txHash)).join(', ')}
                                                                </span>
                                                            )}
                                                            <span className="mt-0.5 block text-xs text-muted-foreground">
                                                                {formatCreatedAt(item.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <span className="text-sm font-semibold text-foreground">
                                                                {item.totalAmountLostDecimal}
                                                            </span>
                                                        </div>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                ))}
                            </div>
                        </div>
                        <div className="border-t border-border px-4 py-4">
                            <Button
                                type="button"
                                onClick={handleCreateFirstCase}
                                className="w-full cursor-pointer rounded-[6px] bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90"
                            >
                                Novo rastreamento
                            </Button>
                        </div>
                    </div>
                )}

                {!loading && !error && !hasCases && (
                    <div className="flex flex-1 flex-col items-center justify-center border-b border-border/50 px-5 py-10 text-center sm:py-14">
                        <div className="mb-5 flex size-14 items-center justify-center rounded-[6px] border border-border bg-muted/30 sm:size-16">
                            <FolderOpen className="size-7 text-muted-foreground sm:size-8" aria-hidden />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground sm:text-base">Nenhum caso ainda</h3>
                        <p className="mt-2 max-w-sm text-sm text-muted-foreground">Seus casos aparecerão aqui após serem criados.</p>
                        <Button
                            type="button"
                            onClick={handleCreateFirstCase}
                            className="mt-6 h-10 cursor-pointer rounded-[6px] bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                        >
                            Iniciar rastreamento
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
