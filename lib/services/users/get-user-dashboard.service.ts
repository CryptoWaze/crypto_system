import { getApiUrl } from '@/lib/config/api';
import type { UserDashboardResponse } from '@/lib/types/user-dashboard';

export type GetUserDashboardResult =
  | { ok: true; data: UserDashboardResponse }
  | { ok: false; status: number; message: string };

export async function getUserDashboard(
  userId: string,
  accessToken: string,
): Promise<GetUserDashboardResult> {
  const url = getApiUrl(`/users/${encodeURIComponent(userId)}`);

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
                : res.status === 404
                  ? 'Usuário não encontrado.'
                  : 'Erro ao carregar dashboard.';
      return { ok: false, status: res.status, message };
    }

    const parsed: UserDashboardResponse = {
      totalCases: typeof data.totalCases === 'number' ? data.totalCases : 0,
      totalTrackedValueUSD: typeof data.totalTrackedValueUSD === 'number' ? data.totalTrackedValueUSD : 0,
      casesThisMonth: typeof data.casesThisMonth === 'number' ? data.casesThisMonth : 0,
      totalTrackedTransactions: typeof data.totalTrackedTransactions === 'number' ? data.totalTrackedTransactions : 0,
      caseHistory: Array.isArray(data.caseHistory) ? data.caseHistory : [],
    };

    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando.',
    };
  }
}
