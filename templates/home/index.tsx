import { Hero } from '@/components/landing/hero';
import { GalaxyBackground } from '@/components/landing/galaxy-background';
import { HeroBackgroundGraphs } from '@/components/landing/hero-background-graphs';
import { LandingCapabilities } from '@/components/landing/landing-capabilities';
import { LandingChains } from '@/components/landing/landing-chains';
import { LandingHowItWorks } from '@/components/landing/landing-how-it-works';
import { LandingAudience } from '@/components/landing/landing-audience';
import { LandingFaq } from '@/components/landing/landing-faq';
import { LandingCta } from '@/components/landing/landing-cta';
import { LandingFooter } from '@/components/landing/landing-footer';

export function HomeTemplate() {
    return (
        <main className="relative flex min-h-screen flex-col overflow-x-hidden">
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
                <GalaxyBackground />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-10%,rgba(74,126,217,0.06),transparent_60%)]" />
                <HeroBackgroundGraphs />
            </div>
            <div className="landing-home-content relative z-10">
                <Hero />
                <LandingCapabilities />
                <LandingChains />
                <LandingHowItWorks />
                <LandingAudience />
                <LandingFaq />
                <LandingCta />
                <LandingFooter />
            </div>
        </main>
    );
}
