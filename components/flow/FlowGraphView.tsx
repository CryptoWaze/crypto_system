'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, memo, useState } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    useReactFlow,
    Position,
    getBezierPath,
    Handle,
    type Node,
    type Edge,
    type OnNodesChange,
    type OnEdgesChange,
    type EdgeProps,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Pencil, Trash2 } from 'lucide-react';
import type { FlowGraph, FlowGraphEdge } from '@/lib/types/tracking';
import { FlowNodeDetailModal } from './FlowNodeDetailModal';
import { FlowEdgeDetailModal } from './FlowEdgeDetailModal';
import { EditNameTagModal } from './EditNameTagModal';

const LABEL_WIDTH = 300;
const LABEL_HEIGHT = 52;

const FLOW_COLORS = [
    'rgba(0, 230, 230, 0.9)',
    'rgba(255, 193, 7, 0.9)',
    'rgba(255, 105, 180, 0.9)',
    'rgba(76, 175, 80, 0.9)',
    'rgba(255, 152, 0, 0.9)',
    'rgba(156, 39, 176, 0.9)',
    'rgba(33, 150, 243, 0.9)',
    'rgba(244, 67, 54, 0.9)',
    'rgba(0, 188, 212, 0.9)',
    'rgba(255, 235, 59, 0.9)',
];

function formatEdgeAmount(value: number): string {
    if (!Number.isFinite(value)) return String(value);
    if (value >= 0.01) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
    }
    if (value === 0) return '0';
    const exp = Math.floor(Math.log10(value));
    const mantissa = value / Math.pow(10, exp);
    const significant = mantissa.toFixed(4).replace('.', '');
    const zeros = -exp - 1;
    return '0,' + '0'.repeat(zeros) + significant;
}

