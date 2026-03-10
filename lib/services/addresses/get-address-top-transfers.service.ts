import { getApiUrl } from '@/lib/config/api';
import type { GetAddressTopTransfersResult } from '@/lib/types/address-top-transfers';

export type GetAddressTopTransfersServiceResult =
  | { ok: true; data: GetAddressTopTransfersResult }
  | { ok: false; status: number; message: string };

export async function getAddressTopTransfers(
  address: string,
  accessToken: string,
): Promise<GetAddressTopTransfersServiceResult> {
  const normalized = address.trim();
  if (!normalized) {
    return { ok: false, status: 400, message: 'Endereço é obrigatório.' };
  }

  const url = getApiUrl(`/addresses/${encodeURIComponent(normalized)}/top-transfers`);

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
                ? 'Nenhuma transferência encontrada.'
                : 'Erro ao carregar transferências. Tente novamente.';
      return { ok: false, status: res.status, message };
    }

    return { ok: true, data: data as GetAddressTopTransfersResult };
  } catch {
    return {
      ok: false,
      status: 0,
      message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
    };
  }
}
