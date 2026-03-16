import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalaxyBackground } from './galaxy-background';

export function Hero() {
    return (
        <section
            className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-24"
            aria-labelledby="hero-heading"
        >
            <GalaxyBackground />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(74,126,217,0.05),transparent_50%)]" aria-hidden />
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <div className="landing-animate-in landing-animate-in-delay-1 flex justify-center">
                    <img src="/logo.png" alt="CryptoForense" className="h-20 w-auto sm:h-24 md:h-28" width={360} height={120} />
                </div>
                <h1 id="hero-heading" className="landing-animate-in landing-animate-in-delay-2 mt-6 text-2xl font-bold">
                    Inteligência on-chain para investigação e compliance
                </h1>
                <p className="landing-animate-in landing-animate-in-delay-3 mt-4 landing-body mx-auto max-w-[70ch]">
                    Rastrear fluxo de fundos em blockchain é complexo. Nós entregamos o grafo e o relatório prontos para processos, perícias e
                    recuperação de ativos.
                </p>
                <div className="landing-animate-in landing-animate-in-delay-4 mt-10">
                    <Button size="lg" className="h-11 rounded-[6px] px-8 shadow-[0_0_24px_-4px_var(--glow-blue)] hover:bg-primary/90" asChild>
                        <Link href="/login">Acessar plataforma</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
