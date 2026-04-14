'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/common/appHeader';

export function PrivacidadeTemplate() {
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
                <section className="space-y-7 rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(17,19,26,0.8),rgba(10,11,16,0.88))] p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.9)] sm:p-7">
                    <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                        Política de privacidade
                    </h1>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">1. Dados coletados</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Coletamos: (a) dados de cadastro e login (e-mail, nome quando informado e senha criptografada); (b) dados de uso da plataforma (casos criados, hashes e valores informados, grafos e relatórios gerados, histórico de acessos necessários ao funcionamento do serviço).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">2. Finalidade</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Os dados são utilizados para prestar o serviço de rastreio e análise on-chain, identificar o usuário, manter a segurança da conta e cumprir obrigações legais. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">3. Retenção</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Mantemos os dados da conta e dos casos enquanto a conta estiver ativa e conforme exigido por lei. Após encerramento da conta, podemos reter dados anonimizados ou necessários a obrigações legais pelo prazo aplicável.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">4. Seus direitos</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Você pode acessar, corrigir ou solicitar a exclusão dos seus dados pessoais, bem como a portabilidade ou a limitação do tratamento, quando aplicável pela lei. Para exercer esses direitos, utilize a <a href="/contato" className="text-primary hover:underline">página de contato</a>. Também pode apresentar reclamação à autoridade de proteção de dados competente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">5. Segurança</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Adotamos medidas técnicas e organizacionais para proteger os dados (criptografia em trânsito e em repouso, acesso restrito, boas práticas de segurança da informação).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">6. Contato do responsável</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Para questões sobre privacidade e tratamento de dados: <a href="/contato" className="text-primary hover:underline">página de contato</a>.
                        </p>
                    </section>

                    <p className="pt-2">
                        <Link href="/dashboard" className="text-sm text-primary hover:underline">
                            Voltar ao dashboard
                        </Link>
                    </p>
                </section>
            </main>
        </div>
    );
}
