import Link from 'next/link';

export const metadata = {
    title: 'Termos de uso | CryptoForense',
    description: 'Termos de uso da plataforma CryptoForense.',
};

export default function TermosPage() {
    return (
        <main className="min-h-screen px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-3xl space-y-8">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Termos de uso
                </h1>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">1. Aceitação</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        O uso da plataforma CryptoForense implica a aceitação destes termos. Caso não concorde, não utilize o serviço.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">2. Objeto e uso permitido</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        A plataforma destina-se a rastreio e análise de transações em blockchain para fins de investigação, compliance, perícia e recuperação de ativos. O uso deve ser lícito e em conformidade com a legislação aplicável. É vedado o uso para fins ilícitos ou que violem direitos de terceiros.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">3. Conta e responsabilidade</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        O usuário é responsável por manter o sigilo de suas credenciais e por todas as atividades realizadas em sua conta. Os dados e relatórios gerados são de responsabilidade do usuário quanto ao uso e à divulgação.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">4. Disponibilidade e alterações</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        O serviço é oferecido na forma em que se encontra. Podemos alterar funcionalidades ou estes termos, comunicando quando cabível. O uso continuado após alterações constitui aceitação.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-foreground">5. Contato</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        Dúvidas sobre estes termos: <a href="/contato" className="text-primary hover:underline">página de contato</a>.
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
