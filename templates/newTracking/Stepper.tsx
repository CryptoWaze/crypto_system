'use client';

import { CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const FLOW_STEPS = [
    { step: 1, label: 'Dados do caso' },
    { step: 2, label: 'Rastreamento' },
    { step: 3, label: 'Resultados' },
] as const;

export function Stepper({ currentStep }: { currentStep: number }) {
    return (
        <nav aria-label="Progresso do rastreio" className="w-full">
            <ol className="flex w-full items-center justify-center gap-0">
                {FLOW_STEPS.map(({ step, label }, i) => {
                    const isActive = step === currentStep;
                    const isCompleted = step < currentStep;
                    const showCheck = isCompleted || (step === 3 && isActive);
                    const showLoading = step === 2 && isActive;
                    const showNumber = (step === 1 && isActive) || step > currentStep;
                    const isLast = i === FLOW_STEPS.length - 1;
                    const isLineCompleted = isCompleted;
                    const isHighlighted = isActive || isCompleted;
                    return (
                        <li key={step} className={cn('flex flex-col items-center', isLast ? 'flex-initial shrink-0' : 'min-w-0 flex-1')}>
                            <div className="flex w-full items-start">
                                <div className="flex shrink-0 flex-col items-center">
                                    <span
                                        className={cn(
                                            'flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300 ease-out',
                                            isHighlighted && 'border-primary bg-primary text-primary-foreground',
                                            !isHighlighted && 'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
                                        )}
                                    >
                                        {showCheck ? (
                                            <CheckCircle2
                                                className="size-5 shrink-0 text-primary-foreground animate-in fade-in zoom-in duration-300 fill-mode-both"
                                                aria-hidden
                                            />
                                        ) : showLoading ? (
                                            <Loader2 className="size-5 shrink-0 animate-spin text-primary-foreground" aria-hidden />
                                        ) : (
                                            <span className="transition-opacity duration-300">{step}</span>
                                        )}
                                    </span>
                                    <span
                                        className={cn(
                                            'mt-1.5 text-center text-xs font-medium transition-colors duration-300 sm:text-sm',
                                            isHighlighted && 'text-foreground',
                                            !isHighlighted && 'text-muted-foreground',
                                        )}
                                    >
                                        {label}
                                    </span>
                                </div>
                                {!isLast && (
                                    <div className="ml-1 flex h-9 flex-1 min-w-[16px] items-center sm:ml-2">
                                        <div
                                            className={cn(
                                                'h-0.5 w-full rounded-full transition-colors duration-300 ease-out',
                                                isLineCompleted ? 'bg-primary' : 'bg-muted',
                                            )}
                                            aria-hidden
                                        />
                                    </div>
                                )}
                            </div>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
