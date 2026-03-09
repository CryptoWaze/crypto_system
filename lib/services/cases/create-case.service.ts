import { getApiUrl } from '@/lib/config/api';

export type CreateCaseSeed = {
  txHash: string;
  reportedLossAmount: number;
};

export type CreateCasePayload = {
  name: string;
  seeds: CreateCaseSeed[];
};

export type CreateCaseResponse = {
  traceId: string;
  caseId: string;
  seedsCount: number;
};

export type CreateCaseResult =
  | { ok: true; data: CreateCaseResponse }
  | { ok: false; status: number; message: string };

export async function createCase(
  payload: CreateCasePayload,
  accessToken: string,
): Promise<CreateCaseResult> {
  const url = getApiUrl('/cases');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        seeds: payload.seeds.map((s) => ({
          txHash: s.txHash.trim(),
          reportedLossAmount: Number(s.reportedLossAmount),
        })),
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 202 && data.traceId && data.caseId != null) {
      return {
        ok: true,
        data: {
          traceId: data.traceId,
          caseId: data.caseId,
          seedsCount: typeof data.seedsCount === 'number' ? data.seedsCount : payload.seeds.length,
        },
      };
    }

    if (!res.ok) {
      const message =
        typeof data?.message === 'string'
          ? data.message
          : Array.isArray(data?.message)
            ? data.message.join('. ')
            : res.status === 400
              ? 'Dados inválidos (nome vazio, seeds vazio ou inválido).'
              : res.status === 401
                ? 'Não autorizado. Faça login novamente.'
                : 'Erro ao criar caso. Tente novamente.';
      return { ok: false, status: res.status, message };
    }

    return {
      ok: false,
      status: res.status,
      message: 'Resposta inesperada do servidor.',
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
    };
  }
}
