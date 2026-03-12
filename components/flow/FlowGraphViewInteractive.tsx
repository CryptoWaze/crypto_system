'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactFlow, Background, Controls, Panel, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import type { FlowGraph } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps, SoftDeleteTransactionItem } from '@/lib/utils/flow-track-graph';
import type { EditCaseWalletPayload } from '@/lib/services/cases/edit-case.service';
import { FlowGraphEditContext } from './FlowGraphEditContext';
import { flowGraphToReactFlow } from './utils/flowGraphToReactFlow';
import { FlowTrackNode } from './FlowTrackNode';
import { FlowTrackBezierEdge, type EdgeLineStyle } from './FlowTrackBezierEdge';
import { FitViewOnce } from './FitViewOnce';
import { FlowNodeDetailModal } from './FlowNodeDetailModal';
import { FlowEdgeDetailModal } from './FlowEdgeDetailModal';
import { EditNameTagModal } from './EditNameTagModal';
import { ConfirmDeleteNodeModal } from './ConfirmDeleteNodeModal';
import { ChevronDown } from 'lucide-react';

const NODE_TYPES = { flowTrackNode: FlowTrackNode };
const EDGE_TYPES = { flowTrackBezier: FlowTrackBezierEdge };
const defaultEdgeOptions = { type: 'flowTrackBezier' };

export type FlowGraphViewInteractiveProps = {
    graph: FlowGraph | FlowGraphWithTimestamps;
    className?: string;
    caseName?: string | null;
    endpointExchangeName?: string | null;
    endpointHotWalletLabel?: string | null;
    caseId?: string | null;
    onEditWallets?: (wallets: EditCaseWalletPayload[]) => Promise<void>;
    onSoftDeleteTransactions?: (items: SoftDeleteTransactionItem[]) => Promise<void>;
};

