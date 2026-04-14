import Link from 'next/link';
import { Mail, ShieldCheck, FileText, ArrowUpRight } from 'lucide-react';

const CURRENT_YEAR = new Date().getFullYear();

export function LandingFooter() {
    return (
        <footer className="relative pt-3 pb-8 sm:pt-4" role="contentinfo" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(10,10,12,0.82) 32%)' }}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1118]/78 backdrop-blur-sm">
                    <div className="grid gap-8 border-b border-white/8 px-6 py-7 sm:px-8 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                        <div>
                            <Link href="/" className="inline-flex items-center" aria-label="CryptoForense - inicio">
                                <img src="/logo.png" alt="CryptoForense" className="h-10 w-auto" width={156} height={40} />
                            </Link>
                            <p className="mt-4 max-w-[36ch] text-sm leading-relaxed text-white/70">
                                Plataforma de inteligencia on-chain para rastreio de fluxo de fundos, suporte pericial e producao de evidencias tecnicas.
                            </p>
                            <div className="mt-4 inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/8 px-3 py-2 text-xs text-primary/85">
                                <ShieldCheck className="h-4 w-4" aria-hidden />
                                Ambiente com foco em seguranca e confidencialidade
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/80">Produto</h3>
                            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Links de produto">
                                <Link href="/login" className="footer-link-modern">
                                    Acesso a plataforma
                                </Link>
                                <Link href="#como-funciona" className="footer-link-modern">
                                    Como funciona
                                </Link>
                                <Link href="/changelog" className="footer-link-modern">
                                    Novidades
                                </Link>
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/80">Institucional</h3>
                            <nav className="mt-4 flex flex-col gap-2.5" aria-label="Links institucionais">
                                <Link href="/contato" className="footer-link-modern">
                                    Contato
                                </Link>
                                <Link href="/termos" className="footer-link-modern">
                                    Termos de uso
                                </Link>
                                <Link href="/privacidade" className="footer-link-modern">
                                    Privacidade
                                </Link>
                            </nav>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/80">Suporte</h3>
                            <div className="mt-4 space-y-3 text-sm text-white/70">
                                <p className="inline-flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                                    contato@cryptoforense.com
                                </p>
                                <p className="inline-flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-primary" aria-hidden />
                                    Documentacao e trilhas de investigacao
                                </p>
                                <Link href="/contato" className="inline-flex items-center gap-1 text-primary/90 hover:text-primary">
                                    Falar com especialista
                                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8">
                        <p className="text-white/55">
                            © {CURRENT_YEAR} CryptoForense. Todos os direitos reservados.
                        </p>
                        <p className="text-white/45">Rastreio on-chain para inteligencia juridica, compliance e recuperacao de ativos.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
