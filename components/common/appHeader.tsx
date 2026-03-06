'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/lib/auth-storage';
import type { UserResponse } from '@/lib/types/auth';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FolderOpen, LogOut } from 'lucide-react';
import { ModalCases } from '@/components/common/modalCases';

type AppHeaderProps = {
    user: UserResponse;
    meusCasosOpen?: boolean;
    onMeusCasosOpenChange?: (open: boolean) => void;
};

export function AppHeader({ user, meusCasosOpen: meusCasosOpenProp, onMeusCasosOpenChange }: AppHeaderProps) {
    const router = useRouter();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [meusCasosOpenInternal, setMeusCasosOpenInternal] = useState(false);
    const meusCasosOpen = onMeusCasosOpenChange ? (meusCasosOpenProp ?? false) : meusCasosOpenInternal;
    const setMeusCasosOpen = onMeusCasosOpenChange ?? setMeusCasosOpenInternal;

    const handleConfirmSair = () => {
        setConfirmOpen(false);
        clearUser();
        router.replace('/login');
    };

    const displayName = user.name ?? user.email;

    return (
        <>
            <header className="fixed inset-x-0 top-0 z-10 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
                <Link href="/dashboard" className="flex items-center gap-2 shrink-0" aria-label="CryptoForense - início">
                    <span className="font-serif text-xl font-semibold tracking-tight text-foreground sm:text-2xl">CryptoForense</span>
                    <span className="hidden text-xs font-medium uppercase tracking-widest text-muted-foreground sm:inline">Investigação</span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegação do usuário">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setMeusCasosOpen(true)}
                        className="h-10 gap-1.5 rounded-[6px] bg-primary px-3 text-primary-foreground hover:bg-primary/90 sm:px-4"
                    >
                        <FolderOpen className="size-4 shrink-0" aria-hidden />
                        <span className="hidden sm:inline">Meus casos</span>
                    </Button>
                    <div className="mx-2 hidden h-8 w-px bg-border sm:block" aria-hidden />
                    <div className="hidden min-w-0 max-w-[140px] flex-col items-end sm:flex sm:max-w-[200px]">
                        <span className="truncate text-sm font-medium text-foreground">{displayName}</span>
                        <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setConfirmOpen(true)}
                        className="h-10 w-10 shrink-0 rounded-[6px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Sair da conta"
                    >
                        <LogOut className="size-4" aria-hidden />
                    </Button>
                </nav>
            </header>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.12)] sm:max-w-md sm:p-6"
                >
                    <DialogHeader className="gap-1.5 sm:gap-2">
                        <DialogTitle className="text-left text-base font-semibold text-foreground sm:text-lg">
                            Confirmação de Encerramento de Sessão
                        </DialogTitle>
                        <DialogDescription className="text-left text-sm leading-relaxed text-muted-foreground">
                            Tem certeza de que deseja sair da sua conta? Ao fazer isso, você será desconectado e não terá mais acesso aos recursos.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 flex flex-col-reverse gap-3 sm:mt-3 sm:flex-row sm:justify-end sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                            className="h-10 w-full rounded-[6px] sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="button"
                            onClick={handleConfirmSair}
                            className="h-10 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                        >
                            Confirmar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ModalCases open={meusCasosOpen} onOpenChange={setMeusCasosOpen} />
        </>
    );
}
