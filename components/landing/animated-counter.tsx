'use client';

import { useEffect, useRef, useState } from 'react';

type AnimatedCounterProps = {
    end: number;
    durationMs?: number;
    suffix?: string;
    formatThousands?: boolean;
    isInView: boolean;
    className?: string;
};

export function AnimatedCounter({
    end,
    durationMs = 1800,
    suffix = '',
    formatThousands = false,
    isInView,
    className,
}: AnimatedCounterProps) {
    const [value, setValue] = useState(0);
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!isInView || hasStarted.current) return;
        hasStarted.current = true;

        const start = performance.now();

        function tick(now: number) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            const easeOutQuart = 1 - (1 - progress) ** 4;
            setValue(Math.round(easeOutQuart * end));
            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }, [isInView, end, durationMs]);

    const display = formatThousands
        ? value.toLocaleString('pt-BR', { minimumIntegerDigits: 1 })
        : String(value);

    return (
        <span className={className}>
            {display}
            {suffix}
        </span>
    );
}
