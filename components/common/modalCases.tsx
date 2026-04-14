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
                    className="flex h-full w-full min-h-0 flex-col border-l border-white/12 bg-[linear-gradient(180deg,rgba(17,19,26,0.96),rgba(10,11,16,0.98))] p-0 shadow-[0_30px_70px_-22px_rgba(0,0,0,0.7)] backdrop-blur-sm sm:max-w-md"
            >
                    <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-white/12 bg-white/4 sm:size-10">
                                <FolderOpen className="size-5 text-primary/80 sm:size-5" aria-hidden />
                        </div>
                            <SheetTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Meus casos</SheetTitle>
                    </div>
                    <SheetClose
                            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-white/10 bg-white/3 text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:pointer-events-none sm:size-10"
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
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        <div className="modal-cases-list min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                            <div className="flex flex-col gap-5 px-3 py-3">
                                {Array.from(groupedByMonth.entries()).map(([key, items]) => (
                                    <section key={key} className="rounded-2xl border border-white/8 bg-white/2">
                                        <h3 className="px-4 pt-4 text-sm font-semibold text-foreground">
                                            {getMonthYearLabel(items[0]?.createdAt)}
                                        </h3>
                                        <div className="mx-4 mt-2 border-b border-white/8" aria-hidden />
                                        <ul className="flex flex-col gap-1 p-2" role="list">
                                            {items.map((item) => (
                                                <li key={item.id}>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCaseClick(item.id)}
                                                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-left transition-all duration-200 hover:border-white/10 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-inset"
                                                    >
                                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/4">
                                                            <FolderOpen className="size-5 text-primary/75" aria-hidden />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <span className="block truncate text-base font-semibold text-foreground capitalize">
                                                                {item.name || 'Sem nome'}
                                                            </span>
                                                            {(item.seeds?.length ?? 0) > 0 && (
                                                                <span className="mt-0.5 block font-mono text-[11px] text-white/45">
                                                                    {item.seeds!.length === 1
                                                                        ? truncateHash(item.seeds![0].txHash)
                                                                        : item.seeds!.map((s) => truncateHash(s.txHash)).join(', ')}
                                                                </span>
                                                            )}
                                                            <span className="mt-1 block text-xs text-white/60">
                                                                {formatCreatedAt(item.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <span className="text-[1.05rem] font-semibold tracking-tight text-foreground">
                                                                {formatAmount(item.totalAmountLostDecimal)}
                                                            </span>
                                                            <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] uppercase tracking-[0.12em] text-primary/75">
                                                                Ver
                                                                <ChevronRight className="size-3" aria-hidden />
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
                        <div className="border-t border-white/10 bg-[#0d1018]/90 px-4 py-4">
                            <Button
                                type="button"
                                onClick={handleCreateFirstCase}
                                className="w-full cursor-pointer rounded-[8px] border border-primary/25 bg-primary px-4 py-2.5 text-sm font-medium text-white shadow-[0_0_26px_-10px_rgba(74,126,217,0.8)] hover:bg-primary/90"
                            >
                                Novo rastreamento
                            </Button>
                        </div>
                    </div>
                )}

                {!loading && !error && !hasCases && (
                    <div className="flex flex-1 flex-col items-center justify-center border-b border-white/10 px-5 py-10 text-center sm:py-14">
                        <div className="mb-5 flex size-14 items-center justify-center rounded-[10px] border border-white/12 bg-white/4 sm:size-16">
                            <FolderOpen className="size-7 text-primary/75 sm:size-8" aria-hidden />
                        </div>
                        <h3 className="text-sm font-semibold text-foreground sm:text-base">Nenhum caso ainda</h3>
                        <p className="mt-2 max-w-sm text-sm text-white/60">Seus casos aparecerão aqui após serem criados.</p>
                        <Button
                            type="button"
                            onClick={handleCreateFirstCase}
                            className="mt-6 h-10 cursor-pointer rounded-[8px] border border-primary/25 bg-primary px-5 text-sm font-medium text-white shadow-[0_0_26px_-10px_rgba(74,126,217,0.8)] hover:bg-primary/90"
                        >
                            Iniciar rastreamento
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}
