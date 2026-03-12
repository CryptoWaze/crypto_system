'use client';

import { useContext, useState, memo, useMemo, type CSSProperties } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Pencil, Trash2 } from 'lucide-react';
import { FlowGraphEditContext } from './FlowGraphEditContext';
import { ChainIcon, BinanceLogoIcon } from './FlowIcons';

const INVISIBLE_HANDLE_STYLE = {
    background: 'transparent',
    border: 'none',
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: 10,
};

function FlowTrackNodeComponent({ id, data, sourcePosition, targetPosition, dragging, selected }: NodeProps) {
    const [hovered, setHovered] = useState(false);
    const editContext = useContext(FlowGraphEditContext);
    const label = (data?.label as string) ?? '';
    const title = data?.title as string | undefined;
    const endpointExchangeIconUrl = data?.endpointExchangeIconUrl as string | undefined;
    const chainIconUrl = data?.chainIconUrl as string | undefined;
    const iconUrl = endpointExchangeIconUrl ?? chainIconUrl;
    const hasOutgoing = data?.hasOutgoing === true;
    const hasIncoming = data?.hasIncoming === true;
    const connectedCount = Math.max(1, (data?.connectedCount as number) ?? 1);
    const showHighlight = hovered || dragging || selected;
    const hasTitleLayout = Boolean(title);
    const showActions = hovered && !(data?.isSeedNode === true);

    const nodeContentStyle = useMemo(
        (): CSSProperties => ({
            padding: hasTitleLayout ? (showActions ? '8px 12px 28px' : '8px 12px') : showActions ? '10px 14px 28px' : '10px 14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: hasTitleLayout ? 'flex-start' : 'center',
            wordBreak: 'break-all',
            textAlign: hasTitleLayout ? 'left' : 'center',
        }),
        [hasTitleLayout, showActions],
    );

    const wrapperStyle = useMemo((): CSSProperties => ({ position: 'relative', zIndex: showHighlight ? 10 : 0 }), [showHighlight]);

    const NodeIcon = iconUrl ? <ChainIcon src={iconUrl} size={20} /> : <BinanceLogoIcon size={20} />;

    return (
        <div className="relative inline-block" style={wrapperStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <div
                className={`flow-track-node rounded-xl font-mono text-xs relative inline-flex ${showHighlight ? 'flow-track-node--highlight' : ''}`}
                style={nodeContentStyle}
            >
                {hasIncoming && (
                    <Handle
                        type="target"
                        position={targetPosition ?? Position.Left}
                        className="flow-track-handle-target"
                        style={{
                            ...INVISIBLE_HANDLE_STYLE,
                            right: 'auto',
                            left: 3,
                            top: '50%',
                            transform: 'translateY(-50%)',
                        }}
                    />
                )}
                {hasTitleLayout ? (
                    <div className="flex items-center gap-2 min-w-0">
                        {NodeIcon}
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="font-sans font-bold text-xs text-white whitespace-nowrap truncate">{title}</span>
                            <span className="font-mono leading-tight break-all" style={{ fontSize: 9, color: '#6B7280' }}>
                                {label}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 min-w-0">
                        {NodeIcon}
                        <span className="font-mono leading-tight break-all text-left" style={{ fontSize: 9, color: '#6B7280' }}>
                            {label}
                        </span>
                    </div>
                )}
                {showActions && (
                    <div className="absolute flex gap-1 items-center cursor-pointer" style={{ bottom: 6, right: 8 }}>
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
                            type="button"
                            className="flex items-center justify-center rounded-md p-1 transition-colors cursor-pointer hover:opacity-90 hover:scale-105"
                            style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171' }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                editContext?.openDeleteNode(id);
                            }}
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                )}
            </div>
            {hasOutgoing && (
                <Handle
                    id="source"
                    type="source"
                    position={sourcePosition ?? Position.Right}
                    style={{
                        ...INVISIBLE_HANDLE_STYLE,
                        top: '50%',
                        left: 'auto',
                        right: 0,
                        transform: 'translateY(-50%)',
                    }}
                />
            )}
        </div>
    );
}

export const FlowTrackNode = memo(FlowTrackNodeComponent);
