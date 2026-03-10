import type { FlowGraphNode } from '@/lib/types/tracking';
import type { CaseByIdApiResponse } from '@/lib/types/case-api';
import type { FlowGraphEdgeWithTimestamp, FlowGraphWithTimestamps } from './flow-track-graph';

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
    }

    const nodes: FlowGraphNode[] = Array.from(nodeIds).map((id) => {
        const label = labelByNodeId.get(id) ?? id;
        const title = titleByNodeId.get(id);
        const chainIconUrl = chainIconUrlByNodeId.get(id);
        const endpointExchangeIconUrl = endpointExchangeIconUrlByNodeId.get(id);
        const base = { id, label };
        if (title != null) Object.assign(base, { title });
        if (chainIconUrl) Object.assign(base, { chainIconUrl });
        if (endpointExchangeIconUrl) Object.assign(base, { endpointExchangeIconUrl });
        return base as FlowGraphNode;
    });

    const edges: FlowGraphEdgeWithTimestamp[] = [];
    const returnSourceNodeIds = new Set<string>();
    const seenEdgeKeys = new Set<string>();
    let flowIndex = 0;

    function edgeKey(from: string, to: string, txHash: string, amount: number): string {
        return `${from ?? ''}|${to ?? ''}|${txHash ?? ''}|${amount}`;
    }

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
            const key = edgeKey(seed.txHash, toAddr, seed.txHash, amountNum);
            if (seenEdgeKeys.has(key)) continue;
            seenEdgeKeys.add(key);
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
            const key = edgeKey(fromAddr, toAddr ?? '', txHash, amountNum);
            if (seenEdgeKeys.has(key)) {
                if (toAddr) visitedInFlow.add(toAddr);
                if (e.fromAddress) visitedInFlow.add(e.fromAddress);
                continue;
            }
            seenEdgeKeys.add(key);
            edges.push({
                from: fromAddr,
                to: e.toAddress,
                symbol: trimSymbol(e.transferSymbol) || trimSymbol(flow.tokenSymbol),
                amount: amountNum,
                amountRaw: e.transferAmountRaw ?? '0',
                txHash,
                outcome: e.outcome,
                ...(tx?.timestamp ? { timestamp: tx.timestamp } : {}),
                flowIndex: f,
                ...(flow.chainIconUrl ? { chainIconUrl: flow.chainIconUrl } : {}),
            });
            if (toAddr) {
                visitedInFlow.add(toAddr);
            }
            if (e.fromAddress) {
                visitedInFlow.add(e.fromAddress);
            }
        }
    }

    return { nodes, edges, returnSourceNodeIds: Array.from(returnSourceNodeIds) };
}
