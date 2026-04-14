'use client';

import { useMemo } from 'react';
import { FLOW_COLORS } from '@/components/flow/constants';

const VIEW = 1000;
const MARGIN = 102;

type LocalTemplate = {
    nodes: [number, number][];
    edges: [number, number][];
};

const TEMPLATES: LocalTemplate[] = [
    { nodes: [[0, 0], [92, 38]], edges: [[0, 1]] },
    { nodes: [[0, 35], [58, 0], [112, 42]], edges: [[0, 1], [1, 2]] },
    { nodes: [[48, 0], [0, 78], [96, 82]], edges: [[0, 1], [0, 2]] },
    { nodes: [[0, 0], [88, 0], [44, 72]], edges: [[0, 2], [1, 2]] },
    { nodes: [[0, 22], [74, 0]], edges: [[0, 1]] },
    { nodes: [[0, 0], [0, 58], [72, 28]], edges: [[0, 2], [1, 2]] },
    { nodes: [[34, 0]], edges: [] },
    { nodes: [[0, 48], [62, 0]], edges: [] },
    { nodes: [[0, 0], [52, -18], [104, 8], [56, 86]], edges: [[0, 1], [1, 2]] },
    { nodes: [[0, 55], [68, 0]], edges: [[0, 1]] },
    { nodes: [[0, 0], [45, 50]], edges: [[0, 1]] },
    { nodes: [[80, 0], [0, 60], [40, 100]], edges: [[0, 2], [1, 2]] },
    { nodes: [[0, 0], [70, 55]], edges: [] },
];

type WorldNode = {
    x: number;
    y: number;
    key: string;
    rot: number;
    variant: 0 | 1;
    label: string;
};

const CARD_W = 104;
const CARD_H = 36;
const CARD_RX = 7;

type WorldEdge = {
    fromKey: string;
    toKey: string;
    bend: number;
    key: string;
    flowIndex: number;
};

function R(v: number): number {
    return Math.round(v * 100) / 100;
}

