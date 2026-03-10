'use client';

import { useCallback } from 'react';
import { X, Copy, Download, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import type { Edge } from '@xyflow/react';

function BinanceLogoIcon({ size = 20 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

function formatAmount(value: number): string {
    if (!Number.isFinite(value)) return String(value);
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
}

type FlowEdgeDetailModalProps = {
    edge: Edge;
    onClose: () => void;
    className?: string;
};

const MOCK_TX_COUNT = 4;

export function FlowEdgeDetailModal({ edge, onClose, className }: FlowEdgeDetailModalProps) {
    const toast = useToast();
    const source = edge.source;
    const target = edge.target;
    const data = edge.data as
        | {
              fromLabel?: string;
              toLabel?: string;
              symbol?: string;
              amount?: number;
              amountRaw?: string;
              dateStr?: string;
              valueStr?: string;
              txHash?: string;
          }
        | undefined;
    const fromLabel = data?.fromLabel ?? source;
    const toLabel = data?.toLabel ?? target;
    const symbol = data?.symbol ?? '';
    const amount = typeof data?.amount === 'number' ? data.amount : 0;
    const amountStr = formatAmount(amount);
    const valueStr = data?.valueStr ?? `${amountStr} ${symbol}`;

    const copyText = useCallback(
        (text: string, label: string) => {
            return async () => {
                try {
                    await navigator.clipboard.writeText(text);
                    toast.success(`${label} copiado`);
                } catch {
                    toast.error('Não foi possível copiar');
                }
            };
        },
        [toast],
    );

    const shortAddress = (addr: string) => (addr.length > 18 ? `${addr.slice(0, 10)}...${addr.slice(-6)}` : addr);

    return (
        <div
            className={cn(
                'absolute left-5 right-5 bottom-5 z-20 flex flex-col overflow-hidden rounded-t-xl border border-b-0 border-border bg-card text-card-foreground shadow-[0_-4px_24px_rgba(0,0,0,0.35)]',
                'animate-in slide-in-from-bottom-5 duration-300',
                className,
            )}
        >
            <header className="flex shrink-0 items-center justify-between border-b border-border bg-muted/30 px-4 py-2">
                <h2 className="font-sans text-sm font-semibold text-foreground">Detalhes da transferência</h2>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="cursor-pointer text-xs" aria-label="Exportar dados da página">
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Exportar
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer rounded-md" onClick={onClose} aria-label="Fechar">
                        <X className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </header>

            <div className="max-h-[50vh] overflow-y-auto p-4">
                <p className="mb-3 text-xs text-muted-foreground">
                    {fromLabel} ({shortAddress(source)}) → {toLabel} ({shortAddress(target)})
                </p>

                <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-border bg-muted/30">
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">From</th>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">To</th>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Total Amount</th>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Selected Amount</th>
                                <th className="px-3 py-2 text-left font-medium text-muted-foreground">Token</th>
                                {/* <th className="px-3 py-2 text-left font-medium text-muted-foreground">Transaction List</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <BinanceLogoIcon size={14} />
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{fromLabel}</div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">{source}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 cursor-pointer rounded shrink-0"
                                                    onClick={copyText(source, 'From')}
                                                    aria-label="Copiar From"
                                                >
                                                    <Copy className="h-2.5 w-2.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <BinanceLogoIcon size={14} />
                                        <div className="min-w-0">
                                            <div className="font-medium truncate">{toLabel}</div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-mono text-[10px] text-muted-foreground truncate max-w-[120px]">{target}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 cursor-pointer rounded shrink-0"
                                                    onClick={copyText(target, 'To')}
                                                    aria-label="Copiar To"
                                                >
                                                    <Copy className="h-2.5 w-2.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-3 py-2 font-mono">{amountStr}</td>
                                <td className="px-3 py-2 font-mono">{amountStr}</td>
                                <td className="px-3 py-2">
                                    <div className="flex items-center gap-1">
                                        <span>{symbol}</span>
                                    </div>
                                </td>
                                {/* <td className="px-3 py-2">
                                    <button
                                        type="button"
                                        className="cursor-pointer inline-flex items-center gap-0.5 text-primary hover:underline"
                                    >
                                        ({MOCK_TX_COUNT}/{MOCK_TX_COUNT}) Detail
                                        <ChevronRight className="h-3 w-3" />
                                    </button>
                                </td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {data?.dateStr && (
                    <p className="mt-2 text-[10px] text-muted-foreground">
                        Data: {data.dateStr} · {valueStr}
                    </p>
                )}
            </div>
        </div>
    );
}
