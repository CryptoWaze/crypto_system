'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/lib/toast-context';
import { Loader2 } from 'lucide-react';
import { AppHeader } from '@/components/common/appHeader';

const CONTACT_EMAIL = 'contato@cryptoforense.com.br';

export function ContatoTemplate() {
    const router = useRouter();
    const { status } = useSession();
    const toast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/login');
    }, [status, router]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent(`Contato CryptoForense - ${name}`);
        const body = encodeURIComponent(
            `${message}\n\n--\nEnviado por: ${name}\nE-mail: ${email}`
        );
        setIsSubmitting(true);
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        toast.success('Seu cliente de e-mail foi aberto. Envie a mensagem para entrar em contato.');
        setIsSubmitting(false);
    };

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
            <main className="relative mx-auto max-w-lg px-4 py-8 sm:px-6 sm:py-10">
                <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Contato
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Preencha os campos abaixo. Ao enviar, seu cliente de e-mail será aberto com a mensagem pronta para você nos enviar.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="contact-name">Nome</Label>
                        <Input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Seu nome"
                            className="h-11"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-email">E-mail</Label>
                        <Input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            className="h-11"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact-message">Mensagem</Label>
                        <Textarea
                            id="contact-message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Como podemos ajudar?"
                            rows={5}
                            className="min-h-[120px] resize-y"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                        <Button type="submit" className="h-11 rounded-[6px] px-6" disabled={isSubmitting}>
                            Abrir e-mail para enviar
                        </Button>
                        <Button type="button" variant="outline" className="h-11 rounded-[6px] px-6" asChild>
                            <Link href="/">Voltar à página inicial</Link>
                        </Button>
                    </div>
                </form>

                <p className="mt-8 text-sm text-muted-foreground">
                    Ou envie diretamente para{' '}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
                        {CONTACT_EMAIL}
                    </a>
                    .
                </p>
            </main>
        </div>
    );
}
