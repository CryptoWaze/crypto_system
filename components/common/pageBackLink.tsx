'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

type PageBackLinkProps = {
    href: string;
    children: React.ReactNode;
    className?: string;
};

export function PageBackLink({ href, children, className = '' }: PageBackLinkProps) {
    return (
        <Link
            href={href}
            className={`mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${className}`.trim()}
        >
            <ArrowLeft className="size-4" aria-hidden />
            {children}
        </Link>
    );
}
