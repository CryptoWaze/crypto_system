'use client';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

type LandingAnimateOnScrollProps = {
    children: React.ReactNode;
    className?: string;
};

export function LandingAnimateOnScroll({ children, className }: LandingAnimateOnScrollProps) {
    const { ref, isInView } = useInView({ triggerOnce: true });

    return (
        <div
            ref={ref}
            className={cn('landing-animate-on-scroll', isInView && 'landing-in-view', className)}
        >
            {children}
        </div>
    );
}
