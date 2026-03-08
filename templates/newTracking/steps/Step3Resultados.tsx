'use client';

import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/pageHeader';
import type { TrackingPayload } from '../types';
import type { FlowToExchangeSuccess, FlowToExchangeFailure } from '@/lib/types/tracking';
import { truncateHash } from '../utils';

const REASON_LABELS: Record<string, string> = {
  NO_OUTBOUND: 'Carteira sem transferências de saída no histórico.',
  MAX_WALLETS_REACHED: 'Limite de 50 carteiras atingido sem encontrar exchange.',
  EXHAUSTED_OPTIONS: 'Todos os ramos explorados sem encontrar exchange.',
};

type Step3ResultadosProps = {
  trackingPayload: TrackingPayload;
  trackingResult: FlowToExchangeSuccess | FlowToExchangeFailure | null;
  trackingError: string | null;
  onNovoRastreamento: () => void;
  onMeusCasos: () => void;
};

export function Step3Resultados({
  trackingPayload,
  trackingResult,
  trackingError,
  onNovoRastreamento,
  onMeusCasos,
}: Step3ResultadosProps) {
  const success = trackingResult?.success === true;
  const failure = trackingResult && !trackingResult.success;

  return (
    <>
      <PageHeader
        className="mx-auto mt-5"
        title="Resultados do rastreio"
        description={
          trackingError
            ? 'Ocorreu um erro ao rastrear. Você pode tentar novamente.'
            : success
              ? 'Caminho até uma exchange (hot wallet) encontrado.'
              : failure
                ? 'Nenhum caminho até exchange encontrado. Veja o que foi explorado abaixo.'
                : 'Resumo do rastreamento.'
        }
      />

      <div className="mt-6 space-y-6">
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Resumo do caso</h2>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Nome do caso</dt>
              <dd className="font-medium text-foreground">{trackingPayload.caseName}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Transações informadas</dt>
              <dd className="font-medium text-foreground">{trackingPayload.entries.length}</dd>
            </div>
            {trackingResult && (
              <div>
                <dt className="text-muted-foreground">Chain</dt>
                <dd className="font-medium text-foreground">{trackingResult.chain}</dd>
              </div>
            )}
          </dl>
        </div>

        {trackingError && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
            <p className="text-sm font-medium text-destructive">{trackingError}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Verifique se a API está rodando e se a hash e o valor estão corretos. O rastreio pode demorar vários minutos.
            </p>
          </div>
        )}

        {failure && (
          <div className="rounded-lg border border-amber-500/50 bg-amber-500/5 p-4">
            <p className="text-sm font-medium text-foreground">
              {REASON_LABELS[(failure as FlowToExchangeFailure).reason] ?? (failure as FlowToExchangeFailure).reason}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground break-all">
              Última carteira: {(failure as FlowToExchangeFailure).lastWallet}
            </p>
          </div>
        )}

        {trackingResult && (success || failure) && (
          <>
            {success && (
              <div className="rounded-lg border border-border bg-green-500/5 p-4">
                <h3 className="text-sm font-semibold text-foreground">Hot wallet de destino</h3>
                <p className="mt-1 font-mono text-xs text-foreground break-all">
                  {(trackingResult as FlowToExchangeSuccess).endpointAddress}
                </p>
              </div>
            )}

            {(trackingResult.steps?.length ?? 0) > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Passos do fluxo ({trackingResult.steps.length})
                </div>
                <div className="divide-y divide-border">
                  {trackingResult.steps.map((step, i) => (
                    <div key={i} className="px-3 py-3 text-sm">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          {truncateHash(step.fromAddress)}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-xs text-foreground">
                          {truncateHash(step.toAddress)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {step.transfer.amount} {step.transfer.symbol} · tx: {truncateHash(step.transfer.txHash, 28)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {trackingResult.graph?.edges?.length > 0 && (
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="bg-muted/40 px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Grafo do fluxo ({trackingResult.graph.nodes.length} nós, {trackingResult.graph.edges.length} arestas)
                </div>
                <div className="divide-y divide-border max-h-64 overflow-y-auto">
                  {trackingResult.graph.edges.map((edge, i) => (
                    <div key={i} className="px-3 py-2 text-xs flex flex-wrap items-center gap-x-2">
                      <span className="text-muted-foreground">{edge.from.slice(0, 10)}…{edge.from.slice(-8)}</span>
                      <span>→</span>
                      <span className="text-foreground">{edge.to.slice(0, 10)}…{edge.to.slice(-8)}</span>
                      <span className="text-muted-foreground">
                        {edge.amount} {edge.symbol}
                      </span>
                      {edge.outcome && (
                        <span
                          className={
                            edge.outcome === 'SUCCESS'
                              ? 'text-green-600'
                              : edge.outcome === 'NO_OUTBOUND'
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                          }
                        >
                          {edge.outcome}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={onNovoRastreamento}
          className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Novo rastreamento
        </Button>
        <Button type="button" onClick={onMeusCasos} variant="outline" className="rounded-[6px]">
          Meus casos
        </Button>
      </div>
    </>
  );
}
