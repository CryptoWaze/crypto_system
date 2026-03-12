'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function DashboardTemplate() {
    const router = useRouter();
    const { status } = useSession();
    const [meusCasosOpen, setMeusCasosOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
            </div>
        );
    }
    if (status === 'unauthenticated') return null;

    return (
        <div className="min-h-screen w-full overflow-auto bg-background">
            <AppHeader meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-16">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(91,141,239,0.05),transparent_45%)]" aria-hidden />
                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Plataforma de investigação</p>
                    <div className="mt-3 flex justify-center">
                        <img src="/logo.png" alt="CryptoForense" className="h-14 w-auto sm:h-16 md:h-20" width={240} height={80} />
                    </div>
                    <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                        Rastreio de transações em blockchain para investigação de fraudes e perdas.
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                        Pronto para começar? Inicie o rastreio de endereços e transações em criptoativos e monitore seus casos.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            className="rounded-[6px] bg-primary text-white hover:bg-primary/90 shadow-[0_0_24px_-4px_var(--glow-blue)]"
                            asChild
                        >
                            <Link href="/dashboard/rastreio/novo">Iniciar rastreio</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-[6px]" onClick={() => setMeusCasosOpen(true)}>
                            Meus casos
                        </Button>
                    </div>
                </div>
            </main>
        </div>
    );
}
