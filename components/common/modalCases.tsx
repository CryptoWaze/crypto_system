'use client';

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { FolderOpen, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MyCasesModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function ModalCases({ open, onOpenChange }: MyCasesModalProps) {
    const router = useRouter();

    const handleCreateFirstCase = () => {
        onOpenChange(false);
        router.push('/dashboard/rastreio/novo');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="right"
                showClose={false}
                className="flex w-full flex-col border-l border-border bg-card p-0 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] sm:max-w-md"
            >
                <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border px-5 py-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-[6px] border border-border bg-muted/50 sm:size-10">
                            <FolderOpen className="size-5 text-muted-foreground sm:size-5" aria-hidden />
                        </div>
                        <SheetTitle className="text-left text-base font-semibold text-foreground sm:text-lg">Meus casos</SheetTitle>
                    </div>
                    <SheetClose
                        className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none sm:size-10 cursor-pointer"
                        aria-label="Close"
                    >
                        <X className="size-4 sm:size-5" aria-hidden />
                    </SheetClose>
                </SheetHeader>

                <div className="flex flex-1 flex-col items-center justify-center border-b border-border/50 px-5 py-10 text-center sm:py-14">
                    <div className="mb-5 flex size-14 items-center justify-center rounded-[6px] border border-border bg-muted/30 sm:size-16">
                        <FolderOpen className="size-7 text-muted-foreground sm:size-8" aria-hidden />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">Nenhum caso ainda</h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">Seus casos aparecerão aqui após serem criados.</p>
                    <Button
                        type="button"
                        onClick={handleCreateFirstCase}
                        className="mt-6 h-10 rounded-[6px] bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Iniciar rastreamento
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
