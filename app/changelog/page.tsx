import Link from 'next/link';

export const metadata = {
    title: 'Novidades | CryptoForense',
    description: 'Changelog e últimas atualizações da plataforma CryptoForense.',
};

const CHANGELOG_ENTRIES = [
    {
        date: '2025-03-14',
        title: 'Suporte a múltiplas blockchains',
        description: 'Rastreio disponível em Ethereum, BSC, Polygon, Arbitrum, Base e Avalanche. Novas chains integradas conforme demanda.',
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
];

function formatDate(iso: string) {
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch {
        return iso;
    }
}

export default function ChangelogPage() {
    return (
        <main className="min-h-screen px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Novidades
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Últimas atualizações e melhorias da plataforma.
                </p>

                <ul className="mt-10 space-y-8 border-l-2 border-border pl-6 sm:pl-8">
                    {CHANGELOG_ENTRIES.map((entry, i) => (
                        <li key={i} className="relative pl-0">
                            <span className="absolute -left-[1.625rem] top-1.5 flex h-3 w-3 rounded-full border-2 border-background bg-primary sm:-left-8" aria-hidden />
                            <time className="text-xs font-medium text-muted-foreground" dateTime={entry.date}>
                                {formatDate(entry.date)}
                            </time>
                            <h2 className="mt-1 font-semibold text-foreground">{entry.title}</h2>
                            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                {entry.description}
                            </p>
                        </li>
                    ))}
                </ul>

                <p className="mt-12">
                    <Link href="/" className="text-sm text-primary hover:underline">
                        Voltar à página inicial
                    </Link>
                </p>
            </div>
        </main>
    );
}
