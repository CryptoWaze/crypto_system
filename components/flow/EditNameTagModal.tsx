'use client';

import { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const MAX_NAME_TAG_LENGTH = 50;

function BinanceLogoIcon({ size = 24, className }: { size?: number; className?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={cn('shrink-0', className)}>
            <path fill="#F3BA2F" d="M16 2l6 8-6 8-6-8 6-8zm-8 8l6 6v6l-6 6-6-6v-6l6-6zm16 0l6 6v6l-6 6-6-6v-6l6-6zm-8 6l6 6 6 6-6 6-6-6-6-6 6-6z" />
        </svg>
    );
}

export type EditNameTagModalProps = {
    open: boolean;
    onClose: () => void;
    chain?: string;
    chainIcon?: React.ReactNode;
    address: string;
    currentNameTag?: string;
    placeholder?: string;
    onConfirm: (newNameTag: string) => void;
    className?: string;
};

export function EditNameTagModal({
    open,
    onClose,
    chain = 'BSC',
    chainIcon,
    address,
    currentNameTag = '',
    placeholder = 'Binance: Deposit Address',
    onConfirm,
    className,
}: EditNameTagModalProps) {
    const [nameTag, setNameTag] = useState(currentNameTag);

    useEffect(() => {
        if (open) {
            setNameTag(currentNameTag);
        }
    }, [open, currentNameTag]);

    const length = nameTag.length;
    const isOverLimit = length > MAX_NAME_TAG_LENGTH;

    const handleConfirm = useCallback(() => {
        const trimmed = nameTag.trim();
        if (trimmed && !isOverLimit) {
            onConfirm(trimmed);
            onClose();
        }
    }, [nameTag, isOverLimit, onConfirm, onClose]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent
                showCloseButton={false}
                className={cn(
                    'w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(91,141,239,0.08)] sm:max-w-md sm:p-6',
                    className,
                )}
            >
                <DialogHeader className="gap-1.5 sm:gap-2">
                    <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Editar Etiqueta de Nome</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                    <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-muted-foreground">Chain</span>
                            <span className="flex items-center gap-1.5 font-medium text-foreground">
                                {chainIcon ?? <BinanceLogoIcon size={16} />}
                                {chain}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs font-medium text-muted-foreground">Address</span>
                            <p className="font-mono text-xs text-foreground break-all">{address}</p>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="name-tag" className="text-sm font-medium text-foreground">
                            Name Tag
                        </Label>
                        <div className="flex items-center gap-2">
                            <Input
                                id="name-tag"
                                value={nameTag}
                                onChange={(e) => setNameTag(e.target.value.slice(0, MAX_NAME_TAG_LENGTH))}
                                placeholder={placeholder}
                                maxLength={MAX_NAME_TAG_LENGTH}
                                className={cn('h-10 flex-1 rounded-[6px]', isOverLimit && 'border-destructive aria-invalid')}
                                aria-invalid={isOverLimit}
                            />
                            <span className={cn('shrink-0 text-xs tabular-nums', isOverLimit ? 'text-destructive' : 'text-muted-foreground')}>
                                {length} / {MAX_NAME_TAG_LENGTH}
                            </span>
                        </div>
                    </div>
                </div>
                <DialogFooter className="mt-4 flex flex-col-reverse gap-3 sm:mt-3 sm:flex-row sm:justify-end sm:gap-2">
                    <Button type="button" variant="outline" onClick={onClose} className="h-10 w-full rounded-[6px] sm:w-auto">
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!nameTag.trim() || isOverLimit}
                        className="h-10 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                    >
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
