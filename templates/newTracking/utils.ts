import type { HashValueRow } from './types';

export function truncateHash(hash: string, maxLen = 20): string {
    const t = hash.trim();
    if (!t.length) return '(não informado)';
    if (t.length <= maxLen) return t;
    return `${t.slice(0, 10)}...${t.slice(-6)}`;
}

export function nextId(): string {
    return `row-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function maskNumericValue(value: string): string {
    let v = value.replace(/[^0-9.,]/g, '');
    const sepIdx = v.search(/[.,]/);
    if (sepIdx !== -1) {
        v = v.slice(0, sepIdx + 1) + v.slice(sepIdx + 1).replace(/[.,]/g, '');
    }
    return v;
}

export function initialRow(): HashValueRow {
    return { id: nextId(), hash: '', value: '' };
}

export function formatStepDuration(ms: number): string {
    if (ms >= 1000) return `~${(ms / 1000).toFixed(1).replace('.', ',')} s`;
    return `~${ms} ms`;
}
