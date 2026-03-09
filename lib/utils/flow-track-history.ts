import type { TransactionsResolveResponse } from '@/lib/types/tracking';
import type { FlowGraphWithTimestamps } from './flow-track-graph';

const STORAGE_KEY_PREFIX = 'flowTrackHistory-';

export type FlowTrackHistoryItem =
  | { createdAt: string; graph: FlowGraphWithTimestamps }
  | { createdAt: string; resolveData: TransactionsResolveResponse; txHash: string };

export function saveFlowTrackToHistory(
  item: { graph: FlowGraphWithTimestamps } | { resolveData: TransactionsResolveResponse; txHash: string },
): string {
  const id = crypto.randomUUID();
  const withMeta: FlowTrackHistoryItem = {
    ...item,
    createdAt: new Date().toISOString(),
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY_PREFIX + id, JSON.stringify(withMeta));
    } catch {
      // ignore quota or parse errors
    }
  }
  return id;
}

export function getFlowTrackFromHistory(id: string): FlowTrackHistoryItem | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY_PREFIX + id);
    if (!raw) return null;
    return JSON.parse(raw) as FlowTrackHistoryItem;
  } catch {
    return null;
  }
}
