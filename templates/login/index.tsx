'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useToast } from '@/lib/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loginFormSchema, type LoginFormData } from '@/lib/schemas/login.schema';

const REDIRECT_DELAY_MS = 500;

export function LoginTemplate() {
    const router = useRouter();
    const toast = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = loginFormSchema.safeParse(formData);
        if (!parsed.success) {
            const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
            parsed.error.errors.forEach((err) => {
                const field = err.path[0] as keyof LoginFormData;
                if (field && !fieldErrors[field]) fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            const firstMessage = parsed.error.errors[0]?.message;
            toast.error(firstMessage ?? 'Verifique os campos e tente novamente.');
            return;
        }
        setIsLoading(true);
        try {
            const result = await signIn('credentials', {
                email: parsed.data.email,
                password: parsed.data.password,
                redirect: false,
            });
            if (result?.ok) {
                toast.success('Login realizado com sucesso. Bem-vindo(a)!');
                setTimeout(() => router.push('/dashboard'), REDIRECT_DELAY_MS);
            } else {
                setIsLoading(false);
                toast.error('Email ou senha inválidos. Tente novamente.');
            }
        } catch {
            setIsLoading(false);
            toast.error('Erro inesperado. Tente novamente.');
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
            <div className="mx-auto w-full max-w-sm rounded-2xl border border-border bg-card/80 px-8 py-10 text-center shadow-[0_0_40px_-12px_var(--glow-blue)]">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Plataforma de investigação</p>
                <div className="mt-3 flex justify-center">
                    <img src="/logo.png" alt="CryptoForense" className="h-12 w-auto sm:h-14" width={180} height={48} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">Acesse sua conta</p>

                <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-foreground">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                aria-hidden
                            />
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@exemplo.com"
                                value={formData.email}
                                onChange={(e) => {
                                    setErrors((prev) => ({ ...prev, email: undefined }));
                                    setFormData({ ...formData, email: e.target.value });
                                }}
                                className={cn(errors.email ? 'border-destructive pl-10' : 'pl-10')}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-foreground">
                                Senha
                            </Label>
                            <Link href="#" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                                Esqueceu sua senha?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock
                                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
                                aria-hidden
                            />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => {
                                    setErrors((prev) => ({ ...prev, password: undefined }));
                                    setFormData({ ...formData, password: e.target.value });
                                }}
                                className={cn(errors.password ? 'border-destructive pl-10 pr-10' : 'pl-10 pr-10')}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                tabIndex={-1}
                                aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    <button
                        type="submit"
                        className={cn(
                            'mt-6 h-10 w-full font-medium inline-flex cursor-pointer items-center justify-center gap-2 rounded-[6px] text-sm transition-all disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90',
                        )}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            'Entrar na CryptoForense'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-xs text-muted-foreground">Acesso restrito a usuários autorizados.</p>
            </div>
            <div className="mx-auto mt-6 w-full max-w-sm text-center">
                <p className="mt-2 text-center text-xs text-muted-foreground">
                    Voltar para a{' '}
                    <Link href="/" className="text-primary hover:underline">
                        página inicial
                    </Link>
                </p>
            </div>
        </div>
    );
}
