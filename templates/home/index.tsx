import Link from 'next/link';
import { Hero } from '@/components/landing/hero';
import { LandingStats } from '@/components/landing/landing-stats';
import { LandingChainsCarousel } from '@/components/landing/landing-chains-carousel';
import { LandingCapabilities } from '@/components/landing/landing-capabilities';
import { LandingChains } from '@/components/landing/landing-chains';
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works';
import { LandingAudience } from '@/components/landing/landing-audience';
import { LandingFaq } from '@/components/landing/landing-faq';
import { LandingCta } from '@/components/landing/landing-cta';
import { LandingFooter } from '@/components/landing/landing-footer';
import { Button } from '@/components/ui/button';

export function HomeTemplate() {
    return (
        <main className="flex min-h-screen flex-col">
            <header
                className="fixed inset-x-0 top-0 z-20 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6"
                style={{ boxShadow: '0 1px 0 0 rgba(74, 126, 217, 0.06)' }}
            >
                <Link href="/" className="flex shrink-0 items-center" aria-label="CryptoForense - início">
                    <img src="/logo.png" alt="CryptoForense" className="h-8 w-auto sm:h-9" width={140} height={36} />
                </Link>
                <nav className="flex items-center gap-1 sm:gap-2" aria-label="Navegação principal">
                    <Button variant="ghost" size="sm" asChild className="h-10 rounded-[6px] px-3 sm:px-4">
                        <Link href="/dashboard/rastreio/novo">AutoTrack</Link>
                    </Button>
                    <div className="mx-1 h-6 w-px bg-border" aria-hidden />
                    <Button size="sm" asChild className="h-10 rounded-[6px] bg-primary px-3 text-primary-foreground hover:bg-primary/90 sm:px-4">
                        <Link href="/login">Entrar</Link>
                    </Button>
                </nav>
            </header>
            <div className="h-14 shrink-0" aria-hidden />
            <Hero />
            <LandingStats />
            <LandingChainsCarousel />
            <LandingCapabilities />
            <LandingChains />
            <LandingHowItWorks />
            <LandingAudience />
            <LandingFaq />
            <LandingCta />
            <LandingFooter />
        </main>
    );
}
