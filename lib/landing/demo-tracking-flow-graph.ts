import type { FlowGraph } from '@/lib/types/tracking';

const COL = 590;
const ROW = 196;

function pos(col: number, rowIndex: number, rowCount: number): { x: number; y: number } {
    const mid = (rowCount - 1) / 2;
    return { x: col * COL, y: 360 + (rowIndex - mid) * ROW };
}

const TX = (i: number) => `0x${i.toString(16).padStart(64, '0')}`;

export const DEMO_TRACKING_FLOW_GRAPH: FlowGraph = {
    nodes: [
        {
            id: 'demo-s0',
            label: '0x7a3b…c21f',
            title: 'Origem 1',
            position: pos(0, 0, 2),
        },
        {
            id: 'demo-s1',
            label: '0x9f2e…8ab1',
            title: 'Origem 2',
            position: pos(0, 1, 2),
        },
        {
            id: 'demo-n0',
            label: '0x1d4c…9022',
            position: pos(1, 0, 4),
        },
        {
            id: 'demo-n1',
            label: '0x2e5d…a133',
            position: pos(1, 1, 4),
        },
        {
            id: 'demo-n2',
            label: '0x3f6e…b244',
            position: pos(1, 2, 4),
        },
        {
            id: 'demo-n3',
            label: '0x4a7f…c355',
            position: pos(1, 3, 4),
        },
        {
            id: 'demo-m0',
            label: '0x5b80…d466',
            position: pos(2, 0, 4),
        },
        {
            id: 'demo-m1',
            label: '0x6c91…e577',
            position: pos(2, 1, 4),
        },
        {
            id: 'demo-m2',
            label: '0x7da2…f688',
            position: pos(2, 2, 4),
        },
        {
            id: 'demo-m3',
            label: '0x8eb3…0799',
            position: pos(2, 3, 4),
        },
        {
            id: 'demo-p0',
            label: '0xa1c4…18aa',
            position: pos(3, 0, 8),
        },
        {
            id: 'demo-p1',
            label: '0xb2d5…29bb',
            position: pos(3, 1, 8),
        },
        {
            id: 'demo-p2',
            label: '0xc3e6…3acc',
            position: pos(3, 2, 8),
        },
        {
            id: 'demo-p3',
            label: '0xd4f7…4bdd',
            position: pos(3, 3, 8),
        },
        {
            id: 'demo-p4',
            label: '0xe508…5cee',
            position: pos(3, 4, 8),
        },
        {
            id: 'demo-p5',
            label: '0xf619…6dff',
            position: pos(3, 5, 8),
        },
        {
            id: 'demo-p6',
            label: '0x072a…7e00',
            position: pos(3, 6, 8),
        },
        {
            id: 'demo-p7',
            label: '0x183b…8f11',
            position: pos(3, 7, 8),
        },
        {
            id: 'demo-q0',
            label: '0x294c…9022',
            position: pos(4, 0, 3),
        },
        {
            id: 'demo-q1',
            label: '0x3a5d…a133',
            position: pos(4, 1, 3),
        },
        {
            id: 'demo-q2',
            label: '0x4b6e…b244',
            position: pos(4, 2, 3),
        },
        {
            id: 'demo-end',
            label: '0x5c7f…c355',
            title: 'Hot wallet (exchange)',
            endpointExchangeIconUrl: '/icon.svg',
            position: pos(5, 0, 1),
        },
    ],
    edges: [
        { from: 'demo-s0', to: 'demo-n0', symbol: 'USDT', amount: 120_000, amountRaw: '120000000000', txHash: TX(1) },
        { from: 'demo-s0', to: 'demo-n1', symbol: 'USDT', amount: 95_000, amountRaw: '95000000000', txHash: TX(2) },
        { from: 'demo-s1', to: 'demo-n2', symbol: 'USDT', amount: 88_000, amountRaw: '88000000000', txHash: TX(3) },
        { from: 'demo-s1', to: 'demo-n3', symbol: 'USDT', amount: 102_000, amountRaw: '102000000000', txHash: TX(4) },
        { from: 'demo-n0', to: 'demo-m0', symbol: 'USDT', amount: 120_000, amountRaw: '120000000000', txHash: TX(5) },
        { from: 'demo-n1', to: 'demo-m1', symbol: 'USDT', amount: 95_000, amountRaw: '95000000000', txHash: TX(6) },
        { from: 'demo-n2', to: 'demo-m2', symbol: 'USDT', amount: 88_000, amountRaw: '88000000000', txHash: TX(7) },
        { from: 'demo-n3', to: 'demo-m3', symbol: 'USDT', amount: 102_000, amountRaw: '102000000000', txHash: TX(8) },
        { from: 'demo-m0', to: 'demo-p0', symbol: 'USDT', amount: 62_000, amountRaw: '62000000000', txHash: TX(9) },
        { from: 'demo-m0', to: 'demo-p1', symbol: 'USDT', amount: 58_000, amountRaw: '58000000000', txHash: TX(10) },
        { from: 'demo-m1', to: 'demo-p2', symbol: 'USDT', amount: 48_000, amountRaw: '48000000000', txHash: TX(11) },
        { from: 'demo-m1', to: 'demo-p3', symbol: 'USDT', amount: 47_000, amountRaw: '47000000000', txHash: TX(12) },
        { from: 'demo-m2', to: 'demo-p4', symbol: 'USDT', amount: 44_000, amountRaw: '44000000000', txHash: TX(13) },
        { from: 'demo-m2', to: 'demo-p5', symbol: 'USDT', amount: 44_000, amountRaw: '44000000000', txHash: TX(14) },
        { from: 'demo-m3', to: 'demo-p6', symbol: 'USDT', amount: 51_000, amountRaw: '51000000000', txHash: TX(15) },
        { from: 'demo-m3', to: 'demo-p7', symbol: 'USDT', amount: 51_000, amountRaw: '51000000000', txHash: TX(16) },
        { from: 'demo-p0', to: 'demo-q0', symbol: 'USDT', amount: 62_000, amountRaw: '62000000000', txHash: TX(17) },
        { from: 'demo-p1', to: 'demo-q0', symbol: 'USDT', amount: 58_000, amountRaw: '58000000000', txHash: TX(18) },
        { from: 'demo-p2', to: 'demo-q0', symbol: 'USDT', amount: 48_000, amountRaw: '48000000000', txHash: TX(19) },
        { from: 'demo-p3', to: 'demo-q1', symbol: 'USDT', amount: 47_000, amountRaw: '47000000000', txHash: TX(20) },
        { from: 'demo-p4', to: 'demo-q1', symbol: 'USDT', amount: 44_000, amountRaw: '44000000000', txHash: TX(21) },
        { from: 'demo-p5', to: 'demo-q1', symbol: 'USDT', amount: 44_000, amountRaw: '44000000000', txHash: TX(22) },
        { from: 'demo-p6', to: 'demo-q2', symbol: 'USDT', amount: 51_000, amountRaw: '51000000000', txHash: TX(23) },
        { from: 'demo-p7', to: 'demo-q2', symbol: 'USDT', amount: 51_000, amountRaw: '51000000000', txHash: TX(24) },
        { from: 'demo-q0', to: 'demo-end', symbol: 'USDT', amount: 168_000, amountRaw: '168000000000', txHash: TX(25) },
        { from: 'demo-q1', to: 'demo-end', symbol: 'USDT', amount: 135_000, amountRaw: '135000000000', txHash: TX(26) },
        { from: 'demo-q2', to: 'demo-end', symbol: 'USDT', amount: 102_000, amountRaw: '102000000000', txHash: TX(27) },
    ],
};
