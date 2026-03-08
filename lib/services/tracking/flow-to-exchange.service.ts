import { getApiUrl } from '@/lib/config/api';
import type {
  FlowToExchangeSuccess,
  FlowToExchangeFailure,
} from '@/lib/types/tracking';

export type FlowToExchangeResult =
  | { ok: true; data: FlowToExchangeSuccess }
  | { ok: false; status: number; message: string; data?: FlowToExchangeFailure };

export async function getFlowToExchangeByTransaction(
  txHash: string,
  reportedLossAmount: number,
  traceId?: string,
): Promise<FlowToExchangeResult> {
  const base = getApiUrl('addresses/by-transaction/flow-to-exchange/full-history');
  const params = new URLSearchParams({
    txHash: txHash.trim(),
    reportedLossAmount: String(reportedLossAmount),
  });
  if (traceId?.trim()) params.set('traceId', traceId.trim());
  const url = `${base}?${params.toString()}`;

  try {
    const res = await fetch(url, { method: 'GET' });

    const data = await res.json().catch(() => ({}));

    if (res.ok) {
      return { ok: true, data: data as FlowToExchangeSuccess };
    }

    if (res.status === 404) {
      const payload =
        data?.message && typeof data.message === 'object'
          ? data.message
          : data;
      return {
        ok: false,
        status: 404,
        message:
          typeof data?.message === 'string'
            ? data.message
            : payload?.message ?? 'Nenhum fluxo até exchange encontrado.',
        data: payload?.graph ? (payload as FlowToExchangeFailure) : undefined,
      };
    }

    const message =
      typeof data?.message === 'string'
        ? data.message
        : Array.isArray(data?.message)
          ? data.message.join('. ')
          : res.status === 502
            ? 'Serviço de transações temporariamente indisponível. Tente novamente mais tarde.'
            : res.status === 400
              ? 'Parâmetros inválidos. Verifique hash e valor.'
              : 'Erro ao rastrear fluxo. Tente novamente.';
    return {
      ok: false,
      status: res.status,
      message,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message:
        'Erro de conexão. Verifique se a API está rodando e tente novamente.',
    };
  }
}
