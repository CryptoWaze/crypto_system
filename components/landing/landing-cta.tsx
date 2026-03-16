'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LandingAnimateOnScroll } from './landing-animate-on-scroll';

export function LandingCta() {
    return (
        <section className="relative landing-section" aria-labelledby="cta-heading">
            <LandingAnimateOnScroll className="mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 id="cta-heading" className="landing-animate-in landing-h2">
                    Acesso à plataforma
                </h2>
                <p className="landing-animate-in landing-animate-in-delay-1 mt-4 landing-body-sm">
                    Entre em contato para credenciais ou acesse com sua conta.
                </p>
                <div className="landing-animate-in landing-animate-in-delay-2 mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Button size="lg" className="h-11 rounded-[6px] px-8 bg-primary text-white hover:bg-primary/90" asChild>
                        <Link href="/login">Acessar plataforma</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="h-11 rounded-[6px] px-6" asChild>
                        <Link href="#como-funciona">Ver como funciona</Link>
                    </Button>
                </div>
            </LandingAnimateOnScroll>
        </section>
    );
}
