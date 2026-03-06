const DEFAULT_API_BASE = 'http://localhost:3001';

export function getApiBaseUrl(): string {
    if (typeof window === 'undefined') return DEFAULT_API_BASE;
    return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_BASE;
}

export function getApiUrl(path: string): string {
    const base = getApiBaseUrl().replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}
