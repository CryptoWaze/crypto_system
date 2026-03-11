import { getApiUrl } from '@/lib/config/api';

export type EditCaseWalletPayload = {
    walletId: string;
    nickname?: string | null;
    position?: 'default' | { x: number; y: number };
};

export type SoftDeleteTransactionPayload = {
    flowId: string;
    transactionId: string;
};

export type SoftDeleteFlowPayload = {
    flowId: string;
};

export type EditCaseResult = { ok: true } | { ok: false; status: number; message: string };

export type EditCaseParams = {
    name?: string;
    wallets?: EditCaseWalletPayload[];
    softDeleteFlows?: SoftDeleteFlowPayload[];
    softDeleteTransactions?: SoftDeleteTransactionPayload[];
};

export async function editCase(caseId: string, params: EditCaseParams, accessToken: string): Promise<EditCaseResult> {
    const url = getApiUrl(`/cases/${encodeURIComponent(caseId)}/edit`);
    const body: Record<string, unknown> = {};
    if (params.name != null && params.name !== '') body.name = params.name;
    if (params.wallets != null && params.wallets.length > 0) body.wallets = params.wallets;
    if (params.softDeleteFlows != null && params.softDeleteFlows.length > 0) body.softDeleteFlows = params.softDeleteFlows;
    if (params.softDeleteTransactions != null && params.softDeleteTransactions.length > 0) {
        body.softDeleteTransactions = params.softDeleteTransactions;
    }
    if (Object.keys(body).length === 0) return { ok: true };

    console.log('body', body);

    try {
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body),
        });

        const responseData = (await res.json().catch(() => ({}))) as { message?: string | string[] };

        console.log('responseData', responseData);

        if (!res.ok) {
            const message =
                typeof responseData?.message === 'string'
                    ? responseData.message
                    : Array.isArray(responseData?.message)
                      ? responseData.message.join('. ')
                      : res.status === 401
                        ? 'Não autorizado. Faça login novamente.'
                        : res.status === 403
                          ? 'Sem permissão para editar este caso.'
                          : 'Erro ao salvar alterações. Tente novamente.';
            return { ok: false, status: res.status, message };
        }

        return { ok: true };
    } catch {
        return {
            ok: false,
            status: 0,
            message: 'Erro de conexão. Verifique se a API está rodando e tente novamente.',
        };
    }
}
