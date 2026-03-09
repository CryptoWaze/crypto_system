import { getApiUrl } from '@/lib/config/api';
import type { CaseHistoryItem } from '@/lib/types/case-api';

export type GetCasesHistoryResult =
  | { ok: true; data: CaseHistoryItem[] }
  | { ok: false; status: number; message: string };

export async function getCasesHistory(
  userId: string,
  accessToken: string,
): Promise<GetCasesHistoryResult> {
  const url = getApiUrl(`/cases/history/${encodeURIComponent(userId)}`);

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const body = await res.json().catch(() => ({}));
    const data = body?.data ?? body;

    if (!res.ok) {
      const message =
        typeof body?.message === 'string'
          ? body.message
          : Array.isArray(body?.message)
            ? body.message.join('. ')
            : res.status === 403
              ? 'Acesso negado.'
              : res.status === 401
                ? 'Não autorizado. Faça login novamente.'
                : 'Erro ao carregar histórico de casos.';
      return { ok: false, status: res.status, message };
    }

    return { ok: true, data: Array.isArray(data) ? data : [] };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando.',
    };
  }
}
