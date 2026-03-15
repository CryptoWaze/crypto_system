import Link from 'next/link';

export const metadata = {
    title: 'Privacidade | CryptoForense',
    description: 'Política de privacidade da plataforma CryptoForense.',
};

export default function PrivacidadePage() {
    return (
        <main className="min-h-screen px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Política de privacidade
                </h1>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">1. Dados coletados</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Coletamos: (a) dados de cadastro e login (e-mail, nome quando informado e senha criptografada); (b) dados de uso da plataforma (casos criados, hashes e valores informados, grafos e relatórios gerados, histórico de acessos necessários ao funcionamento do serviço).
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">2. Finalidade</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Os dados são utilizados para prestar o serviço de rastreio e análise on-chain, identificar o usuário, manter a segurança da conta e cumprir obrigações legais. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">3. Retenção</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Mantemos os dados da conta e dos casos enquanto a conta estiver ativa e conforme exigido por lei. Após encerramento da conta, podemos reter dados anonimizados ou necessários a obrigações legais pelo prazo aplicável.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">4. Seus direitos</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Você pode acessar, corrigir ou solicitar a exclusão dos seus dados pessoais, bem como a portabilidade ou a limitação do tratamento, quando aplicável pela lei. Para exercer esses direitos, utilize a <a href="/contato" className="text-primary hover:underline">página de contato</a>. Também pode apresentar reclamação à autoridade de proteção de dados competente.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">5. Segurança</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Adotamos medidas técnicas e organizacionais para proteger os dados (criptografia em trânsito e em repouso, acesso restrito, boas práticas de segurança da informação).
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">6. Contato do responsável</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Para questões sobre privacidade e tratamento de dados: <a href="/contato" className="text-primary hover:underline">página de contato</a>.
                    </p>
                </section>

                <p className="pt-4">
                    <Link href="/" className="text-sm text-primary hover:underline">
                        Voltar à página inicial
                    </Link>
                </p>
            </div>
        </main>
    );
}
