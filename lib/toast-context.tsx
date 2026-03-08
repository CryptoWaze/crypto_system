'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error';

type ToastState = {
    message: string;
    type: ToastType;
    visible: boolean;
    exiting: boolean;
};

type ToastContextValue = {
    success: (message: string) => void;
    error: (message: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

const TOAST_DURATION_MS = 1600;
const ANIMATION_MS = 400;

export function useToast() {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<ToastState>({
        message: '',
        type: 'success',
        visible: false,
        exiting: false,
    });

    const hide = useCallback(() => {
        setState((s) => (s.visible ? { ...s, exiting: true } : s));
    }, []);

    const success = useCallback((message: string) => {
        setState({
            message,
            type: 'success',
            visible: true,
            exiting: false,
        });
    }, []);

    const error = useCallback((message: string) => {
        setState({
            message,
            type: 'error',
            visible: true,
            exiting: false,
        });
    }, []);

    useEffect(() => {
        if (!state.visible) return;
        const t = setTimeout(hide, TOAST_DURATION_MS);
        return () => clearTimeout(t);
    }, [state.visible, hide]);

    useEffect(() => {
        if (!state.exiting) return;
        const t = setTimeout(() => {
            setState((s) => ({ ...s, visible: false, exiting: false, message: '' }));
        }, ANIMATION_MS);
        return () => clearTimeout(t);
    }, [state.exiting]);

    const value = useMemo(() => ({ success, error }), [success, error]);

    return (
        <ToastContext.Provider value={value}>
            {children}
            {state.visible && <ToastView message={state.message} type={state.type} exiting={state.exiting} />}
        </ToastContext.Provider>
    );
}

function ToastView({ message, type, exiting }: { message: string; type: ToastType; exiting: boolean }) {
    const [entered, setEntered] = useState(false);

    useEffect(() => {
        if (exiting) return;
        const id = requestAnimationFrame(() => {
            requestAnimationFrame(() => setEntered(true));
        });
        return () => cancelAnimationFrame(id);
    }, [exiting]);

    useEffect(() => {
        if (exiting) setEntered(false);
    }, [exiting]);

    const isSuccess = type === 'success';

    return (
        <div
            className="pointer-events-none fixed left-1/2 top-6 z-[99999] flex -translate-x-1/2 items-center justify-center"
            role="alert"
            aria-live="polite"
        >
            <div
                className={cn(
                    'rounded-[6px] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-[400ms] ease-out',
                    isSuccess ? 'bg-[hsl(143,70%,42%)]' : 'bg-[hsl(359,70%,48%)]',
                    !entered && !exiting && 'translate-y-[-80px] opacity-0',
                    entered && !exiting && 'translate-y-0 opacity-100',
                    exiting && 'translate-y-[-80px] opacity-0',
                )}
            >
                {message}
            </div>
        </div>
    );
}
