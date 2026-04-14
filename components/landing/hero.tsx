import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LandingStats } from './landing-stats';
import { LandingChainsCarousel } from './landing-chains-carousel';

export function Hero() {
    return (
        <section
            className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-6 py-24 sm:py-28"
            aria-labelledby="hero-heading"
        >
            <div className="relative z-10 mx-auto max-w-5xl text-center">
                <div className="pointer-events-none absolute left-1/2 top-2 h-32 w-104 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(74,126,217,0.2),transparent_70%)] blur-2xl" />
                <div className="landing-animate-in landing-animate-in-delay-1 flex justify-center">
                    <img src="/logo.png" alt="CryptoForense" className="h-20 w-auto sm:h-24 md:h-28" width={360} height={120} />
                </div>
                <div className="landing-animate-in landing-animate-in-delay-2 mt-6 flex justify-center">
                    <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-4 py-1 text-[10px] font-semibold tracking-[0.18em] text-primary/85 sm:text-xs">
                        PLATAFORMA FORENSE ON-CHAIN
                    </span>
                </div>
                <h1 id="hero-heading" className="landing-animate-in landing-animate-in-delay-3 mt-6 text-balance landing-h1 text-[2rem] font-semibold text-foreground sm:text-[2.45rem] md:text-[2.8rem]">
                    Inteligência on-chain para investigação e compliance
                </h1>
                <p className="landing-animate-in landing-animate-in-delay-4 mx-auto mt-5 max-w-[72ch] landing-body text-white/72">
                    Rastrear fluxo de fundos em blockchain é complexo. Nós entregamos o grafo e o relatório prontos para processos, perícias e
                    recuperação de ativos.
                </p>
                <div className="landing-animate-in landing-animate-in-delay-5 mt-10">
                    <Button
                        size="lg"
                        className="h-12 rounded-[8px] border border-primary/35 bg-primary px-8 text-white shadow-[0_0_34px_-8px_rgba(74,126,217,0.7)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_40px_-6px_rgba(74,126,217,0.9)]"
                        asChild
                    >
                        <Link href="/login" className="inline-flex items-center">
                            Acessar plataforma
                            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                        </Link>
                    </Button>
                </div>
            </div>
            <div className="relative z-10 mt-16 w-full sm:mt-20">
                <LandingStats embedded />
                <LandingChainsCarousel embedded />
            </div>
        </section>
    );
}
