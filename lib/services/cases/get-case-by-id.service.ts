import { getApiUrl } from '@/lib/config/api';
import type { CaseByIdApiResponse } from '@/lib/types/case-api';

export type GetCaseByIdResult =
  | { ok: true; data: CaseByIdApiResponse }
  | { ok: false; status: number; message: string };

export async function getCaseById(caseId: string, accessToken: string): Promise<GetCaseByIdResult> {
  const url = getApiUrl(`/cases/${encodeURIComponent(caseId)}`);

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
            : res.status === 401
              ? 'Não autorizado. Faça login novamente.'
              : res.status === 404
                ? 'Caso não encontrado.'
                : 'Erro ao carregar o caso. Tente novamente.';
      return { ok: false, status: res.status, message };
    }

    return { ok: true, data: data as CaseByIdApiResponse };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
    };
  }
}
