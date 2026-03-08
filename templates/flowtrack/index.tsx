'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth-storage';
import type { UserResponse } from '@/lib/types/auth';
import type { TransactionsResolveResponse, FlowGraph, FlowGraphNode } from '@/lib/types/tracking';
import type { FlowGraphEdgeWithTimestamp } from '@/components/flow/FlowGraphView';
import { postTransactionsResolve } from '@/lib/services/transactions/resolve.service';
import { FlowGraphView } from '@/components/flow/FlowGraphView';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/toast-context';
import { Search, Loader2, ArrowLeft } from 'lucide-react';

type ViewState = 'input' | 'loading' | 'result';

function buildGraphFromResolve(
  resolveData: TransactionsResolveResponse,
  txHash: string,
): FlowGraph & { edges: FlowGraphEdgeWithTimestamp[] } {
  const transfer =
    resolveData.seedTransfer ??
    (resolveData.transfers?.length
      ? resolveData.transfers.reduce((best, t) => (t.amount > best.amount ? t : best))
      : null);
  if (!transfer) {
    return { nodes: [], edges: [] };
  }
  const nodes: FlowGraphNode[] = [
    { id: transfer.from, label: transfer.from },
    { id: transfer.to, label: transfer.to },
  ];
  const edge: FlowGraphEdgeWithTimestamp = {
    from: transfer.from,
    to: transfer.to,
    symbol: transfer.symbol,
    amount: transfer.amount,
    amountRaw: transfer.rawAmount,
    txHash,
    timestamp: transfer.timestamp,
  };
  return { nodes, edges: [edge] };
}

export function FlowTrackTemplate() {
  const router = useRouter();
  const toast = useToast();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [meusCasosOpen, setMeusCasosOpen] = useState(false);
  const [view, setView] = useState<ViewState>('input');
  const [hash, setHash] = useState('');
  const [value, setValue] = useState('');
  const [resolveData, setResolveData] = useState<TransactionsResolveResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    setUser(u);
  }, [router]);

  const handleSearch = useCallback(async () => {
    const txHash = hash.trim();
    if (!txHash) {
      toast.error('Informe a hash da transação.');
      return;
    }
    const reportedLossAmount = value.trim() ? parseFloat(value.replace(',', '.')) : undefined;
    if (reportedLossAmount != null && (!Number.isFinite(reportedLossAmount) || reportedLossAmount < 0)) {
      toast.error('Valor reportado deve ser um número positivo.');
      return;
    }

    setError(null);
    setView('loading');

    const result = await postTransactionsResolve(txHash, reportedLossAmount);

    if (result.ok) {
      setResolveData(result.data);
      setView('result');
    } else {
      setResolveData(null);
      setView('input');
      setError(result.message);
      toast.error(result.message);
    }
  }, [hash, value, toast]);

  const handleNewSearch = useCallback(() => {
    setView('input');
    setResolveData(null);
    setError(null);
  }, []);

  if (!user) return null;

  return (
    <div className="min-h-screen w-full overflow-auto bg-background">
      <AppHeader user={user} meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
      <div className="h-14 shrink-0" aria-hidden />

      {view === 'input' && (
        <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-16">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(91,141,239,0.05),transparent_45%)]" aria-hidden />
          <div className="relative z-10 mx-auto w-full max-w-2xl rounded-2xl border border-border bg-card/60 px-8 py-10 text-center shadow-[0_0_40px_-12px_var(--glow-blue)]">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Rastreio manual
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              FlowTrack
            </h1>
            <p className="mt-4 text-muted-foreground">
              Busque por hash da transação para obter a chain, as transferências e a carteira de
              destino (quando informar o valor reportado).
            </p>
            <div className="mt-10 flex flex-col gap-3">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  aria-hidden
                />
                <Input
                  type="text"
                  placeholder="Hash da transação (ex.: 0x4199be011e1e861b7b43274cc...)"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  className="h-12 rounded-xl border-border bg-muted/30 pl-12 pr-4 text-base"
                  aria-label="Hash da transação"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="Valor reportado (opcional, ex.: 2324)"
                    value={value}
                    onChange={(e) => setValue(e.target.value.replace(/[^0-9.,]/g, ''))}
                    className="h-11 rounded-lg border-border"
                    aria-label="Valor reportado"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="h-11 rounded-lg bg-primary px-6 text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_-4px_var(--glow-blue)]"
                >
                  Resolver transação
                </Button>
              </div>
            </div>
            {error && (
              <p className="mt-4 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
        </main>
      )}

      {view === 'loading' && (
        <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
          <p className="mt-4 text-sm text-muted-foreground">Buscando transação nas chains...</p>
        </main>
      )}

      {view === 'result' && resolveData && (() => {
        const graph = buildGraphFromResolve(resolveData, hash.trim());
        if (graph.nodes.length === 0) return null;
        return (
          <main className="h-[calc(100vh-3.5rem)] w-full">
            <FlowGraphView graph={graph} className="h-full w-full" />
          </main>
        );
      })()}
    </div>
  );
}