function BinanceLogoIcon({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

const SOURCE_HANDLE_STYLE = { background: 'rgba(91,141,239,0.5)', border: 'none', width: 10, height: 10, zIndex: 10 };

const FlowGraphEditContext = createContext<{ openEditNameTag: (nodeId: string) => void } | null>(null);

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

function FlowTrackNode({ id, data, sourcePosition, targetPosition, dragging, selected }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const editContext = useContext(FlowGraphEditContext);
    const label = (data?.label as string) ?? '';
    const title = data?.title as string | undefined;
    const endpointExchangeIconUrl = data?.endpointExchangeIconUrl as string | undefined;
    const chainIconUrl = data?.chainIconUrl as string | undefined;
    const iconUrl = endpointExchangeIconUrl ?? chainIconUrl;
    const hasOutgoing = data?.hasOutgoing === true;
    const connectedCount = Math.max(1, (data?.connectedCount as number) ?? 1);
    const showHighlight = hovered || dragging || selected;
    const hasTitleLayout = Boolean(title);
    const NodeIcon = iconUrl ? <ChainIcon src={iconUrl} size={20} /> : <BinanceLogoIcon size={20} />;

    return (
        <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Handle
                type="target"
                position={targetPosition ?? Position.Left}
                style={{ background: 'rgba(91,141,239,0.5)', border: 'none', width: 10, height: 10, zIndex: 10 }}
            />
            <div
                className={`flow-track-node rounded-xl font-mono text-xs relative ${showHighlight ? 'flow-track-node--highlight' : ''}`}
                style={{
                    padding: hasTitleLayout ? '8px 10px 24px' : '10px 16px 28px',
                    width: NODE_WIDTH,
                    minHeight: NODE_HEIGHT,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: hasTitleLayout ? 'flex-start' : 'center',
                    wordBreak: 'break-all',
                    textAlign: hasTitleLayout ? 'left' : 'center',
                }}
            >
                {hasTitleLayout ? (
                    <div className="flex items-start gap-2 w-full min-w-0">
                        {NodeIcon}
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1 overflow-hidden">
                            <span className="font-sans font-bold text-xs text-white whitespace-nowrap truncate">{title}</span>
                            <span className="font-mono leading-tight break-all" style={{ fontSize: 9, color: '#6B7280' }}>
                                {label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-start gap-2 w-full min-w-0">
                        {NodeIcon}
                        <span className="font-mono leading-tight break-all min-w-0 flex-1 text-left" style={{ fontSize: 9, color: '#6B7280' }}>
                            {label}
                        </span>
                    </div>
                )}
                {hovered && !(data?.isSeedNode === true) && (
                    <div className="absolute flex gap-1 items-center cursor-pointer" style={{ bottom: 4, right: 6 }}>
                        <button
                            type="button"
                            className="flex items-center justify-center rounded-md p-1 transition-colors cursor-pointer hover:opacity-90 hover:scale-105"
                            style={{ background: 'rgba(91,141,239,0.18)', border: '1px solid rgba(91,141,239,0.35)', color: '#8babf5' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                editContext?.openEditNameTag(id);
                            }}
                        >
                            <Pencil size={12} />
                        </button>
                        <button
                            className="flex items-center justify-center rounded-md p-1 transition-colors cursor-pointer hover:opacity-90 hover:scale-105"
                            style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
                            onMouseDown={(e) => e.stopPropagation()}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
            {hasOutgoing &&
                Array.from({ length: connectedCount }, (_, i) => (
                    <Handle
                        key={`source-${i}`}
                        id={`source-${i}`}
                        type="source"
                        position={sourcePosition ?? Position.Right}
                        style={{
                            ...SOURCE_HANDLE_STYLE,
                            top: connectedCount > 1 ? `${((i + 1) / (connectedCount + 1)) * 100}%` : '50%',
                            left: 'auto',
                            right: -5,
                            transform: 'translateY(-50%)',
                        }}
                    />
                ))}
        </div>
    );
}

const FlowTrackNodeMemo = memo(FlowTrackNode);

function FlowTrackBezierEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    style,
    markerEnd,
    markerStart,
    selected,
}: EdgeProps) {
    const [path, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition: sourcePosition ?? Position.Right,
        targetPosition: targetPosition ?? Position.Left,
    });
    const dateStr = (data?.dateStr as string) ?? '';
    const valueStr = (data?.valueStr as string) ?? '';
    const stepInFlow = (data?.stepInFlow as number) ?? 1;
    const indexLabel = Math.max(1, stepInFlow);
    const flowColor = (data?.flowColor as string) ?? 'rgba(160, 160, 160, 0.7)';
    const chainIconUrl = data?.chainIconUrl as string | undefined;

    const pathStyle = selected ? { ...style, stroke: flowColor, strokeWidth: 3, opacity: 1 } : { ...style, stroke: flowColor, strokeWidth: 2 };

    return (
        <>
            <path id={id} d={path} fill="none" className="react-flow__edge-path" style={pathStyle} markerEnd={markerEnd} markerStart={markerStart} />
            <path d={path} fill="none" strokeOpacity={0} strokeWidth={20} className="react-flow__edge-interaction" />
            {valueStr && (
                <foreignObject
                    x={labelX - LABEL_WIDTH / 2}
                    y={labelY - LABEL_HEIGHT + 10}
                    width={LABEL_WIDTH}
                    height={LABEL_HEIGHT}
                    className="react-flow__edge-label-foreign"
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div
                        className="flow-edge-label-two-lines"
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            textAlign: 'center',
                            fontSize: 11,
                            fontFamily: 'ui-monospace, monospace',
                            background: 'transparent',
                            padding: '4px 0',
                            boxSizing: 'border-box',
                            color: '#fff',
                        }}
                    >
                        <span style={{ fontSize: 10, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <span style={{ color: flowColor }}>[{indexLabel}]</span>
                            <span style={{ color: '#fff' }}>
                                {dateStr ? ` [${dateStr}] ` : ' '}
                                {valueStr}
                            </span>
                        </span>
                    </div>
                </foreignObject>
            )}
        </>
    );
}

const FlowTrackBezierEdgeMemo = memo(FlowTrackBezierEdge);

export type FlowGraphEdgeWithTimestamp = FlowGraphEdge & { timestamp?: string; flowIndex?: number };
export type FlowGraphWithTimestamps = Omit<FlowGraph, 'edges'> & {
    edges: FlowGraphEdgeWithTimestamp[];
    returnSourceNodeIds?: string[];
};

const NODE_WIDTH = 230;
const NODE_HEIGHT = 76;
const HORIZONTAL_GAP = 280;
const VERTICAL_GAP = 52;

function getOutEdges(graph: FlowGraph): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const n of graph.nodes) {
        out[n.id] = [];
    }
    for (const e of graph.edges) {
        out[e.from] = out[e.from] || [];
        out[e.from].push(e.to);
    }
    return out;
}