function flowStrokeColor(flowIndex: number, alpha: number): string {
    const raw = FLOW_COLORS[flowIndex % FLOW_COLORS.length]!;
    const inner = raw.slice(raw.indexOf('(') + 1, raw.indexOf(')'));
    const parts = inner.split(',').map((p) => p.trim());
    if (parts.length >= 3) {
        const r = parts[0];
        const g = parts[1];
        const b = parts[2];
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    return raw;
}

function generateAddressLabel(i: number): string {
    let v = Math.imul(i + 1, 0x9e3779b9) >>> 0;
    let h = '';
    for (let k = 0; k < 12; k++) {
        v ^= v >>> 12;
        v = Math.imul(v, 0x85ebca6b) >>> 0;
        v ^= v >>> 13;
        v = Math.imul(v, 0xc2b2ae35) >>> 0;
        v ^= v >>> 16;
        h += (v & 15).toString(16);
    }
    return `0x${h.slice(0, 4)}…${h.slice(8, 10)}`;
}

type Zone = { x0: number; x1: number; y0: number; y1: number };

const CLUSTER_ZONES: Zone[] = [
    { x0: MARGIN, x1: 318, y0: MARGIN, y1: 308 },
    { x0: 682, x1: VIEW - MARGIN, y0: MARGIN, y1: 308 },
    { x0: MARGIN, x1: 318, y0: 692, y1: VIEW - MARGIN },
    { x0: 682, x1: VIEW - MARGIN, y0: 692, y1: VIEW - MARGIN },
    { x0: 352, x1: 648, y0: MARGIN, y1: 278 },
    { x0: 352, x1: 648, y0: 722, y1: VIEW - MARGIN },
    { x0: MARGIN, x1: 292, y0: 352, y1: 648 },
    { x0: 708, x1: VIEW - MARGIN, y0: 352, y1: 648 },
    { x0: 236, x1: 392, y0: 218, y1: 378 },
    { x0: 608, x1: 764, y0: 218, y1: 378 },
    { x0: 236, x1: 392, y0: 622, y1: 782 },
    { x0: 608, x1: 764, y0: 622, y1: 782 },
];

const ZONE_PAD = 52;
const ANCHOR_MIN_DIST = 178;
const NODE_MIN_SEP = 82;
const SEPARATION_ITERS = 16;

function pickClusterAnchor(c: number, rnd: () => number, placed: { bx: number; by: number }[]): { bx: number; by: number } {
    const zone = CLUSTER_ZONES[c]!;
    const w = zone.x1 - zone.x0 - 2 * ZONE_PAD;
    const h = zone.y1 - zone.y0 - 2 * ZONE_PAD;
    const innerW = Math.max(10, w);
    const innerH = Math.max(10, h);

    for (let attempt = 0; attempt < 48; attempt++) {
        const bx = R(zone.x0 + ZONE_PAD + rnd() * innerW);
        const by = R(zone.y0 + ZONE_PAD + rnd() * innerH);
        if (placed.every((p) => R(Math.hypot(p.bx - bx, p.by - by)) >= ANCHOR_MIN_DIST)) {
            const next = { bx, by };
            placed.push(next);
            return next;
        }
    }

    const bx = R((zone.x0 + zone.x1) / 2);
    const by = R((zone.y0 + zone.y1) / 2);
    const next = { bx, by };
    placed.push(next);
    return next;
}

function separateNodes(nodes: WorldNode[]): void {
    const minD = NODE_MIN_SEP;
    for (let it = 0; it < SEPARATION_ITERS; it++) {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i]!;
                const b = nodes[j]!;
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let d = R(Math.hypot(dx, dy));
                if (d < 0.02) {
                    dx = 1;
                    dy = 0;
                    d = 1;
                }
                if (d >= minD) continue;
                const push = R((minD - d) / 2 + 0.4);
                const ux = R(dx / d);
                const uy = R(dy / d);
                a.x = R(Math.min(VIEW - MARGIN, Math.max(MARGIN, a.x - ux * push)));
                a.y = R(Math.min(VIEW - MARGIN, Math.max(MARGIN, a.y - uy * push)));
                b.x = R(Math.min(VIEW - MARGIN, Math.max(MARGIN, b.x + ux * push)));
                b.y = R(Math.min(VIEW - MARGIN, Math.max(MARGIN, b.y + uy * push)));
            }
        }
    }
}

function buildGraph(): { nodes: WorldNode[]; edges: WorldEdge[] } {
    const nodes: WorldNode[] = [];
    const edges: WorldEdge[] = [];
    let seed = 41.927;
    let nodeKey = 0;
    let edgeKey = 0;

    const rnd = () => {
        seed += 13.271;
        const v = Math.sin(seed * 12.9898) * 43758.5453;
        return v - Math.floor(v);
    };

    const clusterCount = 12;
    const placedAnchors: { bx: number; by: number }[] = [];
    for (let c = 0; c < clusterCount; c++) {
        const t = TEMPLATES[Math.floor(rnd() * TEMPLATES.length)]!;
        const { bx, by } = pickClusterAnchor(c, rnd, placedAnchors);
        const scale = R(0.38 + rnd() * 0.58);
        const theta = R(rnd() * Math.PI * 2);
        const cos = R(Math.cos(theta));
        const sin = R(Math.sin(theta));
        const cx = t.nodes.reduce((s, n) => s + n[0], 0) / t.nodes.length;
        const cy = t.nodes.reduce((s, n) => s + n[1], 0) / t.nodes.length;
        const flowIndex = Math.floor(rnd() * FLOW_COLORS.length);
        const baseKey = nodeKey;

        const worldNodes: WorldNode[] = t.nodes.map(([lx, ly], ni) => {
            const ox = lx - cx;
            const oy = ly - cy;
            const rx = R((ox * cos - oy * sin) * scale);
            const ry = R((ox * sin + oy * cos) * scale);
            const id = baseKey + ni;
            return {
                x: R(Math.min(VIEW - MARGIN, Math.max(MARGIN, bx + rx))),
                y: R(Math.min(VIEW - MARGIN, Math.max(MARGIN, by + ry))),
                rot: R((rnd() - 0.5) * 10),
                variant: (rnd() > 0.45 ? 1 : 0) as 0 | 1,
                label: generateAddressLabel(id),
                key: `hn-${id}`,
            };
        });

        nodeKey += t.nodes.length;
        nodes.push(...worldNodes);

        for (const [a, b] of t.edges) {
            const na = worldNodes[a];
            const nb = worldNodes[b];
            if (!na || !nb) continue;
            const bend = R((rnd() - 0.5) * 138);
            edges.push({
                fromKey: na.key,
                toKey: nb.key,
                bend,
                key: `he-${edgeKey++}`,
                flowIndex,
            });
        }
    }

    separateNodes(nodes);
    return { nodes, edges };
}

