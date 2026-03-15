'use client';

import Link from 'next/link';
import { FileText, Mail, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

const TIP = {
    title: 'Para começar',
    text: 'Use Novo rastreio para informar o hash da transação e o valor. O sistema mapeia o fluxo até o destino e gera o grafo e relatórios.',
};

const RESOURCES = [
    {
        title: 'Novidades',
        description: 'Veja o que mudou na plataforma.',
        href: '/changelog',
        icon: Sparkles,
    },
    {
        title: 'Contato',
        description: 'Dúvidas ou suporte.',
        href: '/contato',
        icon: Mail,
    },
    {
        title: 'Termos de uso',
        description: 'Condições de uso do serviço.',
        href: '/termos',
        icon: FileText,
    },
    {
        title: 'Privacidade',
        description: 'Como tratamos seus dados.',
        href: '/privacidade',
        icon: BookOpen,
    },
] as const;

export function DashboardResources() {
    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">{TIP.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{TIP.text}</p>
                    </div>
                </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-card/30 p-4">
                <h3 className="text-sm font-semibold text-foreground">Recursos</h3>
            <ul className="mt-3 space-y-2">
                {RESOURCES.map((item, i) => (
                    <li key={i}>
                        <Link
                            href={item.href}
                            className="flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted/50"
                        >
                            <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                            <div>
                                <span className="font-medium text-foreground hover:text-primary hover:underline">
                                    {item.title}
                                </span>
                                <p className="text-xs text-muted-foreground">{item.description}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
            </div>
        </div>
    );
}