function orderNodeIds(graph: FlowGraph): string[] {
    const { nodes, edges } = graph;
    if (nodes.length === 0) return [];
    if (edges.length === 0) return nodes.map((n) => n.id);

    const inDegree: Record<string, number> = {};
    const outEdges: Record<string, string[]> = {};
    for (const n of nodes) {
        inDegree[n.id] = 0;
        outEdges[n.id] = [];
    }
    for (const e of edges) {
        outEdges[e.from] = outEdges[e.from] || [];
        outEdges[e.from].push(e.to);
        inDegree[e.to] = (inDegree[e.to] ?? 0) + 1;
    }
    const roots = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);
    const order: string[] = [];
    const visited = new Set<string>();
    const queue = roots.length > 0 ? [...roots] : [nodes[0].id];
    while (queue.length > 0) {
        const id = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        order.push(id);
        for (const to of outEdges[id] || []) {
            if (!visited.has(to)) queue.push(to);
        }
    }
    for (const n of nodes) {
        if (!visited.has(n.id)) order.push(n.id);
    }
    return order;
}

function getTreeLayoutPositions(graph: FlowGraph): Map<string, { x: number; y: number }> {
    const { nodes, edges } = graph;
    const positions = new Map<string, { x: number; y: number }>();
    if (nodes.length === 0) return positions;

    const inDegree: Record<string, number> = {};
    const outEdges = getOutEdges(graph);
    for (const n of nodes) {
        inDegree[n.id] = 0;
    }
    for (const e of edges) {
        inDegree[e.to] = (inDegree[e.to] ?? 0) + 1;
    }
    const roots = nodes.filter((n) => inDegree[n.id] === 0).map((n) => n.id);

    const levelToIds = new Map<number, string[]>();
    const visited = new Set<string>();
    const queue: { id: string; level: number }[] = roots.map((id) => ({ id, level: 0 }));
    while (queue.length > 0) {
        const { id, level } = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        if (!levelToIds.has(level)) levelToIds.set(level, []);
        levelToIds.get(level)!.push(id);
        const children = outEdges[id] ?? [];
        for (const to of children) {
            if (!visited.has(to)) queue.push({ id: to, level: level + 1 });
        }
    }
    for (const n of nodes) {
        if (!visited.has(n.id)) {
            const maxLevel = levelToIds.size > 0 ? Math.max(...levelToIds.keys()) + 1 : 0;
            if (!levelToIds.has(maxLevel)) levelToIds.set(maxLevel, []);
            levelToIds.get(maxLevel)!.push(n.id);
        }
    }

    const nodeToLevel = new Map<string, number>();
    for (const [level, ids] of levelToIds) {
        for (const id of ids) nodeToLevel.set(id, level);
    }

    const inSources = new Map<string, string[]>();
    for (const e of edges) {
        const fromLevel = nodeToLevel.get(e.from) ?? 0;
        const toLevel = nodeToLevel.get(e.to) ?? 0;
        if (toLevel === fromLevel + 1) {
            const list = inSources.get(e.to) ?? [];
            list.push(e.from);
            inSources.set(e.to, list);
        }
    }

    const levels = Array.from(levelToIds.keys()).sort((a, b) => a - b);
    for (const level of levels) {
        const ids = levelToIds.get(level)!;
        let orderedIds: string[];
        if (level === 0) {
            orderedIds = [...ids];
        } else {
            const prevLevel = level - 1;
            orderedIds = [...ids].sort((a, b) => {
                const predY = (id: string) => {
                    const sources = inSources.get(id) ?? [];
                    if (sources.length === 0) return 0;
                    const ys = sources.map((s) => positions.get(s)?.y ?? 0);
                    return ys.reduce((s, y) => s + y, 0) / ys.length;
                };
                return predY(a) - predY(b);
            });
        }
        for (let i = 0; i < orderedIds.length; i++) {
            const id = orderedIds[i];
            const x = level * (NODE_WIDTH + HORIZONTAL_GAP);
            const y = i * (NODE_HEIGHT + VERTICAL_GAP);
            positions.set(id, { x, y });
        }
    }

    let prevCenterY: number | null = null;
    for (const level of levels) {
        const ids = levelToIds.get(level)!;
        const ys = ids.map((id) => positions.get(id)!.y);
        const centerY = ys.length ? (Math.min(...ys) + Math.max(...ys)) / 2 : 0;
        if (prevCenterY !== null && ids.length > 0) {
            const delta = prevCenterY - centerY;
            for (const id of ids) {
                const pos = positions.get(id)!;
                positions.set(id, { ...pos, y: pos.y + delta });
            }
        } else if (ids.length > 0) {
            prevCenterY = centerY;
        }
    }

    const level0Ids = levelToIds.get(0);
    if (level0Ids?.length === 1 && levelToIds.has(1)) {
        const level1Ids = levelToIds.get(1)!;
        const level1Ys = level1Ids.map((id) => positions.get(id)!.y);
        const minY = Math.min(...level1Ys);
        const maxY = Math.max(...level1Ys);
        const centerY = (minY + maxY) / 2;
        const rootId = level0Ids[0];
        const rootPos = positions.get(rootId)!;
        positions.set(rootId, { ...rootPos, y: centerY });
    }

    return positions;
}

