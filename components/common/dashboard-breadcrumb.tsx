'use client';

import Link from 'next/link';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export type BreadcrumbItemType = {
    label: string;
    href?: string;
};

type DashboardBreadcrumbProps = {
    items: BreadcrumbItemType[];
};

export function DashboardBreadcrumb({ items }: DashboardBreadcrumbProps) {
    if (items.length === 0) return null;

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, i) => (
                    <span key={i} className="contents">
                        {i > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.href ? (
                                <BreadcrumbLink asChild>
                                    <Link href={item.href}>{item.label}</Link>
                                </BreadcrumbLink>
                            ) : (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            )}
                        </BreadcrumbItem>
                    </span>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
