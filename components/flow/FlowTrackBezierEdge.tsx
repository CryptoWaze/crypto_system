'use client';

import { getBezierPath, getStraightPath, getSmoothStepPath, Position, type EdgeProps } from '@xyflow/react';
import { memo, useMemo } from 'react';
import { LABEL_WIDTH, LABEL_HEIGHT } from './constants';

export type EdgeLineStyle = 'bezier' | 'straight' | 'smoothstep' | 'step';

function FlowTrackBezierEdgeComponent({
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
    const lineStyle = (data?.edgeStyle as EdgeLineStyle) ?? 'bezier';
    const [path, labelX, labelY] = useMemo(() => {
        const srcPos = sourcePosition ?? Position.Right;
        const tgtPos = targetPosition ?? Position.Left;
        if (lineStyle === 'straight') {
            const [p, lx, ly] = getStraightPath({ sourceX, sourceY, targetX, targetY });
            return [p, lx, ly] as const;
        }
        if (lineStyle === 'step') {
            const [p, lx, ly] = getSmoothStepPath({
                sourceX,
                sourceY,
                targetX,
                targetY,
                sourcePosition: srcPos,
                targetPosition: tgtPos,
                borderRadius: 0,
            });
            return [p, lx, ly] as const;
        }
        if (lineStyle === 'smoothstep') {
            const [p, lx, ly] = getSmoothStepPath({
                sourceX,
                sourceY,
                targetX,
                targetY,
                sourcePosition: srcPos,
                targetPosition: tgtPos,
            });
            return [p, lx, ly] as const;
        }
        const [p, lx, ly] = getBezierPath({
            sourceX,
            sourceY,
            targetX,
            targetY,
            sourcePosition: srcPos,
            targetPosition: tgtPos,
        });
        return [p, lx, ly] as const;
    }, [sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, lineStyle]);
    const dateStr = (data?.dateStr as string) ?? '';
    const valueStr = (data?.valueStr as string) ?? '';
    const stepInFlow = (data?.stepInFlow as number) ?? 1;
    const indexLabel = Math.max(1, stepInFlow);
    const flowColor = (data?.flowColor as string) ?? 'rgba(160, 160, 160, 0.7)';

    const pathStyle = useMemo(
        () => (selected ? { ...style, stroke: flowColor, strokeWidth: 3, opacity: 1 } : { ...style, stroke: flowColor, strokeWidth: 2 }),
        [selected, flowColor, style],
    );

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

export const FlowTrackBezierEdge = memo(FlowTrackBezierEdgeComponent);
