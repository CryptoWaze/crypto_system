import { getApiUrl } from '@/lib/config/api';

export type CaseReportItem = {
    id: string;
    caseId: string;
    format: string;
    generatedAt: string;
    createdAt: string;
};

export type GetOrCreateCaseReportResult =
    | { ok: true; data: { generated: boolean; reports: CaseReportItem[] } }
    | { ok: false; status: number; message: string };

export async function getOrCreateCaseReport(caseId: string, accessToken: string): Promise<GetOrCreateCaseReportResult> {
    const url = getApiUrl(`/cases/${encodeURIComponent(caseId)}/reports`);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
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
                          : 'Erro ao gerar relatório. Tente novamente.';
            return { ok: false, status: res.status, message };
        }

        return {
            ok: true,
            data: {
                generated: Boolean(data?.generated),
                reports: Array.isArray(data?.reports) ? data.reports : [],
            },
        };
    } catch {
        return {
            ok: false,
            status: 0,
            message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
        };
    }
}
