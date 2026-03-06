'use client';

type PageHeaderProps = {
    title: string;
    description?: string;
    className?: string;
};

export function PageHeader({ title, description, className = '' }: PageHeaderProps) {
    return (
        <header className={className.trim()}>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {title}
            </h1>
            {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                </p>
            )}
        </header>
    );
}
