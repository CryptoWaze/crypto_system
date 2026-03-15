'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/lib/toast-context';

const CONTACT_EMAIL = 'contato@cryptoforense.com.br';

export function ContatoTemplate() {
    const toast = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    return (
        <main className="min-h-screen px-4 py-16 sm:px-6">
            <div className="mx-auto max-w-lg">
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
            </div>
        </main>
    );
}
