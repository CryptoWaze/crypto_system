'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Pencil, Copy, X, Search, ChevronRight, Check, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useToast } from '@/lib/toast-context';
import type { Node } from '@xyflow/react';
import { getAddressTopTransfers } from '@/lib/services/addresses/get-address-top-transfers.service';
import type { WalletTransfer } from '@/lib/types/address-top-transfers';

function BinanceLogoIcon({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

function ChainIcon({ src, size = 24 }: { src: string; size?: number }) {
    if (!src || typeof src !== 'string') return null;
    return (
        <img
            src={src}
            alt=""
            width={size}
            height={size}
            className="shrink-0 rounded-full object-contain"
            style={{ width: size, height: size }}
            referrerPolicy="no-referrer"
        />
    );
}

const MOCK_BALANCE_BNB = '0.00588';
const MOCK_BALANCE_USD = 3;

const PANEL_WIDTH = 420;

type FlowNodeDetailModalProps = {
    node: Node;
    onClose: () => void;
    onEditNameTag?: () => void;
    onNameTagChange?: (nodeId: string, newNameTag: string) => void;
    className?: string;
};

function formatTransferAmount(amount: number): string {
    if (!Number.isFinite(amount)) return '—';
    if (amount >= 0.01) return amount.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
    if (amount === 0) return '0';
    const exp = Math.floor(Math.log10(amount));
    const mantissa = amount / Math.pow(10, exp);
    return mantissa.toFixed(4).replace('.', ',') + 'e' + exp;
}

function chainLabel(chain: string): string {
    if (chain === 'bsc-mainnet') return 'BSC';
    if (chain === 'eth-mainnet') return 'ETH';
    return chain;
}

export function FlowNodeDetailModal({ node, onClose, onEditNameTag, onNameTagChange, className }: FlowNodeDetailModalProps) {
    const toast = useToast();
    const { data: session } = useSession();
    const accessToken = (session?.user as { accessToken?: string } | undefined)?.accessToken;

    const [topTransfersLoading, setTopTransfersLoading] = useState(false);
    const [topTransfersError, setTopTransfersError] = useState<string | null>(null);
    const [topTransfersRows, setTopTransfersRows] = useState<{ chain: string; transfer: WalletTransfer }[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const address = node.id;
    const title = node.data?.title as string | undefined;
    const label = (node.data?.label as string) ?? address;
    const endpointExchangeIconUrl = node.data?.endpointExchangeIconUrl as string | undefined;
    const chainIconUrl = node.data?.chainIconUrl as string | undefined;
    const iconUrl = endpointExchangeIconUrl ?? chainIconUrl;
    const hasTitleLayout = Boolean(title);
    const isSeedNode = node.data?.isSeedNode === true;
    const NodeIcon = iconUrl ? <ChainIcon src={iconUrl} size={32} /> : <BinanceLogoIcon size={32} />;

    useEffect(() => {
        if (!address || !accessToken) {
            setTopTransfersRows([]);
            setTopTransfersError(null);
            return;
        }
        let cancelled = false;
        setTopTransfersLoading(true);
        setTopTransfersError(null);
        getAddressTopTransfers(address, accessToken)
            .then((result) => {
                if (cancelled) return;
                setTopTransfersLoading(false);
                if (!result.ok) {
                    setTopTransfersError(result.message);
                    setTopTransfersRows([]);
                    return;
                }
                const rows: { chain: string; transfer: WalletTransfer }[] = [];
                for (const [chain, data] of Object.entries(result.data)) {
                    if (data?.transfers?.length) {
                        for (const transfer of data.transfers) {
                            rows.push({ chain, transfer });
                        }
                    }
                }
                setTopTransfersRows(rows);
            })
            .catch(() => {
                if (!cancelled) {
                    setTopTransfersLoading(false);
                    setTopTransfersError('Erro ao carregar transferências.');
                    setTopTransfersRows([]);
                }
            });
        return () => {
            cancelled = true;
        };
    }, [address, accessToken]);

    const filteredRows = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return topTransfersRows;
        return topTransfersRows.filter(({ transfer }) => {
            const cp = (transfer.counterparty ?? '').toLowerCase();
            const from = (transfer.from ?? '').toLowerCase();
            const to = (transfer.to ?? '').toLowerCase();
            const sym = (transfer.symbol ?? '').toLowerCase();
            const tx = (transfer.txHash ?? '').toLowerCase();
            return cp.includes(q) || from.includes(q) || to.includes(q) || sym.includes(q) || tx.includes(q);
        });
    }, [topTransfersRows, searchQuery]);

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
                'flex h-full flex-col overflow-hidden rounded-xl border border-l-0 border-border bg-card text-card-foreground shadow-[4px_0_24px_rgba(0,0,0,0.35)]',
                className,
            )}
            style={{ width: PANEL_WIDTH, minWidth: PANEL_WIDTH, maxWidth: PANEL_WIDTH }}
        >
            <div className="modal-cases-list flex flex-1 flex-col min-h-0 overflow-y-auto overflow-x-hidden p-4">
                <div className="flex items-start gap-3 shrink-0">
                    {NodeIcon}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            {hasTitleLayout ? <h2 className="font-sans text-base font-bold text-foreground truncate">{title}</h2> : null}
                            {!isSeedNode && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 shrink-0 cursor-pointer rounded-md"
                                    aria-label={hasTitleLayout ? 'Editar etiqueta de nome' : 'Adicionar etiqueta de nome'}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        onEditNameTag?.();
                                    }}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('h-7 w-7 shrink-0 cursor-pointer rounded-md', hasTitleLayout && '-mt-5 -mr-2', 'ml-auto')}
                                onClick={onClose}
                                aria-label="Fechar"
                            >
                                <X className="h-3.5 w-3.5" />
                            </Button>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground break-all">{label}</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 cursor-pointer rounded"
                                onClick={handleCopyAddress}
                                aria-label="Copiar endereço"
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                            {iconUrl ? <ChainIcon src={iconUrl} size={14} /> : <BinanceLogoIcon size={14} />}
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

                {/* <div className="mt-4 space-y-1 rounded-lg border border-border bg-muted/20 p-3 shrink-0">
                    <p className="text-xs text-muted-foreground">
                        BNB Balance:{' '}
                        <span className="font-semibold text-foreground">
                            {MOCK_BALANCE_BNB} (${MOCK_BALANCE_USD})
                        </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Total value on BSC: <span className="font-semibold text-foreground">${MOCK_BALANCE_USD}</span>
                    </p>
                </div> */}

                <div className="mt-4 flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground mb-2 shrink-0">Transferências</p>
                    <div className="relative shrink-0">
                        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por endereço, token ou hash..."
                            className="h-8 pl-8 text-xs"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="mt-3 rounded-lg border border-border overflow-x-auto modal-cases-list">
                        {topTransfersLoading && (
                            <div className="flex items-center justify-center gap-2 py-6">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Carregando transferências...</span>
                            </div>
                        )}
                        {!topTransfersLoading && topTransfersError && <p className="p-3 text-xs text-muted-foreground">{topTransfersError}</p>}
                        {!topTransfersLoading && !topTransfersError && topTransfersRows.length === 0 && (
                            <p className="p-3 text-xs text-muted-foreground">Nenhuma transferência recente encontrada para esta carteira.</p>
                        )}
                        {!topTransfersLoading && !topTransfersError && topTransfersRows.length > 0 && filteredRows.length === 0 && (
                            <p className="p-3 text-xs text-muted-foreground">Nenhum resultado para &quot;{searchQuery.trim()}&quot;.</p>
                        )}
                        {!topTransfersLoading && !topTransfersError && filteredRows.length > 0 && (
                            <table className="w-full text-xs border-collapse">
                                <thead className="sticky top-0 bg-muted/30 z-10">
                                    <tr className="border-b border-border">
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Counterparty</th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">
                                            Direction
                                            <Info className="ml-0.5 inline h-3 w-3" />
                                        </th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Token</th>
                                        <th className="px-2 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">Transfer</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map(({ chain, transfer }, i) => (
                                        <tr
                                            key={`${chain}-${transfer.txHash}-${i}`}
                                            className="border-b border-border/50 last:border-0 hover:bg-muted/20"
                                        >
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1">
                                                            {iconUrl ? <ChainIcon src={iconUrl} size={12} /> : <BinanceLogoIcon size={12} />}
                                                            <span className="font-medium truncate">
                                                                {transfer.counterparty
                                                                    ? `${transfer.counterparty.slice(0, 6)}…${transfer.counterparty.slice(-4)}`
                                                                    : transfer.direction === 'OUT'
                                                                      ? (transfer.to ?? '').slice(0, 6) + '…'
                                                                      : (transfer.from ?? '').slice(0, 6) + '…'}
                                                            </span>
                                                        </div>
                                                        <span className="font-mono text-[10px] text-muted-foreground truncate block max-w-[180px]">
                                                            {transfer.counterparty || (transfer.direction === 'OUT' ? transfer.to : transfer.from)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <span className={transfer.direction === 'IN' ? 'text-green-500' : 'text-red-500'}>
                                                    {transfer.direction}
                                                </span>
                                            </td>
                                            <td className="px-2 py-2 text-muted-foreground whitespace-nowrap">{transfer.symbol || '—'}</td>
                                            <td className="px-2 py-2 whitespace-nowrap">
                                                <span className="text-muted-foreground">{formatTransferAmount(transfer.amount)}</span>
                                                <span className="ml-1 text-muted-foreground/70">{chainLabel(chain)}</span>
                                                <ChevronRight className="ml-0.5 inline h-3 w-3" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </aside>
    );
}
