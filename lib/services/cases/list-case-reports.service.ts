import { getApiUrl } from '@/lib/config/api';

export type CaseReportListItem = {
    id: string;
    caseId: string;
    format: string;
    generatedAt: string;
    createdAt: string;
};

export type ListCaseReportsResult =
    | { ok: true; data: CaseReportListItem[] }
    | { ok: false; status: number; message: string };

export async function listCaseReports(
    caseId: string,
    accessToken: string,
): Promise<ListCaseReportsResult> {
    const url = getApiUrl(`/cases/${encodeURIComponent(caseId)}/reports`);

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
                          : 'Erro ao listar relatórios. Tente novamente.';
            return { ok: false, status: res.status, message };
        }

        const list = Array.isArray(data) ? data : Array.isArray(body) ? body : [];
        return { ok: true, data: list as CaseReportListItem[] };
    } catch {
        return {
            ok: false,
            status: 0,
            message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
        };
    }
}
