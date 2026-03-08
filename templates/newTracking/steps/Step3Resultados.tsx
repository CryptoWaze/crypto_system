'use client';

import { useMemo } from 'react';
import { FlowGraphView, type FlowGraphWithTimestamps } from '@/components/flow/FlowGraphView';
import type { TrackingPayload } from '../types';
import type { FlowToExchangeSuccess, FlowToExchangeFailure, FlowGraphNode, FlowGraphEdge } from '@/lib/types/tracking';
import type { FlowStep } from '@/lib/types/tracking';

function normalizeNode(n: { id?: string; label?: string; address?: string }, i: number) {
  const id = n.id ?? (n as { address?: string }).address ?? String(i);
  return { id, label: n.label ?? id };
}

function buildGraphFromSteps(steps: FlowStep[]): FlowGraphWithTimestamps | null {
  if (!steps?.length) return null;
  const seen = new Set<string>();
  const nodes: FlowGraphNode[] = [];
  const edges: (FlowGraphEdge & { timestamp?: string })[] = [];
  for (const step of steps) {
    for (const addr of [step.fromAddress, step.toAddress]) {
      if (addr && !seen.has(addr)) {
        seen.add(addr);
        nodes.push({ id: addr, label: addr });
      }
    }
    edges.push({
      from: step.fromAddress,
      to: step.toAddress,
      symbol: step.transfer.symbol,
      amount: step.transfer.amount,
      amountRaw: step.transfer.rawAmount,
      txHash: step.transfer.txHash,
      timestamp: step.transfer.timestamp,
    });
  }
  return nodes.length ? { nodes, edges } : null;
}

function buildGraphWithTimestamps(
  result: FlowToExchangeSuccess | FlowToExchangeFailure
): FlowGraphWithTimestamps | null {
  const { graph, steps } = result;
  const stepMap = new Map<string, string>();
  for (const step of steps ?? []) {
    const key = `${step.fromAddress}|${step.toAddress}|${step.transfer.txHash}`;
    stepMap.set(key, step.transfer.timestamp);
  }
  if (graph?.nodes?.length) {
    const nodes = graph.nodes.map(normalizeNode);
    const rawEdges = graph.edges ?? [];
    const edges = rawEdges.map((e) => {
      const key = `${e.from}|${e.to}|${e.txHash}`;
      return { ...e, timestamp: stepMap.get(key) };
    });
    return { nodes, edges };
  }
  return buildGraphFromSteps(steps ?? []);
}

type Step3ResultadosProps = {
  trackingPayload: TrackingPayload;
  trackingResult: FlowToExchangeSuccess | FlowToExchangeFailure | null;
  trackingError: string | null;
  onNovoRastreamento: () => void;
  onMeusCasos: () => void;
};

export function Step3Resultados({
  trackingResult,
  trackingError,
}: Step3ResultadosProps) {
  const graphWithTimestamps = useMemo(() => {
    if (!trackingResult) return null;
    return buildGraphWithTimestamps(trackingResult);
  }, [trackingResult]);

  const showGraph = graphWithTimestamps != null && graphWithTimestamps.nodes.length > 0;

  if (trackingError) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center px-4">
        <p className="text-center text-sm text-destructive">{trackingError}</p>
      </main>
    );
  }

  if (!trackingResult) {
    return null;
  }

  if (!showGraph || !graphWithTimestamps) {
    return (
      <main className="flex h-full w-full flex-col items-center justify-center px-4">
        <p className="text-center text-sm text-muted-foreground">
          Nenhum dado de fluxo disponível para exibir o grafo.
        </p>
      </main>
    );
  }

  return (
    <main className="h-full w-full">
      <FlowGraphView
        key={`auto-${graphWithTimestamps.nodes.length}-${graphWithTimestamps.edges.length}-${(graphWithTimestamps.nodes[0]?.id ?? '').slice(0, 18)}`}
        graph={graphWithTimestamps}
        className="h-full w-full"
        readOnly
      />
    </main>
  );
}
