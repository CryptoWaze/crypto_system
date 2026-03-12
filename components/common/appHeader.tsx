'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FolderOpen, ChevronDown, LogOut } from 'lucide-react';
import { ModalCases } from '@/components/common/modalCases';

type AppHeaderProps = {
    meusCasosOpen?: boolean;
    onMeusCasosOpenChange?: (open: boolean) => void;
};

export function AppHeader({ meusCasosOpen: meusCasosOpenProp, onMeusCasosOpenChange }: AppHeaderProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const user = session?.user;
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [meusCasosOpenInternal, setMeusCasosOpenInternal] = useState(false);
    const meusCasosOpen = onMeusCasosOpenChange ? (meusCasosOpenProp ?? false) : meusCasosOpenInternal;
    const setMeusCasosOpen = onMeusCasosOpenChange ?? setMeusCasosOpenInternal;

    const handleConfirmSair = () => {
        setConfirmOpen(false);
        signOut({ redirect: false }).then(() => router.replace('/login'));
    };

    const displayName = user?.name ?? user?.email ?? '';

    return (
        <>
            <header
                className="fixed inset-x-0 top-0 z-10 flex h-14 w-full items-center justify-between border-b border-border bg-[#303135]/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-[#303135]/90 sm:px-6"
                style={{ boxShadow: '0 1px 0 0 rgba(91, 141, 239, 0.06)' }}
            >
                <Link href="/dashboard" className="flex shrink-0 items-center" aria-label="CryptoForense - início">
                    <img src="/logo.png" alt="CryptoForense" className="h-8 w-auto sm:h-9" width={140} height={36} />
                </Link>

                <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
                    {/* <Link href="/dashboard/flowtrack">
                        <Button variant="ghost" size="sm" className="h-10 rounded-[6px] px-3 text-foreground hover:bg-muted sm:px-4">
                            FlowTrack
                        </Button>
                    </Link> */}
                    <Link href="/dashboard/rastreio/novo">
                        <Button variant="ghost" size="sm" className="h-10 rounded-[6px] px-3 text-foreground hover:bg-muted sm:px-4">
                            AutoTrack
                        </Button>
                    </Link>
                    <div className="mx-1 h-6 w-px bg-border" aria-hidden />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 gap-1.5 rounded-[6px] px-3 text-foreground hover:bg-muted sm:px-4"
                                aria-label="Menu da conta"
                            >
                                <span className="max-w-[140px] truncate sm:max-w-[180px]">{displayName}</span>
                                <ChevronDown className="size-4 shrink-0 opacity-70" aria-hidden />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[220px]">
                            <DropdownMenuLabel className="font-normal">
                                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setMeusCasosOpen(true)}>
                                <FolderOpen className="size-4 shrink-0" aria-hidden />
                                Meus casos
                            </DropdownMenuItem>
                            <DropdownMenuItem variant="destructive" onClick={() => setConfirmOpen(true)}>
                                <LogOut className="size-4 shrink-0" aria-hidden />
                                Sair
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </nav>
            </header>

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent
                    showCloseButton={false}
                    className="w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] rounded-2xl border border-border bg-card p-5 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(91,141,239,0.08)] sm:max-w-md sm:p-6"
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
                        <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)} className="h-10 w-full rounded-[6px] sm:w-auto">
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
