'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getUser } from '@/lib/auth-storage';
import type { UserResponse } from '@/lib/types/auth';
import { AppHeader } from '@/components/common/appHeader';
import { Button } from '@/components/ui/button';

export function DashboardTemplate() {
    const router = useRouter();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [meusCasosOpen, setMeusCasosOpen] = useState(false);

    useEffect(() => {
        const u = getUser();
        if (!u) {
            router.replace('/login');
            return;
        }
        setUser(u);
    }, [router]);

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen w-full overflow-auto bg-background">
            <AppHeader user={user} meusCasosOpen={meusCasosOpen} onMeusCasosOpenChange={setMeusCasosOpen} />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-6 py-16">
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Plataforma de investigação</p>
                    <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">CryptoForense</h1>
                    <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                        Rastreio de transações em blockchain para investigação de fraudes e perdas.
                    </p>
                    <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
                        Pronto para começar? Inicie o rastreio de endereços e transações em criptoativos e monitore seus casos.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button
                            size="lg"
                            className="rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
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
