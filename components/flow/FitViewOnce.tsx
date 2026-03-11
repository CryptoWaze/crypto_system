'use client';

import { useEffect } from 'react';
import { useReactFlow } from '@xyflow/react';

const FIT_PADDING = 0.08;
const FIT_DURATION_MS = 300;

export function FitViewOnce() {
    const { fitView } = useReactFlow();
    useEffect(() => {
        const t = setTimeout(() => {
            fitView({ padding: FIT_PADDING, duration: FIT_DURATION_MS });
        }, 100);
        return () => clearTimeout(t);
    }, [fitView]);
    return null;
}
