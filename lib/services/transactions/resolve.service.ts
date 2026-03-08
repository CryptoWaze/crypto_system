import { getApiUrl } from '@/lib/config/api';
import type { TransactionsResolveResponse } from '@/lib/types/tracking';

export type ResolveResult =
  | { ok: true; data: TransactionsResolveResponse }
  | { ok: false; status: number; message: string };

export async function postTransactionsResolve(
  txHash: string,
  reportedLossAmount?: number,
): Promise<ResolveResult> {
  const url = getApiUrl('transactions/resolve');
  const body: { txHash: string; reportedLossAmount?: number } = {
    txHash: txHash.trim(),
  };
  if (reportedLossAmount != null && Number.isFinite(reportedLossAmount) && reportedLossAmount > 0) {
    body.reportedLossAmount = reportedLossAmount;
  }

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { ok: true, data: data as TransactionsResolveResponse };
    }

    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join('. ')
          : res.status === 400
            ? 'Hash ou valor inválido. Verifique os dados.'
            : res.status === 404
              ? 'Transação não encontrada em nenhuma chain. Verifique o hash.'
              : res.status === 502
                ? 'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.'
                : 'Erro ao resolver transação. Tente novamente.';

    return { ok: false, status: res.status, message };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
    };
  }
}
