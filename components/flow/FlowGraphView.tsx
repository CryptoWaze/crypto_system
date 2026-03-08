'use client';

import { useCallback, useEffect, useMemo, useRef, memo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Position,
  getSmoothStepPath,
  type Node,
  type Edge,
  type OnNodesChange,
  type OnEdgesChange,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowGraph, FlowGraphEdge } from '@/lib/types/tracking';

const LABEL_WIDTH = 200;
const LABEL_HEIGHT = 52;

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

function FlowTrackSmoothStepEdge({
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
}: EdgeProps) {
  const [path, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition: sourcePosition ?? Position.Right,
    targetPosition: targetPosition ?? Position.Left,
  });
  const dateStr = (data?.dateStr as string) ?? '';
  const valueStr = (data?.valueStr as string) ?? '';

  return (
    <>
      <path
        id={id}
        d={path}
        fill="none"
        className="react-flow__edge-path"
        style={style}
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      <path
        d={path}
        fill="none"
        strokeOpacity={0}
        strokeWidth={20}
        className="react-flow__edge-interaction"
      />
      {valueStr && (
        <foreignObject
          x={labelX - LABEL_WIDTH / 2}
          y={labelY - LABEL_HEIGHT - 12}
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
            }}
          >
            {dateStr ? (
              <span style={{ fontSize: 10, color: 'rgba(91, 141, 239, 0.75)' }}>{dateStr}</span>
            ) : null}
            <span style={{ fontWeight: 500, color: '#8babf5' }}>{valueStr}</span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

const FlowTrackSmoothStepEdgeMemo = memo(FlowTrackSmoothStepEdge);

export type FlowGraphEdgeWithTimestamp = FlowGraphEdge & { timestamp?: string };
export type FlowGraphWithTimestamps = Omit<FlowGraph, 'edges'> & { edges: FlowGraphEdgeWithTimestamp[] };

const NODE_WIDTH = 308;
const NODE_HEIGHT = 80;
const HORIZONTAL_GAP = 380;
const VERTICAL_GAP = 80;

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

function formatEdgeTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const s = String(d.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
  } catch {
    return iso;
  }
}

function flowGraphToReactFlow(graph: FlowGraph | FlowGraphWithTimestamps): { nodes: Node[]; edges: Edge[] } {
  const order = orderNodeIds(graph);
  const nodeMap = new Map(graph.nodes.map((n) => [n.id, n]));
  const nodes: Node[] = order.map((id, i) => {
    const n = nodeMap.get(id);
    const label = n?.label ?? id;
    return {
      id,
      type: 'default',
      position: { x: i * (NODE_WIDTH + HORIZONTAL_GAP), y: 0 },
      data: {
        label,
        fullAddress: id,
      },
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      className: 'flow-track-node rounded-xl font-mono text-xs text-center',
      style: { padding: '12px 16px' },
    };
  });

  const edges: Edge[] = graph.edges.map((e, i) => {
    const withTs = e as FlowGraphEdgeWithTimestamp;
    const dateStr =
      withTs.timestamp != null ? formatEdgeTimestamp(withTs.timestamp) : '';
    const valueStr = `${formatEdgeAmount(e.amount)} ${e.symbol}`;
    return {
      id: `e-${e.from}-${e.to}-${i}`,
      source: e.from,
      target: e.to,
      type: 'flowTrackSmoothstep',
      data: {
        symbol: e.symbol,
        amount: e.amount,
        amountRaw: e.amountRaw,
        txHash: e.txHash,
        outcome: e.outcome,
        dateStr,
        valueStr,
      },
    };
  });

  return { nodes, edges };
}

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
};

const FlowGraphReadOnly = memo(function FlowGraphReadOnly({ graph, className }: FlowGraphViewProps) {
  const dataRef = useRef(flowGraphToReactFlow(graph));
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
        defaultEdgeOptions={{ type: 'flowTrackSmoothstep' }}
        edgeTypes={{ flowTrackSmoothstep: FlowTrackSmoothStepEdgeMemo }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
});

function FlowGraphViewInteractive({ graph, className }: FlowGraphViewProps) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => flowGraphToReactFlow(graph),
    [graph],
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChangeHandler}
        minZoom={0.2}
        maxZoom={1.5}
        defaultEdgeOptions={{ type: 'flowTrackSmoothstep' }}
        edgeTypes={{ flowTrackSmoothstep: FlowTrackSmoothStepEdgeMemo }}
        proOptions={{ hideAttribution: true }}
      >
        <FitViewOnce />
        <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}

export function FlowGraphView(props: FlowGraphViewProps) {
  if (props.readOnly) {
    return <FlowGraphReadOnly graph={props.graph} className={props.className} />;
  }
  return <FlowGraphViewInteractive graph={props.graph} className={props.className} />;
}
