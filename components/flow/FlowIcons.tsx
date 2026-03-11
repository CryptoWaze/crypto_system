'use client';

export function BinanceLogoIcon({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="shrink-0">
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

export function ChainIcon({ src, size = 24 }: { src: string; size?: number }) {
    if (!src || typeof src !== 'string') return null;
    return (
        <img
            src={src}
            alt=""
            width={size}
            height={size}
            className="shrink-0 rounded-full object-contain"
            style={{ width: size, height: size }}
            referrerPolicy="no-referrer"
        />
    );
}
