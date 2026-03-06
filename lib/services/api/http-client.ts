export interface HttpError {
  status: number
  message: string
}

export async function request<T>(
  method: string,
  url: string,
  body?: unknown
): Promise<{ data?: T; error?: HttpError }> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const message =
        typeof data.message === "string"
          ? data.message
          : Array.isArray(data.message)
            ? data.message.join(". ")
            : "Requisição falhou. Tente novamente."
      return { error: { status: res.status, message } }
    }
    return { data: data as T }
  } catch {
    return {
      error: {
        status: 0,
        message:
          "Erro de conexão. Verifique se a API está rodando e tente novamente.",
      },
    }
  }
}
