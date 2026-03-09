'use client';

import { useCallback } from 'react';
import { Pencil, Copy, GripVertical, X, Search, Filter, ChevronRight, Zap, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import type { Node } from '@xyflow/react';

function BinanceLogoIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

const MOCK_BALANCE_BNB = '0.00588';
const MOCK_BALANCE_USD = 3;
const MOCK_COUNTERPARTIES = [
    {
        label: 'LABEL_0x520e',
        address: '0x520e6b02925c77f165eeb57e74be051ca94bf2ce',
        risk: 'low',
        direction: 'IN' as const,
        token: 'BNB',
        transfer: '1/1',
    },
    {
        label: 'Binance: Hot Wallet',
        address: '0x8894e0a0c962cb723c1976a4421c5949be2d4e3',
        risk: 'none',
        direction: 'OUT' as const,
        token: 'BNB',
        transfer: '4/4',
    },
];

type FlowNodeDetailModalProps = {
    node: Node;
    onClose: () => void;
    className?: string;
};

export function FlowNodeDetailModal({ node, onClose, className }: FlowNodeDetailModalProps) {
    const toast = useToast();
    const address = node.id;
    const title = (node.data?.title as string) ?? 'Binance: Deposit Address';
    const label = (node.data?.label as string) ?? address;

    const handleCopyAddress = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(address);
            toast.success('Endereço copiado');
        } catch {
            toast.error('Não foi possível copiar');
        }
    }, [address, toast]);

    return (
        <aside
            className={cn(
                'flex h-full w-max flex-col overflow-hidden rounded-xl border border-l-0 border-border bg-card text-card-foreground shadow-[4px_0_24px_rgba(0,0,0,0.35)]',
                className,
            )}
        >
            <div className="flex-1 overflow-y-auto p-4">
                <div className="flex items-start gap-3">
                    <BinanceLogoIcon size={32} />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <h2 className="font-sans text-base font-bold text-foreground truncate">{title}</h2>
                            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 cursor-pointer rounded-md" aria-label="Editar">
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto h-7 w-7 shrink-0 cursor-pointer rounded-md -mt-5 -mr-2"
                                onClick={onClose}
                                aria-label="Fechar"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground break-all">{address}</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 cursor-pointer rounded" onClick={handleCopyAddress} aria-label="Copiar endereço">
                                <Copy className="h-3 w-3" />
                            </Button>
                            <BinanceLogoIcon size={14} />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                            <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                EXCHANGE
                            </span>
                            <span className="flex items-center gap-1 rounded-md border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400">
                                <Check className="h-3 w-3" />
                                No Risk
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-1 rounded-lg border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">
                        BNB Balance:{' '}
                        <span className="font-semibold text-foreground">
                            {MOCK_BALANCE_BNB} (${MOCK_BALANCE_USD})
                        </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Total value on BSC: <span className="font-semibold text-foreground">${MOCK_BALANCE_USD}</span>
                    </p>
                </div>

                <Tabs defaultValue="related" className="mt-4">
                    <TabsList className="h-9 w-full justify-start rounded-lg bg-muted/50 p-0">
                        <TabsTrigger
                            value="related"
                            className="cursor-pointer rounded-md px-4 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            Related Address
                        </TabsTrigger>
                        <TabsTrigger
                            value="transfer"
                            className="cursor-pointer rounded-md px-4 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            Transfer
                        </TabsTrigger>
                    </TabsList>
                    <div className="mt-3 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Address/Label" className="h-8 pl-8 text-xs" />
                        </div>
                        <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 cursor-pointer rounded-md" aria-label="Filtrar">
                            <Filter className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <TabsContent value="related" className="mt-3">
                        <div className="rounded-lg border border-border overflow-hidden">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border bg-muted/30">
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground">Counterparty</th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground">Risk</th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground">
                                            Direction
                                            <Info className="ml-0.5 inline h-3 w-3" />
                                        </th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground">Token</th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground">Transfer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_COUNTERPARTIES.map((row, i) => (
                                        <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/20">
                                            <td className="px-2 py-2">
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer rounded" aria-label="Visualizar">
                                                        <span className="text-muted-foreground">👁</span>
                                                    </Button>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1">
                                                            <BinanceLogoIcon size={12} />
                                                            <span className="font-medium truncate">{row.label}</span>
                                                        </div>
                                                        <span className="font-mono text-[10px] text-muted-foreground truncate block">
                                                            {row.address}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2">
                                                {row.risk === 'none' ? (
                                                    <Check className="h-3.5 w-3.5 text-green-500" />
                                                ) : (
                                                    <Zap className="h-3.5 w-3.5 text-green-500" />
                                                )}
                                            </td>
                                            <td className="px-2 py-2">
                                                <span className={row.direction === 'IN' ? 'text-green-500' : 'text-red-500'}>{row.direction}</span>
                                            </td>
                                            <td className="px-2 py-2 text-muted-foreground">$</td>
                                            <td className="px-2 py-2">
                                                <span className="text-muted-foreground">{row.transfer}</span>
                                                <ChevronRight className="ml-0.5 inline h-3 w-3" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </TabsContent>
                    <TabsContent value="transfer" className="mt-3">
                        <p className="text-xs text-muted-foreground">Lista de transferências (mock).</p>
                    </TabsContent>
                </Tabs>
            </div>
        </aside>
    );
}