function HeroMiniFlowNode({ n }: { n: WorldNode }) {
    const hw = R(CARD_W / 2);
    const hh = R(CARD_H / 2);
    return (
        <g transform={`translate(${n.x} ${n.y}) rotate(${n.rot})`}>
            <rect
                x={R(-hw)}
                y={R(-hh)}
                width={CARD_W}
                height={CARD_H}
                rx={CARD_RX}
                fill="#1a1a1d"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth={1.55}
                vectorEffect="non-scaling-stroke"
            />
            <circle cx={R(-32)} cy={0} r={8.25} fill="#4a7ed9" opacity={0.92} />
            {n.variant === 1 ? (
                <>
                    <rect x={R(-13)} y={R(-11)} width={58} height={5.25} rx={1.4} fill="rgba(255,255,255,0.9)" />
                    <text
                        x={R(-13)}
                        y={R(8.2)}
                        fill="#6b7280"
                        fillOpacity={0.92}
                        fontSize={6.15}
                        fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    >
                        {n.label}
                    </text>
                </>
            ) : (
                <text
                    x={R(-13)}
                    y={R(4.85)}
                    fill="#6b7280"
                    fillOpacity={0.92}
                    fontSize={6.35}
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                >
                    {n.label}
                </text>
            )}
        </g>
    );
}

function edgePath(x1: number, y1: number, x2: number, y2: number, bend: number): string {
    const mx = R((x1 + x2) / 2);
    const my = R((y1 + y2) / 2);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = R(Math.hypot(dx, dy)) || 1;
    const nx = R(-dy / len);
    const ny = R(dx / len);
    const cpx = R(mx + nx * bend);
    const cpy = R(my + ny * bend);
    return `M ${R(x1)} ${R(y1)} Q ${cpx} ${cpy} ${R(x2)} ${R(y2)}`;
}

export function HeroBackgroundGraphs() {
    const { nodes, edges } = useMemo(() => buildGraph(), []);
    const nodeByKey = useMemo(() => new Map(nodes.map((n) => [n.key, n])), [nodes]);

    return (
        <svg
            className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
        >
            <g fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" strokeWidth={1.55} opacity={0.22}>
                {edges.map((e) => {
                    const a = nodeByKey.get(e.fromKey);
                    const b = nodeByKey.get(e.toKey);
                    if (!a || !b) return null;
                    return (
                        <path
                            key={e.key}
                            d={edgePath(a.x, a.y, b.x, b.y, e.bend)}
                            stroke={flowStrokeColor(e.flowIndex, 0.88)}
                        />
                    );
                })}
            </g>
            <g opacity={0.2}>
                {nodes.map((n) => (
                    <HeroMiniFlowNode key={n.key} n={n} />
                ))}
            </g>
        </svg>
    );
}
