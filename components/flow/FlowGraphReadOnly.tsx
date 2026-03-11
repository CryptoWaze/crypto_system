'use client';

import { useRef, memo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowGraph } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps } from '@/lib/utils/flow-track-graph';
import { flowGraphToReactFlow } from './utils/flowGraphToReactFlow';
import { FlowTrackNode } from './FlowTrackNode';
import { FlowTrackBezierEdge } from './FlowTrackBezierEdge';

const NODE_TYPES = { flowTrackNode: FlowTrackNode };
const EDGE_TYPES = { flowTrackBezier: FlowTrackBezierEdge };

export type FlowGraphReadOnlyProps = {
    graph: FlowGraph | FlowGraphWithTimestamps;
    className?: string;
    caseName?: string | null;
    endpointExchangeName?: string | null;
    endpointHotWalletLabel?: string | null;
};

const FlowGraphReadOnlyComponent = memo(function FlowGraphReadOnlyComponent({
    graph,
    className,
    caseName,
    endpointExchangeName,
    endpointHotWalletLabel,
}: FlowGraphReadOnlyProps) {
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
                edgeTypes={EDGE_TYPES}
                proOptions={{ hideAttribution: true }}
            >
                <Background gap={16} size={1} color="rgba(255,255,255,0.06)" />
                <Controls showInteractive={false} position="bottom-right" className="flow-track-controls" />
            </ReactFlow>
        </div>
    );
});

export { FlowGraphReadOnlyComponent as FlowGraphReadOnly };
