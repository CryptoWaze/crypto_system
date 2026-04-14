'use client';

import Link from 'next/link';
import { FolderOpen, ChevronRight } from 'lucide-react';
import { useToast } from '@/lib/toast-context';
import type { DashboardCaseItem } from '@/lib/types/dashboard-case-item';

function formatDate(iso: string | undefined): string {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        const now = new Date();
        const diffMs = now.getTime() - d.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Hoje';
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    } catch {
        return '—';
    }
}

type DashboardCaseCardProps = {
    item: DashboardCaseItem;
    isMock?: boolean;
};

export function DashboardCaseCard({ item, isMock }: DashboardCaseCardProps) {
    const toast = useToast();
    const href = isMock ? '#' : `/dashboard/case/history/${item.id}`;
    const count = item.transactionCount;

    const handleClick = (e: React.MouseEvent) => {
        if (isMock) {
            e.preventDefault();
            toast.success('Dados de exemplo. Crie um rastreio para ver seus casos reais.');
        }
    };

    return (
        <Link
            href={href}
            onClick={handleClick}
            className="group flex flex-col rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.82),rgba(10,11,16,0.9))] p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-[0_0_24px_-10px_var(--glow-blue)]"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/12 bg-white/4 text-primary">
                    <FolderOpen className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
                        {item.name || 'Sem nome'}
                    </h3>
                    <p className="mt-1 text-xs text-white/60">
                        {formatDate(item.createdAt)}
                        {count > 0 && (
                            <span className="ml-2">
                                · {count} {count === 1 ? 'transação' : 'transações'}
                            </span>
                        )}
                    </p>
                    <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                        {item.amountDisplay} <span className="text-sm font-normal text-white/50">USD</span>
                    </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </div>
        </Link>
    );
}
