'use client';

import { FolderOpen, GitBranch, Calendar, Coins } from 'lucide-react';

type StatItem = {
    label: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
};

type DashboardStatsProps = {
    totalCases: number;
    totalAmount: string;
    casesThisMonth: number;
    totalSeeds: number;
};

export function DashboardStats({ totalCases, totalAmount, casesThisMonth, totalSeeds }: DashboardStatsProps) {
    const totalFormatted = (() => {
        const n = parseFloat(totalAmount);
        if (!Number.isFinite(n)) return '0';
        if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
        return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    })();

    const stats: StatItem[] = [
        { label: 'Total de casos', value: String(totalCases), icon: FolderOpen },
        { label: 'Valor rastreado (USD)', value: totalFormatted, icon: Coins },
        { label: 'Casos este mês', value: String(casesThisMonth), icon: Calendar },
        { label: 'Transações rastreadas', value: String(totalSeeds), icon: GitBranch },
    ];

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
                <div
                    key={i}
                    className="rounded-xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.82),rgba(10,11,16,0.86))] p-4 transition-all duration-200 hover:border-primary/25 hover:bg-[linear-gradient(180deg,rgba(20,22,32,0.88),rgba(11,12,18,0.92))]"
                >
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/12 bg-white/4 text-primary">
                            <stat.icon className="h-5 w-5" aria-hidden />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-2xl font-semibold tabular-nums text-foreground">
                                {stat.value}
                            </p>
                            <p className="text-xs text-white/62">{stat.label}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
