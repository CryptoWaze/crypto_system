'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/common/appHeader';

const CHANGELOG_ENTRIES = [
    {
        date: '2025-03-14',
        title: 'Suporte a múltiplas blockchains',
        description: 'Rastreio disponível em Ethereum, BSC, Polygon, Arbitrum, Avalanche, Bitcoin e Solana. Novas chains integradas conforme demanda.',
    },
    {
        date: '2025-03-14',
        title: 'Exportação de relatórios',
        description: 'Exporte relatórios técnicos do caso para uso em processos, laudos periciais e recuperação de ativos.',
    },
    {
        date: '2025-03-14',
        title: 'Grafo editável',
        description: 'Edição de nomes e posições dos nós do grafo, além de exclusão lógica de transações para ajuste da visualização.',
    },
    {
        date: '2025-03-14',
        title: 'AutoTrack em tempo real',
        description: 'Criação de casos com múltiplas transações e acompanhamento do rastreio em tempo real via notificações.',
    },
] as const;

function formatDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return iso;
    }
}

export function ChangelogTemplate() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#090b12]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
                <p className="mt-4 text-sm text-muted-foreground">Carregando...</p>
            </div>
        );
    }
    if (status === 'unauthenticated') return null;

    return (
        <div className="relative min-h-screen w-full overflow-auto bg-[#090b12]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_10%,rgba(74,126,217,0.14),transparent_58%),radial-gradient(ellipse_70%_55%_at_80%_90%,rgba(99,102,241,0.12),transparent_62%)]" />
            <AppHeader />
            <div className="h-14 shrink-0" aria-hidden />
            <main className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
                <section className="rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.8),rgba(10,11,16,0.88))] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:p-7">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Novidades
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-white/65">
                        Últimas atualizações e melhorias da plataforma.
                    </p>

                    <ul className="mt-8 space-y-7 border-l border-white/14 pl-5 sm:pl-6">
                        {CHANGELOG_ENTRIES.map((entry, i) => (
                            <li key={i} className="relative">
                                <span className="absolute -left-5 top-1.5 flex h-3 w-3 rounded-full border border-[#090b12] bg-primary sm:-left-6" aria-hidden />
                                <time className="text-xs font-medium text-white/50" dateTime={entry.date}>
                                    {formatDate(entry.date)}
                                </time>
                                <h2 className="mt-1 font-semibold text-foreground">{entry.title}</h2>
                                <p className="mt-1 text-sm leading-relaxed text-white/65">
                                    {entry.description}
                                </p>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-10">
                        <Link href="/dashboard" className="text-sm text-primary hover:underline">
                            Voltar ao dashboard
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}
