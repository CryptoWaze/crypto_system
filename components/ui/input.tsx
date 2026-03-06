import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-10 w-full min-w-0 rounded-[6px] border bg-transparent px-3 py-2 text-base shadow-xs outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'transition-all duration-200 ease-out',
                'focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_0px_var(--primary),0_0_20px_1px_var(--primary-glow)]',
                'aria-invalid:border-destructive aria-invalid:focus-visible:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_2px_hsl(0_84%_60%)]',
                className,
            )}
            {...props}
        />
    );
}

export { Input };
