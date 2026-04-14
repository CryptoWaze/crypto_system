'use client';

import { useRef, memo } from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { FlowGraph } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps } from '@/lib/utils/flow-track-graph';
import { flowGraphToReactFlow } from './utils/flowGraphToReactFlow';
import { FlowTrackNode } from './FlowTrackNode';
import { FlowTrackBezierEdge } from './FlowTrackBezierEdge';
import { FitViewOnce } from './FitViewOnce';

const NODE_TYPES = { flowTrackNode: FlowTrackNode };
const EDGE_TYPES = { flowTrackBezier: FlowTrackBezierEdge };

export type FlowGraphReadOnlyProps = {
    graph: FlowGraph | FlowGraphWithTimestamps;
    className?: string;
    caseName?: string | null;
    endpointExchangeName?: string | null;
    endpointHotWalletLabel?: string | null;
    fitViewOnMount?: boolean;
    fillContainer?: boolean;
    preventScrolling?: boolean;
    zoomOnScroll?: boolean;
};

const FlowGraphReadOnlyComponent = memo(function FlowGraphReadOnlyComponent({
    graph,
    className,
    caseName,
    endpointExchangeName,
    endpointHotWalletLabel,
    fitViewOnMount = false,
    fillContainer = false,
    preventScrolling = true,
    zoomOnScroll = true,
}: FlowGraphReadOnlyProps) {
    const dataRef = useRef(flowGraphToReactFlow(graph, caseName, endpointExchangeName, endpointHotWalletLabel));
    const { nodes, edges } = dataRef.current;
    return (
        <div
            className={`flow-track-graph ${className ?? 'rounded-xl'}`}
            style={{
                background:
                    'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(74,126,217,0.14), transparent 58%), radial-gradient(ellipse 70% 55% at 80% 90%, rgba(99,102,241,0.1), transparent 62%), linear-gradient(180deg, rgba(10,12,18,0.96), rgba(8,9,14,0.98))',
                width: '100%',
                height: '100%',
                minHeight: fillContainer ? 0 : 480,
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
                zoomOnScroll={zoomOnScroll}
                preventScrolling={preventScrolling}
                defaultEdgeOptions={{ type: 'flowTrackBezier' }}
                nodeTypes={NODE_TYPES}
                edgeTypes={EDGE_TYPES}
                proOptions={{ hideAttribution: true }}
            >
                {fitViewOnMount ? <FitViewOnce /> : null}
                <Background gap={16} size={1} color="rgba(74,126,217,0.14)" />
                <Controls showInteractive={false} position="bottom-right" className="flow-track-controls" />
            </ReactFlow>
        </div>
    );
});

export { FlowGraphReadOnlyComponent as FlowGraphReadOnly };