function formatEdgeTimestamp(iso: string): string {
    try {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        return `${day}/${m}/${y} ${h}:${min}:${s}`;
    } catch {
        return iso;
    }
}

function capitalizeFirst(str: string): string {
    if (!str?.length) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function flowGraphToReactFlow(
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

    const positionMap = getTreeLayoutPositions(graph);
    const outEdgesBySource = getOutEdges(graph);
    const returnSourceIds = new Set((graph as FlowGraphWithTimestamps).returnSourceNodeIds ?? []);
    const nodes: Node[] = order.map((id, i) => {
        const n = nodeMap.get(id);
        const label = n?.label ?? id;
        const isSeedNode = seedNodeIds.has(id);
        let title: string | undefined;
        if (n?.title) {
            title = n.title;
        } else if (isSeedNode && caseName) {
            title = `${capitalizeFirst(caseName)} Address`;
        }
        const pos = positionMap.get(id) ?? { x: i * (NODE_WIDTH + HORIZONTAL_GAP), y: 0 };
        const connectedIds = outEdgesBySource[id] ?? [];
        const connectedCount = connectedIds.length;
        return {
            id,
            type: 'flowTrackNode',
            position: pos,
            data: {
                label,
                fullAddress: id,
                title,
                hasOutgoing: connectedCount > 0,
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

    const edgesFromSource = new Map<string, { flowIndex: number; edgeIndex: number }[]>();
    graph.edges.forEach((e, i) => {
        const withTs = e as FlowGraphEdgeWithTimestamp;
        const flowIdx = withTs.flowIndex ?? i;
        const list = edgesFromSource.get(e.from) ?? [];
        list.push({ flowIndex: flowIdx, edgeIndex: i });
        edgesFromSource.set(e.from, list);
    });
    for (const list of edgesFromSource.values()) {
        list.sort((a, b) => a.flowIndex - b.flowIndex);
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
        const fromLabel = nodeMap.get(e.from)?.label ?? e.from;
        const toLabel = nodeMap.get(e.to)?.label ?? e.to;
        const flowIdx = withTs.flowIndex ?? i;
        const stepInFlow = (flowPositionCounter.get(flowIdx) ?? 0) + 1;
        flowPositionCounter.set(flowIdx, stepInFlow);
        const flowColor = FLOW_COLORS[flowIdx % FLOW_COLORS.length];
        const sourceHandle = sourceHandleByEdgeIndex.get(i);
        const edgeChainIcon = (withTs as { chainIconUrl?: string }).chainIconUrl;
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
                exchangeName: endpointExchangeName ?? 'Binance',
                flowIndex: flowIdx,
                stepInFlow,
                flowColor,
                ...(edgeChainIcon ? { chainIconUrl: edgeChainIcon } : {}),
            },
        };
    });

    return { nodes, edges };
}

const NODE_TYPES = { flowTrackNode: FlowTrackNodeMemo };

function FitViewOnce() {
    const { fitView } = useReactFlow();
    useEffect(() => {
        fitView({ padding: 0.2 });
    }, [fitView]);
    return null;
}

type FlowGraphViewProps = {
    graph: FlowGraph | FlowGraphWithTimestamps;
    className?: string;
    readOnly?: boolean;
    caseName?: string | null;
    endpointExchangeName?: string | null;
    endpointHotWalletLabel?: string | null;
};

const FlowGraphReadOnly = memo(function FlowGraphReadOnly({
    graph,
    className,
    caseName,
    endpointExchangeName,
    endpointHotWalletLabel,
}: FlowGraphViewProps) {
    const dataRef = useRef(flowGraphToReactFlow(graph, caseName, endpointExchangeName, endpointHotWalletLabel));
    const { nodes, edges } = dataRef.current;
    return (
        <div
            className={`flow-track-graph ${className ?? 'rounded-xl'}`}
            style={{
                backgroundColor: '#303135',
                width: '100%',
                height: '100%',
                minHeight: 480,
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                minZoom={0.2}
                maxZoom={1.5}
                defaultEdgeOptions={{ type: 'flowTrackBezier' }}
                nodeTypes={NODE_TYPES}
                edgeTypes={{ flowTrackBezier: FlowTrackBezierEdgeMemo }}
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
                <Controls showInteractive={false} position="bottom-right" className="flow-track-controls" />
            </ReactFlow>
        </div>
    );
});

function FlowGraphViewInteractive({ graph, className, caseName, endpointExchangeName, endpointHotWalletLabel }: FlowGraphViewProps) {
    const { nodes: initialNodes, edges: initialEdges } = useMemo(
        () => flowGraphToReactFlow(graph, caseName, endpointExchangeName, endpointHotWalletLabel),
        [graph, caseName, endpointExchangeName, endpointHotWalletLabel],
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [editNameTagNode, setEditNameTagNode] = useState<Node | null>(null);

    const handleOpenEditNameTag = useCallback(
        (nodeId: string) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) setEditNameTagNode(node);
        },
        [nodes],
    );

    const editContextValue = useMemo(
        () => ({ openEditNameTag: handleOpenEditNameTag }),
        [handleOpenEditNameTag],
    );

    const onNodesChangeHandler: OnNodesChange = useCallback(
        (changes) => {
            onNodesChange(changes);
        },
        [onNodesChange],
    );
    const onEdgesChangeHandler: OnEdgesChange = useCallback(
        (changes) => {
            onEdgesChange(changes);
        },
        [onEdgesChange],
    );

    const onNodeClick = useCallback((evt: React.MouseEvent, node: Node) => {
        const target = evt.target as HTMLElement;
        if (target.closest('button') || target.closest('.react-flow__handle')) return;
        setSelectedEdge(null);
        setSelectedNode(node);
    }, []);

    const onEdgeClick = useCallback((_evt: React.MouseEvent, edge: Edge) => {
        setSelectedNode(null);
        setSelectedEdge(edge);
    }, []);

    const nodesWithSelection = useMemo(() => {
        if (!selectedEdge) {
            return nodes.map((n) => ({ ...n, selected: false }));
        }
        return nodes.map((n) => ({
            ...n,
            selected: n.id === selectedEdge.source || n.id === selectedEdge.target,
        }));
    }, [nodes, selectedEdge]);

    const edgesWithSelection = useMemo(() => {
        if (!selectedEdge) {
            return edges.map((e) => ({ ...e, selected: false }));
        }
        return edges.map((e) => ({
            ...e,
            selected: e.id === selectedEdge.id,
        }));
    }, [edges, selectedEdge]);

    return (
        <FlowGraphEditContext.Provider value={editContextValue}>
        <div className={`relative h-full w-full ${className ?? ''}`}>
            <div
                className="flow-track-graph absolute inset-0 rounded-xl"
                style={{
                    backgroundColor: '#303135',
                    minHeight: 480,
                }}
            >
                <ReactFlow
                    nodes={nodesWithSelection}
                    edges={edgesWithSelection}
                    onNodesChange={onNodesChangeHandler}
                    onEdgesChange={onEdgesChangeHandler}
                    onNodeClick={onNodeClick}
                    onEdgeClick={onEdgeClick}
                    minZoom={0.2}
                    maxZoom={1.5}
                    defaultEdgeOptions={{ type: 'flowTrackBezier' }}
                    nodeTypes={NODE_TYPES}
                    edgeTypes={{ flowTrackBezier: FlowTrackBezierEdgeMemo }}
                    proOptions={{ hideAttribution: true }}
                >
                    <FitViewOnce />
                    <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
                    <Controls showInteractive={false} position="bottom-right" className="flow-track-controls" />
                </ReactFlow>
            </div>
            {selectedNode && (
                <div className="absolute left-3 top-3 bottom-3 z-20">
                    <FlowNodeDetailModal
                        node={selectedNode}
                        onClose={() => setSelectedNode(null)}
                        onEditNameTag={() => setEditNameTagNode(selectedNode)}
                        className="h-full"
                    />
                </div>
            )}
            <EditNameTagModal
                open={!!editNameTagNode}
                onClose={() => setEditNameTagNode(null)}
                chain="BSC"
                address={editNameTagNode?.id ?? ''}
                currentNameTag={editNameTagNode ? ((editNameTagNode.data?.title as string) ?? '') : ''}
                placeholder="Binance: Deposit Address"
                onConfirm={(newNameTag) => {
                    if (!editNameTagNode) return;
                    const nodeId = editNameTagNode.id;
                    setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, title: newNameTag } } : n)));
                    setSelectedNode((prev) => (prev?.id === nodeId && prev ? { ...prev, data: { ...prev.data, title: newNameTag } } : prev));
                    setEditNameTagNode(null);
                }}
            />
            {selectedEdge && <FlowEdgeDetailModal edge={selectedEdge} onClose={() => setSelectedEdge(null)} />}
        </div>
        </FlowGraphEditContext.Provider>
    );
}

export function FlowGraphView(props: FlowGraphViewProps) {
    if (props.readOnly) {
        return (
            <FlowGraphReadOnly
                graph={props.graph}
                className={props.className}
                caseName={props.caseName}
                endpointExchangeName={props.endpointExchangeName}
                endpointHotWalletLabel={props.endpointHotWalletLabel}
            />
        );
    }
    return (
        <FlowGraphViewInteractive
            graph={props.graph}
            className={props.className}
            caseName={props.caseName}
            endpointExchangeName={props.endpointExchangeName}
            endpointHotWalletLabel={props.endpointHotWalletLabel}
        />
    );
}
