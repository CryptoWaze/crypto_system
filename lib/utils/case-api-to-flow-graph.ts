import type { FlowGraphNode } from '@/lib/types/tracking';
import type { CaseByIdApiResponse } from '@/lib/types/case-api';
import type { EdgeTransactionItem, FlowGraphEdgeWithTimestamp, FlowGraphWithTimestamps, SoftDeleteTransactionItem } from './flow-track-graph';

function trimSymbol(s: string | undefined | null): string {
    return (s ?? '').trim() || '—';
}

export function caseByIdResponseToFlowGraph(data: CaseByIdApiResponse): FlowGraphWithTimestamps {
    const seeds = data.seeds ?? [];
    const flows = data.flows ?? [];

    const nodeIds = new Set<string>();
    const labelByNodeId = new Map<string, string>();
    const chainIconUrlByNodeId = new Map<string, string>();
    const endpointExchangeIconUrlByNodeId = new Map<string, string>();

    for (const seed of seeds) {
        if (seed.txHash) {
            nodeIds.add(seed.txHash);
            labelByNodeId.set(seed.txHash, seed.txHash);
            if (seed.chainIconUrl) chainIconUrlByNodeId.set(seed.txHash, seed.chainIconUrl);
        }
        const addrs = seed.initialWalletAddresses?.length
            ? seed.initialWalletAddresses
            : seed.initialWalletAddress
              ? [seed.initialWalletAddress]
              : [];
        for (const addr of addrs) {
            if (addr) {
                nodeIds.add(addr);
                if (!labelByNodeId.has(addr)) labelByNodeId.set(addr, addr);
            }
        }
    }

    for (const flow of flows) {
        const flowChainIcon = flow.chainIconUrl;
        if (flow.initialWalletAddress) {
            nodeIds.add(flow.initialWalletAddress);
            if (!labelByNodeId.has(flow.initialWalletAddress)) {
                labelByNodeId.set(flow.initialWalletAddress, flow.initialWalletAddress);
            }
            if (flowChainIcon && !chainIconUrlByNodeId.has(flow.initialWalletAddress)) {
                chainIconUrlByNodeId.set(flow.initialWalletAddress, flowChainIcon);
            }
        }
        if (flow.endpointAddress) {
            nodeIds.add(flow.endpointAddress);
            labelByNodeId.set(flow.endpointAddress, flow.endpointAddress);
            if (flowChainIcon && !chainIconUrlByNodeId.has(flow.endpointAddress)) {
                chainIconUrlByNodeId.set(flow.endpointAddress, flowChainIcon);
            }
            if (flow.endpointExchangeIconUrl) {
                endpointExchangeIconUrlByNodeId.set(flow.endpointAddress, flow.endpointExchangeIconUrl);
            }
        }
        for (const edge of flow.edges ?? []) {
            if (edge.toAddress === flow.endpointAddress && edge.fromAddress && flow.endpointExchangeIconUrl) {
                endpointExchangeIconUrlByNodeId.set(edge.fromAddress, flow.endpointExchangeIconUrl);
            }
            if (edge.fromAddress) {
                nodeIds.add(edge.fromAddress);
                if (!labelByNodeId.has(edge.fromAddress)) {
                    labelByNodeId.set(edge.fromAddress, edge.fromAddress);
                }
                if (flowChainIcon && !chainIconUrlByNodeId.has(edge.fromAddress)) {
                    chainIconUrlByNodeId.set(edge.fromAddress, flowChainIcon);
                }
            }
            if (edge.toAddress) {
                nodeIds.add(edge.toAddress);
                if (!labelByNodeId.has(edge.toAddress)) {
                    labelByNodeId.set(edge.toAddress, edge.toAddress);
                }
                if (flowChainIcon && !chainIconUrlByNodeId.has(edge.toAddress)) {
                    chainIconUrlByNodeId.set(edge.toAddress, flowChainIcon);
                }
            }
        }
    }

    const titleByNodeId = new Map<string, string>();
    const positionByNodeId = new Map<string, { x: number; y: number }>();
    for (const flow of flows) {
        if (flow.endpointAddress) {
            labelByNodeId.set(flow.endpointAddress, flow.endpointAddress);
            const exchangeName = flow.endpointExchangeName ?? 'Binance';
            const hotLabel = flow.endpointHotWalletLabel ?? 'Hot Wallet';
            titleByNodeId.set(flow.endpointAddress, `${exchangeName}: ${hotLabel}`);
            for (const edge of flow.edges ?? []) {
                if (edge.toAddress === flow.endpointAddress && edge.fromAddress) {
                    titleByNodeId.set(edge.fromAddress, `${exchangeName}: Deposit Address`);
                }
            }
        }
        const wallets = flow.wallets ?? [];
        for (const w of wallets) {
            const address = w.address;
            if (!address) continue;
            const nicknameOrLabel = (w.nickname ?? w.displayLabel ?? '').trim();
            if (nicknameOrLabel !== '') {
                labelByNodeId.set(address, nicknameOrLabel);
            }
            const pos = w.position;
            if (pos != null && typeof pos === 'object' && typeof pos.x === 'number' && typeof pos.y === 'number' && !positionByNodeId.has(address)) {
                positionByNodeId.set(address, { x: pos.x, y: pos.y });
            }
        }
    }

    const walletIdsByNodeId: Record<string, string[]> = {};
    for (const flow of flows) {
        for (const w of flow.wallets ?? []) {
            if (w.address && w.id && !String(w.id).startsWith('_virtual_')) {
                if (!walletIdsByNodeId[w.address]) walletIdsByNodeId[w.address] = [];
                walletIdsByNodeId[w.address].push(w.id);
            }
        }
    }

    const nodes: FlowGraphNode[] = Array.from(nodeIds).map((id) => {
        const label = labelByNodeId.get(id) ?? id;
        const title = titleByNodeId.get(id);
        const chainIconUrl = chainIconUrlByNodeId.get(id);
        const endpointExchangeIconUrl = endpointExchangeIconUrlByNodeId.get(id);
        const pos = positionByNodeId.get(id);
        const base: FlowGraphNode = { id, label };
        if (title != null) base.title = title;
        if (chainIconUrl) base.chainIconUrl = chainIconUrl;
        if (endpointExchangeIconUrl) base.endpointExchangeIconUrl = endpointExchangeIconUrl;
        if (pos) base.position = pos;
        return base;
    });

    const edges: FlowGraphEdgeWithTimestamp[] = [];
    const returnSourceNodeIds = new Set<string>();
    const seenSeedEdgeKeys = new Set<string>();
    let flowIndex = 0;

    function seedEdgeKey(from: string, to: string, txHash: string, amount: number): string {
        return `${from ?? ''}|${to ?? ''}|${txHash ?? ''}|${amount}`;
    }

    type ConsolidatedEdge = {
        from: string;
        to: string;
        symbol: string;
        amount: number;
        amountRaw: string;
        txHash: string;
        outcome?: 'SUCCESS' | 'NO_OUTBOUND' | 'MAX_WALLETS_REACHED' | 'EXHAUSTED_OPTIONS';
        timestamp?: string;
        flowIndex: number;
        chainIconUrl?: string;
        transactions: EdgeTransactionItem[];
        softDeleteItems: SoftDeleteTransactionItem[];
    };
    const consolidatedByKey = new Map<string, ConsolidatedEdge>();

    for (const seed of seeds) {
        if (!seed.txHash) continue;
        const initialAddrs = seed.initialWalletAddresses?.length
            ? seed.initialWalletAddresses
            : seed.initialWalletAddress
              ? [seed.initialWalletAddress]
              : [];
        const amount = parseFloat(seed.amountDecimal ?? '0');
        const amountNum = Number.isFinite(amount) ? amount : 0;
        const basePayload = {
            symbol: trimSymbol(seed.tokenSymbol),
            amount: amountNum,
            amountRaw: seed.amountRaw ?? '0',
            txHash: seed.txHash,
            ...(seed.timestamp ? { timestamp: seed.timestamp } : {}),
        };
        for (const toAddr of initialAddrs) {
            if (!toAddr) continue;
            const key = seedEdgeKey(seed.txHash, toAddr, seed.txHash, amountNum);
            if (seenSeedEdgeKeys.has(key)) continue;
            seenSeedEdgeKeys.add(key);
            edges.push({
                from: seed.txHash,
                to: toAddr,
                ...basePayload,
                flowIndex: flowIndex++,
                ...(seed.chainIconUrl ? { chainIconUrl: seed.chainIconUrl } : {}),
            });
        }
    }

    for (let f = 0; f < flows.length; f++) {
        const flow = flows[f];
        const flowEdges = flow.edges ?? [];
        const flowTransactions = flow.transactions ?? [];
        const visitedInFlow = new Set<string>();
        if (flow.initialWalletAddress) {
            visitedInFlow.add(flow.initialWalletAddress);
        }
        for (let i = 0; i < flowEdges.length; i++) {
            const e = flowEdges[i];
            const toAddr = e.toAddress;
            if (toAddr && visitedInFlow.has(toAddr)) {
                if (e.fromAddress) returnSourceNodeIds.add(e.fromAddress);
                continue;
            }
            const tx = flowTransactions[i];
            const amount = parseFloat(e.transferAmountDecimal ?? '0');
            const amountNum = Number.isFinite(amount) ? amount : 0;
            const fromAddr = e.fromAddress ?? '';
            const txHash = e.txHash ?? '';
            if (!toAddr) {
                if (e.fromAddress) visitedInFlow.add(e.fromAddress);
                continue;
            }
            const symbol = trimSymbol(e.transferSymbol) || trimSymbol(flow.tokenSymbol);
            const txTimestamp = tx?.timestamp ?? '';
            const consolidateKey = `${fromAddr}|${toAddr}|${symbol}`;
            const existing = consolidatedByKey.get(consolidateKey);
            const item: EdgeTransactionItem = {
                amount: amountNum,
                amountRaw: e.transferAmountRaw ?? '0',
                txHash,
                ...(txTimestamp ? { timestamp: txTimestamp } : {}),
            };
            const transactionId = (tx && 'id' in tx && typeof tx.id === 'string' ? tx.id : null) ?? e.id;
            const flowId =
                (tx && 'flowId' in tx && typeof (tx as { flowId?: string }).flowId === 'string' ? (tx as { flowId: string }).flowId : null) ??
                flow.id;
            const softItem: SoftDeleteTransactionItem = { flowId, transactionId };
            if (existing) {
                existing.amount += amountNum;
                existing.transactions.push(item);
                existing.softDeleteItems.push(softItem);
                if (txTimestamp && (!existing.timestamp || txTimestamp > existing.timestamp)) {
                    existing.timestamp = txTimestamp;
                    existing.txHash = txHash;
                    existing.amountRaw = e.transferAmountRaw ?? existing.amountRaw;
                    existing.outcome = e.outcome;
                    existing.flowIndex = f;
                    if (flow.chainIconUrl) existing.chainIconUrl = flow.chainIconUrl;
                }
            } else {
                consolidatedByKey.set(consolidateKey, {
                    from: fromAddr,
                    to: toAddr,
                    symbol,
                    amount: amountNum,
                    amountRaw: e.transferAmountRaw ?? '0',
                    txHash,
                    outcome: e.outcome,
                    timestamp: txTimestamp || undefined,
                    flowIndex: f,
                    transactions: [item],
                    softDeleteItems: [softItem],
                    ...(flow.chainIconUrl ? { chainIconUrl: flow.chainIconUrl } : {}),
                });
            }
            if (toAddr) {
                visitedInFlow.add(toAddr);
            }
            if (e.fromAddress) {
                visitedInFlow.add(e.fromAddress);
            }
        }
    }

    for (const c of consolidatedByKey.values()) {
        const edgePayload: FlowGraphEdgeWithTimestamp = {
            from: c.from,
            to: c.to,
            symbol: c.symbol,
            amount: c.amount,
            amountRaw: c.amountRaw,
            txHash: c.txHash,
            outcome: c.outcome,
            ...(c.timestamp ? { timestamp: c.timestamp } : {}),
            flowIndex: c.flowIndex,
            ...(c.chainIconUrl ? { chainIconUrl: c.chainIconUrl } : {}),
        };
        if (c.transactions.length > 0) edgePayload.transactions = c.transactions;
        if (c.softDeleteItems.length > 0) edgePayload.softDeleteItems = c.softDeleteItems;
        edges.push(edgePayload);
    }

    const softDeleteItemsByNodeId: Record<string, SoftDeleteTransactionItem[]> = {};
    for (const edge of edges) {
        const items = edge.softDeleteItems ?? [];
        if (items.length === 0) continue;
        for (const nodeId of [edge.from, edge.to]) {
            if (!softDeleteItemsByNodeId[nodeId]) softDeleteItemsByNodeId[nodeId] = [];
            softDeleteItemsByNodeId[nodeId].push(...items);
        }
    }

    return { nodes, edges, returnSourceNodeIds: Array.from(returnSourceNodeIds), walletIdsByNodeId, softDeleteItemsByNodeId };
}
