import Link from 'next/link';

const CURRENT_YEAR = new Date().getFullYear();

export function LandingFooter() {
    return (
        <footer className="border-t border-border/60 bg-background/80 py-8" role="contentinfo">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="flex flex-col gap-8">
                    <div className="rounded-lg border border-border/60 bg-card/30 px-4 py-5 sm:px-6">
                        <h3 className="text-sm font-semibold text-foreground">Segurança</h3>
                        <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-1">
                            <li>Dados criptografados em trânsito e em repouso</li>
                            <li>Acesso restrito a usuários autorizados</li>
                            <li>Sem compartilhamento de dados com terceiros</li>
                        </ul>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <p className="text-center text-sm text-muted-foreground sm:text-left">
                            CryptoForense. Rede de inteligência on-chain. {CURRENT_YEAR}.
                        </p>
                        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8" aria-label="Rodapé">
                            <Link
                                href="/login"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                Acesso à plataforma
                            </Link>
                            <Link
                                href="/contato"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                Contato
                            </Link>
                            <Link
                                href="/changelog"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                Novidades
                            </Link>
                            <Link
                                href="/termos"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                Termos de uso
                            </Link>
                            <Link
                                href="/privacidade"
                                className="text-sm text-muted-foreground hover:text-primary hover:underline"
                            >
                                Privacidade
                            </Link>
                        </nav>
                    </div>
                </div>
            </div>
        </footer>
    );
}
