import { Position, type Node, type Edge } from '@xyflow/react';
import type { FlowGraph } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps, FlowGraphEdgeWithTimestamp } from '@/lib/utils/flow-track-graph';
import { NODE_WIDTH, NODE_HEIGHT, HORIZONTAL_GAP, FLOW_COLORS } from '../constants';
import { getOutEdges, orderNodeIds, getTreeLayoutPositions, enforceFlowDirection } from './layout';
import { formatEdgeAmount, formatEdgeTimestamp, capitalizeFirst } from './format';

export function flowGraphToReactFlow(
    graph: FlowGraph | FlowGraphWithTimestamps,
    caseName?: string | null,
    endpointExchangeName?: string | null,
    endpointHotWalletLabel?: string | null,
): { nodes: Node[]; edges: Edge[] } {
    const order = orderNodeIds(graph);
    const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
    const inDegree: Record<string, number> = {};
    for (const node of graph.nodes) inDegree[node.id] = 0;
    for (const edge of graph.edges) inDegree[edge.to] = (inDegree[edge.to] ?? 0) + 1;
    const seedNodeIds = new Set(graph.nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id));

    const treePositionMap = getTreeLayoutPositions(graph);
    let positionMap = new Map<string, { x: number; y: number }>();
    for (const node of graph.nodes) {
        const p = node.position;
        if (p != null && p !== 'default' && typeof p === 'object' && typeof p.x === 'number' && typeof p.y === 'number') {
            positionMap.set(node.id, { x: p.x, y: p.y });
        } else {
            positionMap.set(node.id, treePositionMap.get(node.id) ?? { x: 0, y: 0 });
        }
    }
    positionMap = enforceFlowDirection(positionMap, graph);
    const outEdgesBySource = getOutEdges(graph);
    const returnSourceIds = new Set((graph as FlowGraphWithTimestamps).returnSourceNodeIds ?? []);
    const nodes: Node[] = order.map((id, i) => {
        const n = nodeMap.get(id);
        const isSeedNode = seedNodeIds.has(id);
        let title: string | undefined;
        if (n?.title) {
            title = n.title;
        } else if (isSeedNode && caseName) {
            title = `${capitalizeFirst(caseName)} Address`;
        } else if (n?.label && n.label !== id) {
            title = n.label;
        }
        const label = title ? id : (n?.label ?? id);
        const pos = positionMap.get(id) ?? treePositionMap.get(id) ?? { x: i * (NODE_WIDTH + HORIZONTAL_GAP), y: 0 };
        const connectedIds = outEdgesBySource[id] ?? [];
        const connectedCount = connectedIds.length;
        const hasIncoming = (inDegree[id] ?? 0) > 0;
        return {
            id,
            type: 'flowTrackNode',
            position: pos,
            data: {
                label,
                fullAddress: id,
                title,
                hasOutgoing: connectedCount > 0,
                hasIncoming,
                connectedCount,
                connectedIds,
                isSeedNode,
                ...(n?.chainIconUrl ? { chainIconUrl: n.chainIconUrl } : {}),
                ...(n?.endpointExchangeIconUrl ? { endpointExchangeIconUrl: n.endpointExchangeIconUrl } : {}),
            },
            width: NODE_WIDTH,
            height: NODE_HEIGHT,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
        };
    });

    const edgesFromSource = new Map<string, { flowIndex: number; edgeIndex: number; targetId: string }[]>();
    graph.edges.forEach((e, i) => {
        const withTs = e as FlowGraphEdgeWithTimestamp;
        const flowIdx = withTs.flowIndex ?? i;
        const list = edgesFromSource.get(e.from) ?? [];
        list.push({ flowIndex: flowIdx, edgeIndex: i, targetId: e.to });
        edgesFromSource.set(e.from, list);
    });
    for (const list of edgesFromSource.values()) {
        list.sort((a, b) => {
            const yA = positionMap.get(a.targetId)?.y ?? 0;
            const yB = positionMap.get(b.targetId)?.y ?? 0;
            if (yA !== yB) return yA - yB;
            return a.flowIndex - b.flowIndex;
        });
    }
    const sourceHandleByEdgeIndex = new Map<number, string>();
    for (const list of edgesFromSource.values()) {
        list.forEach((item, slot) => {
            sourceHandleByEdgeIndex.set(item.edgeIndex, `source-${slot}`);
        });
    }

    const flowPositionCounter = new Map<number, number>();
    const edges: Edge[] = graph.edges.map((e, i) => {
        const withTs = e as FlowGraphEdgeWithTimestamp;
        const dateStr = withTs.timestamp != null ? formatEdgeTimestamp(withTs.timestamp) : '';
        const valueStr = `${formatEdgeAmount(e.amount)} ${e.symbol}`;
        const fromNode = nodeMap.get(e.from);
        const toNode = nodeMap.get(e.to);
        const fromLabel = fromNode?.label ?? e.from;
        const toLabel = toNode?.label ?? e.to;
        const fromIconUrl = fromNode?.endpointExchangeIconUrl ?? fromNode?.chainIconUrl;
        const toIconUrl = toNode?.endpointExchangeIconUrl ?? toNode?.chainIconUrl;
        const flowIdx = withTs.flowIndex ?? i;
        const stepInFlow = (flowPositionCounter.get(flowIdx) ?? 0) + 1;
        flowPositionCounter.set(flowIdx, stepInFlow);
        const flowColor = FLOW_COLORS[flowIdx % FLOW_COLORS.length];
        const sourceHandle = sourceHandleByEdgeIndex.get(i);
        const edgeChainIcon = (withTs as { chainIconUrl?: string }).chainIconUrl;
        const edgeTransactions = withTs.transactions;
        return {
            id: `e-${e.from}-${e.to}-${i}`,
            source: e.from,
            target: e.to,
            sourceHandle,
            type: 'flowTrackBezier',
            data: {
                symbol: e.symbol,
                amount: e.amount,
                amountRaw: e.amountRaw,
                txHash: e.txHash,
                outcome: e.outcome,
                dateStr,
                valueStr,
                fromLabel,
                toLabel,
                ...(fromIconUrl ? { fromIconUrl } : {}),
                ...(toIconUrl ? { toIconUrl } : {}),
                exchangeName: endpointExchangeName ?? 'Binance',
                flowIndex: flowIdx,
                stepInFlow,
                flowColor,
                ...(edgeChainIcon ? { chainIconUrl: edgeChainIcon } : {}),
                ...(edgeTransactions?.length ? { transactions: edgeTransactions } : {}),
            },
        };
    });

    return { nodes, edges };
}
