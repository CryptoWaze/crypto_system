export function formatEdgeAmount(value: number): string {
    if (!Number.isFinite(value)) return String(value);
    if (value >= 0.01) {
        return value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
    }
    if (value === 0) return '0';
    const exp = Math.floor(Math.log10(value));
    const mantissa = value / Math.pow(10, exp);
    const significant = mantissa.toFixed(4).replace('.', '');
    const zeros = -exp - 1;
    return '0,' + '0'.repeat(zeros) + significant;
}

export function formatEdgeTimestamp(iso: string): string {
    try {
        const d = new Date(iso);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        const s = String(d.getSeconds()).padStart(2, '0');
        return `${day}/${m}/${y} ${h}:${min}:${s}`;
    } catch {
        return iso;
    }
}

export function capitalizeFirst(str: string): string {
    if (!str?.length) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