export function FlowGraphViewInteractive({
    graph,
    className,
    caseName,
    endpointExchangeName,
    endpointHotWalletLabel,
    onEditWallets,
    onSoftDeleteTransactions,
}: FlowGraphViewInteractiveProps) {
    const walletIdsByNodeId = (graph as FlowGraphWithTimestamps).walletIdsByNodeId;
    const softDeleteItemsByNodeId = (graph as FlowGraphWithTimestamps).softDeleteItemsByNodeId;
    const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
        const { nodes, edges } = flowGraphToReactFlow(graph, caseName, endpointExchangeName, endpointHotWalletLabel);
        return { nodes, edges };
    }, [graph, caseName, endpointExchangeName, endpointHotWalletLabel]);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [editNameTagNode, setEditNameTagNode] = useState<Node | null>(null);
    const [deleteNodeId, setDeleteNodeId] = useState<string | null>(null);
    const [edgeStyle, setEdgeStyle] = useState<EdgeLineStyle>('bezier');
    const [edgeStyleDropdownOpen, setEdgeStyleDropdownOpen] = useState(false);
    const edgeStylePanelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!edgeStyleDropdownOpen) return;
        const handleClickOutside = (evt: MouseEvent) => {
            const target = evt.target;
            if (edgeStylePanelRef.current && target instanceof Node && !edgeStylePanelRef.current.contains(target)) {
                setEdgeStyleDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [edgeStyleDropdownOpen]);

    useEffect(() => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    }, [initialNodes, initialEdges, setNodes, setEdges]);

    const handleOpenEditNameTag = useCallback(
        (nodeId: string) => {
            const node = nodes.find((n) => n.id === nodeId);
            if (node) setEditNameTagNode(node);
        },
        [nodes],
    );

    const handleOpenDeleteNode = useCallback(
        (nodeId: string) => {
            const items = softDeleteItemsByNodeId?.[nodeId];
            if (!items?.length) return;
            setDeleteNodeId(nodeId);
        },
        [softDeleteItemsByNodeId],
    );

    const editContextValue = useMemo(
        () => ({ openEditNameTag: handleOpenEditNameTag, openDeleteNode: handleOpenDeleteNode }),
        [handleOpenEditNameTag, handleOpenDeleteNode],
    );

    const onNodesChangeHandler: OnNodesChange = useCallback(
        (changes) => {
            onNodesChange(changes);
        },
        [onNodesChange],
    );

    const onNodeDragStop = useCallback(
        (_evt: React.MouseEvent, draggedNode: Node) => {
            if (!onEditWallets || !walletIdsByNodeId) return;
            const ids = walletIdsByNodeId[draggedNode.id];
            if (!ids?.length || !draggedNode.position || typeof draggedNode.position.x !== 'number' || typeof draggedNode.position.y !== 'number')
                return;
            const pos = { x: draggedNode.position.x, y: draggedNode.position.y };
            onEditWallets([{ walletId: ids[0], position: pos }]);
        },
        [onEditWallets, walletIdsByNodeId],
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
        if (!selectedEdge) return nodes;
        const sourceId = selectedEdge.source;
        const targetId = selectedEdge.target;
        return nodes.map((n) => (n.id === sourceId || n.id === targetId ? { ...n, selected: true } : { ...n, selected: false }));
    }, [nodes, selectedEdge]);

    const edgesWithStyle = useMemo(() => edges.map((e) => ({ ...e, data: { ...e.data, edgeStyle } })), [edges, edgeStyle]);

    const edgesWithSelection = useMemo(() => {
        if (!selectedEdge) return edgesWithStyle;
        const edgeId = selectedEdge.id;
        return edgesWithStyle.map((e) => (e.id === edgeId ? { ...e, selected: true } : { ...e, selected: false }));
    }, [edgesWithStyle, selectedEdge]);

    const edgeStyleOptions: { value: EdgeLineStyle; label: string }[] = [
        { value: 'bezier', label: 'Curva' },
        { value: 'straight', label: 'Reta' },
        { value: 'smoothstep', label: 'Degrau suave' },
        { value: 'step', label: 'Degrau' },
    ];

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
                        onNodeDragStop={onNodeDragStop}
                        onNodeClick={onNodeClick}
                        onEdgeClick={onEdgeClick}
                        minZoom={0.2}
                        maxZoom={1.5}
                        selectionOnDrag={false}
                        defaultEdgeOptions={defaultEdgeOptions}
                        nodeTypes={NODE_TYPES}
                        edgeTypes={EDGE_TYPES}
                        proOptions={{ hideAttribution: true }}
                    >
                        <FitViewOnce />
                        <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
                        <Controls showInteractive={false} position="bottom-right" className="flow-track-controls" />
                        <Panel position="top-right" className="flow-track-edge-style-panel">
                            <div ref={edgeStylePanelRef} className="relative">
                                <button
                                    type="button"
                                    onClick={() => setEdgeStyleDropdownOpen((o) => !o)}
                                    className="flex cursor-pointer items-center gap-3 rounded-[6px] border border-white/6 bg-[#25262a] px-3 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.35)] transition-all duration-200 hover:border-white/10 hover:bg-[#2d2e33]"
                                    style={{ minWidth: 140 }}
                                >
                                    <span className="flex-1 text-left text-sm font-semibold text-white">
                                        {edgeStyleOptions.find((o) => o.value === edgeStyle)?.label ?? 'Curva'}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className="shrink-0 text-gray-400 transition-transform duration-200"
                                        style={{ transform: edgeStyleDropdownOpen ? 'rotate(180deg)' : 'none' }}
                                    />
                                </button>
                                {edgeStyleDropdownOpen && (
                                    <div className="absolute right-0 top-full z-50 mt-2 flex flex-col overflow-hidden rounded-[6px] border border-white/6 bg-[#25262a] shadow-[0_8px_24px_rgba(0,0,0,0.45)]">
                                        {edgeStyleOptions.map((opt, index) => (
                                            <button
                                                key={opt.value}
                                                type="button"
                                                onClick={() => {
                                                    setEdgeStyle(opt.value);
                                                    setEdgeStyleDropdownOpen(false);
                                                }}
                                                className={`flex items-center cursor-pointer gap-2.5 px-3 py-2.5 text-left text-sm transition-colors hover:bg-white/6 ${index === 0 ? 'rounded-t-[6px]' : ''} ${index === edgeStyleOptions.length - 1 ? 'rounded-b-[6px]' : ''}`}
                                                style={{
                                                    backgroundColor: edgeStyle === opt.value ? 'rgba(91,141,239,0.18)' : 'transparent',
                                                    color: edgeStyle === opt.value ? '#a5c0fa' : '#d1d5db',
                                                }}
                                            >
                                                <span className="flex h-1.5 w-1.5 shrink-0 items-center justify-center rounded-full">
                                                    {edgeStyle === opt.value ? <span className="h-1.5 w-1.5 rounded-full bg-[#8babf5]" /> : null}
                                                </span>
                                                <span className={edgeStyle === opt.value ? 'font-medium' : ''}>{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Panel>
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
                    currentNameTag={
                        editNameTagNode
                            ? (() => {
                                  const t = editNameTagNode.data?.title as string | undefined;
                                  const id = editNameTagNode.id;
                                  return t && t !== id ? t : '';
                              })()
                            : ''
                    }
                    placeholder="Binance: Deposit Address"
                    onConfirm={async (newNameTag) => {
                        if (!editNameTagNode) return;
                        const nodeId = editNameTagNode.id;
                        if (onEditWallets && walletIdsByNodeId?.[nodeId]?.length) {
                            const wallets: EditCaseWalletPayload[] = walletIdsByNodeId[nodeId].map((walletId) => ({
                                walletId,
                                nickname: newNameTag.trim() || null,
                            }));
                            await onEditWallets(wallets);
                        }
                        setNodes((prev) => prev.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, title: newNameTag, label: nodeId } } : n)));
                        setSelectedNode((prev) =>
                            prev?.id === nodeId && prev ? { ...prev, data: { ...prev.data, title: newNameTag, label: nodeId } } : prev,
                        );
                        setEditNameTagNode(null);
                    }}
                />
                {selectedEdge && <FlowEdgeDetailModal edge={selectedEdge} onClose={() => setSelectedEdge(null)} />}
                <ConfirmDeleteNodeModal
                    open={!!deleteNodeId}
                    onClose={() => setDeleteNodeId(null)}
                    nodeLabel={deleteNodeId ? (nodes.find((n) => n.id === deleteNodeId)?.data?.title as string) || deleteNodeId : ''}
                    onConfirm={async () => {
                        if (!deleteNodeId || !onSoftDeleteTransactions) return;
                        const items = softDeleteItemsByNodeId?.[deleteNodeId];
                        if (!items?.length) return;
                        const seen = new Set<string>();
                        const unique = items.filter((x) => {
                            const k = `${x.flowId}|${x.transactionId}`;
                            if (seen.has(k)) return false;
                            seen.add(k);
                            return true;
                        });
                        await onSoftDeleteTransactions(unique);
                        setSelectedNode((prev) => (prev?.id === deleteNodeId ? null : prev));
                        setDeleteNodeId(null);
                    }}
                />
            </div>
        </FlowGraphEditContext.Provider>
    );
}
