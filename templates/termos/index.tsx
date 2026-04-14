'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/common/appHeader';

export function TermosTemplate() {
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
                        Termos de uso
                    </h1>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">1. Aceitação</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            O uso da plataforma CryptoForense implica a aceitação destes termos. Caso não concorde, não utilize o serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">2. Objeto e uso permitido</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            A plataforma destina-se a rastreio e análise de transações em blockchain para fins de investigação, compliance, perícia e recuperação de ativos. O uso deve ser lícito e em conformidade com a legislação aplicável. É vedado o uso para fins ilícitos ou que violem direitos de terceiros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">3. Conta e responsabilidade</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            O usuário é responsável por manter o sigilo de suas credenciais e por todas as atividades realizadas em sua conta. Os dados e relatórios gerados são de responsabilidade do usuário quanto ao uso e à divulgação.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">4. Disponibilidade e alterações</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            O serviço é oferecido na forma em que se encontra. Podemos alterar funcionalidades ou estes termos, comunicando quando cabível. O uso continuado após alterações constitui aceitação.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold text-foreground">5. Contato</h2>
                        <p className="mt-2 text-sm leading-relaxed text-white/65">
                            Dúvidas sobre estes termos: <a href="/contato" className="text-primary hover:underline">página de contato</a>.
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
