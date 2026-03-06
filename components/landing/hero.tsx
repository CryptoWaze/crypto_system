import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
    return (
        <section className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
            <div className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Plataforma de investigação</p>
                <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">CryptoForense</h1>
                <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                    Rastreio de transações em blockchain para investigação de fraudes e perdas.
                </p>
                <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
                    Identifique o destino de valores em criptoativos e obtenha suporte técnico para casos jurídicos e recuperação de ativos.
                </p>

                <div className="mt-10">
                    <Button size="lg" asChild>
                        <Link href="/login">Acessar plataforma</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
