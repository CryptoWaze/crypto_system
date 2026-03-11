import type { FlowGraph } from '@/lib/types/tracking';
import { NODE_WIDTH, NODE_HEIGHT, HORIZONTAL_GAP, VERTICAL_GAP } from '../constants';

export function getOutEdges(graph: FlowGraph): Record<string, string[]> {
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

export function orderNodeIds(graph: FlowGraph): string[] {
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

export function getTreeLayoutPositions(graph: FlowGraph): Map<string, { x: number; y: number }> {
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

export function getInEdges(graph: FlowGraph): Record<string, string[]> {
    const inEdges: Record<string, string[]> = {};
    for (const n of graph.nodes) {
        inEdges[n.id] = [];
    }
    for (const e of graph.edges) {
        inEdges[e.to] = inEdges[e.to] || [];
        inEdges[e.to].push(e.from);
    }
    return inEdges;
}

export function enforceFlowDirection(
    positionMap: Map<string, { x: number; y: number }>,
    graph: FlowGraph,
): Map<string, { x: number; y: number }> {
    const order = orderNodeIds(graph);
    const inEdges = getInEdges(graph);
    const result = new Map(positionMap);
    const gap = NODE_WIDTH + HORIZONTAL_GAP;

    for (const nodeId of order) {
        const predecessors = inEdges[nodeId] ?? [];
        let minX: number;
        if (predecessors.length === 0) {
            minX = 0;
        } else {
            minX = Math.max(
                ...predecessors.map((from) => (result.get(from)?.x ?? 0) + gap),
            );
        }
        const current = result.get(nodeId) ?? { x: 0, y: 0 };
        const newX = Math.max(current.x, minX);
        result.set(nodeId, { ...current, x: newX });
    }

    return result;
}
