import { getApiUrl } from '@/lib/config/api';

export type DownloadCaseReportResult =
    | { ok: true }
    | { ok: false; status: number; message: string };

function getFilenameFromDisposition(disposition: string | null): string | null {
    if (!disposition) return null;
    const match = /filename="?([^";\n]+)"?/i.exec(disposition);
    return match ? match[1].trim() : null;
}

export async function downloadCaseReport(
    caseId: string,
    reportId: string,
    accessToken: string,
    format?: string,
): Promise<DownloadCaseReportResult> {
    const url = getApiUrl(`/cases/${encodeURIComponent(caseId)}/reports/${encodeURIComponent(reportId)}`);

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!res.ok) {
            const body = await res.json().catch(() => ({}));
            const message =
                typeof body?.message === 'string'
                    ? body.message
                    : res.status === 401
                      ? 'Não autorizado.'
                      : res.status === 404
                        ? 'Relatório não encontrado.'
                        : 'Erro ao baixar relatório.';
            return { ok: false, status: res.status, message };
        }

        const blob = await res.blob();
        const disposition = res.headers.get('Content-Disposition');
        const filename =
            getFilenameFromDisposition(disposition) ||
            (format ? `relatorio.${format.toLowerCase()}` : 'relatorio.pdf');

        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(objectUrl);

        return { ok: true };
    } catch {
        return {
            ok: false,
            status: 0,
            message: 'Erro ao baixar arquivo. Tente novamente.',
        };
    }
}
