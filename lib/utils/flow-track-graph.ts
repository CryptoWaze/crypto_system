import type {
    TransactionsResolveResponse,
    FlowGraphNode,
    FlowGraphEdge,
    FlowToExchangeSuccess,
    FlowToExchangeFailure,
    FlowStep,
} from '@/lib/types/tracking';

export type EdgeTransactionItem = { amount: number; amountRaw: string; txHash: string; timestamp?: string };
export type FlowGraphEdgeWithTimestamp = FlowGraphEdge & {
    timestamp?: string;
    flowIndex?: number;
    chainIconUrl?: string;
    transactions?: EdgeTransactionItem[];
};
export type FlowGraphWithTimestamps = {
    nodes: FlowGraphNode[];
    edges: FlowGraphEdgeWithTimestamp[];
    returnSourceNodeIds?: string[];
};

function normalizeNode(n: { id?: string; label?: string; address?: string }, i: number): FlowGraphNode {
    const id = n.id ?? (n as { address?: string }).address ?? String(i);
    return { id, label: n.label ?? id };
}

export function buildGraphFromTrackingResult(result: FlowToExchangeSuccess | FlowToExchangeFailure): FlowGraphWithTimestamps | null {
    const { graph, steps } = result;
    const stepMap = new Map<string, string>();
    for (const step of steps ?? []) {
        const key = `${step.fromAddress}|${step.toAddress}|${step.transfer.txHash}`;
        stepMap.set(key, step.transfer.timestamp);
    }
    if (graph?.nodes?.length) {
        const nodes = graph.nodes.map(normalizeNode);
        const rawEdges = graph.edges ?? [];
        const edges: FlowGraphEdgeWithTimestamp[] = rawEdges.map((e) => {
            const key = `${e.from}|${e.to}|${e.txHash}`;
            return { ...e, timestamp: stepMap.get(key) };
        });
        return { nodes, edges };
    }
    if (steps?.length) {
        const seen = new Set<string>();
        const nodes: FlowGraphNode[] = [];
        const edges: FlowGraphEdgeWithTimestamp[] = [];
        for (const step of steps as FlowStep[]) {
            for (const addr of [step.fromAddress, step.toAddress]) {
                if (addr && !seen.has(addr)) {
                    seen.add(addr);
                    nodes.push({ id: addr, label: addr });
                }
            }
            edges.push({
                from: step.fromAddress,
                to: step.toAddress,
                symbol: step.transfer.symbol,
                amount: step.transfer.amount,
                amountRaw: step.transfer.rawAmount,
                txHash: step.transfer.txHash,
                timestamp: step.transfer.timestamp,
            });
        }
        return nodes.length ? { nodes, edges } : null;
    }
    return null;
}

export function buildGraphFromResolve(resolveData: TransactionsResolveResponse, txHash: string): FlowGraphWithTimestamps {
    const transfer =
        resolveData.seedTransfer ??
        (resolveData.transfers?.length ? resolveData.transfers.reduce((best, t) => (t.amount > best.amount ? t : best)) : null);
    if (!transfer) {
        return { nodes: [], edges: [] };
    }
    const nodes: FlowGraphNode[] = [
        { id: transfer.from, label: transfer.from },
        { id: transfer.to, label: transfer.to },
    ];
    const edge: FlowGraphEdgeWithTimestamp = {
        from: transfer.from,
        to: transfer.to,
        symbol: transfer.symbol,
        amount: transfer.amount,
        amountRaw: transfer.rawAmount,
        txHash,
        timestamp: transfer.timestamp,
    };
    return { nodes, edges: [edge] };
}
