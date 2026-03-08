import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalaxyBackground } from './galaxy-background';

export function Hero() {
    return (
        <section className="relative flex h-full min-h-0 flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16">
            <GalaxyBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(91,141,239,0.05),transparent_50%)]" aria-hidden />
            <div className="relative z-10 mx-auto max-w-3xl text-center">
                <div className="flex justify-center">
                    <img src="/logo.png" alt="CryptoForense" className="h-21 w-auto sm:h-24 md:h-28" width={360} height={120} />
                </div>
                <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
                    Rastreio de transações em blockchain para investigação de fraudes e perdas.ß
                </p>
                <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">
                    Identifique o destino de valores em criptoativos e obtenha suporte técnico para casos jurídicos e recuperação de ativos.
                </p>

                <div className="mt-10">
                    <Button size="lg" className="shadow-[0_0_24px_-4px_var(--glow-blue)]" asChild>
                        <Link href="/login">Acessar plataforma</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
