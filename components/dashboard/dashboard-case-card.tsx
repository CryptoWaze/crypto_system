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
            className="group flex flex-col rounded-xl border border-border/60 bg-card/50 p-5 transition-all hover:border-primary/40 hover:bg-card/80 hover:shadow-[0_0_20px_-8px_var(--glow-blue)]"
        >
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border/80 bg-secondary/50 text-primary">
                    <FolderOpen className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-foreground group-hover:text-primary">
                        {item.name || 'Sem nome'}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(item.createdAt)}
                        {count > 0 && (
                            <span className="ml-2">
                                · {count} {count === 1 ? 'transação' : 'transações'}
                            </span>
                        )}
                    </p>
                    <p className="mt-2 text-lg font-semibold tabular-nums text-foreground">
                        {item.amountDisplay} <span className="text-sm font-normal text-muted-foreground">USD</span>
                    </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden />
            </div>
        </Link>
    );
}
