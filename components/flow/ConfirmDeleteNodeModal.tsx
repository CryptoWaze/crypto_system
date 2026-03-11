'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export type ConfirmDeleteNodeModalProps = {
    open: boolean;
    onClose: () => void;
    nodeLabel: string;
    onConfirm: () => Promise<void>;
};

export function ConfirmDeleteNodeModal({ open, onClose, nodeLabel, onConfirm }: ConfirmDeleteNodeModalProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent
                showCloseButton={false}
                className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(91,141,239,0.08)] sm:max-w-md sm:p-6"
            >
                <DialogHeader className="gap-1.5 sm:gap-2">
                    <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">
                        Confirmação de exclusão do nó
                    </DialogTitle>
                    <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                        Deseja realmente excluir este nó do fluxo? O endereço{' '}
                        <strong className="font-mono text-foreground break-all">{nodeLabel}</strong> e as transações associadas serão removidas do grafo.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4 flex flex-col-reverse gap-3 sm:mt-3 sm:flex-row sm:justify-end sm:gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                        className="h-10 w-full rounded-[6px] sm:w-auto"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="h-10 w-full rounded-[6px] sm:w-auto"
                    >
                        {isLoading ? 'Excluindo...' : 'Excluir'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
