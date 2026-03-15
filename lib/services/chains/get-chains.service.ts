import { getApiUrl } from '@/lib/config/api';
import type { Chain } from '@/lib/types/chain';

export type GetChainsResult =
  | { ok: true; data: Chain[] }
  | { ok: false; status: number; message: string };

export async function getChains(): Promise<GetChainsResult> {
  const url = getApiUrl('/chains');

  try {
    const res = await fetch(url, { method: 'GET' });
    const body = await res.json().catch(() => ({}));
    const data = body?.data ?? body;

    if (!res.ok) {
      const message =
        typeof body?.message === 'string'
          ? body.message
          : Array.isArray(body?.message)
            ? body.message.join('. ')
            : 'Erro ao carregar chains.';
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
