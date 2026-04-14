'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useToast } from '@/lib/toast-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loginFormSchema, type LoginFormData } from '@/lib/schemas/login.schema';
import { LoginCoinsVault } from '@/components/login/LoginCoinsVault';

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
        <div className="relative min-h-screen overflow-hidden bg-[#090b12] text-foreground">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_10%,rgba(74,126,217,0.16),transparent_58%),radial-gradient(ellipse_80%_65%_at_75%_90%,rgba(99,102,241,0.12),transparent_62%)]" />
            <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_0.95fr]">
                <div className="relative flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16">
                    <div className="pointer-events-none absolute left-[12%] top-[18%] h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
                    <div className="mx-auto w-full max-w-md">
                        <span className="inline-flex items-center rounded-full border border-primary/25 bg-primary/8 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary/90 sm:text-xs">
                            ACESSO RESTRITO
                        </span>
                        <div className="mt-5">
                            <img src="/logo.png" alt="CryptoForense" className="h-12 w-auto sm:h-14" width={180} height={48} />
                        </div>
                        <h1 className="mt-5 text-balance font-serif text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                            Entre na plataforma de inteligência on-chain
                        </h1>
                        <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-base">
                            Ambiente seguro para rastreio de fluxo, investigações e geração de evidências técnicas.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-white/10 bg-[#0f131d]/78 p-5 backdrop-blur-sm sm:p-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-foreground/90">
                                    Email
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="m@exemplo.com"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setErrors((prev) => ({ ...prev, email: undefined }));
                                            setFormData({ ...formData, email: e.target.value });
                                        }}
                                        className={cn(
                                            'h-11 border-white/12 bg-[#0b0e16] text-white placeholder:text-white/40 focus-visible:ring-primary/45',
                                            errors.email ? 'border-destructive pl-10' : 'pl-10',
                                        )}
                                        disabled={isLoading}
                                    />
                                </div>
                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-foreground/90">
                                        Senha
                                    </Label>
                                    <Link href="#" className="text-xs text-muted-foreground hover:text-primary hover:underline">
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => {
                                            setErrors((prev) => ({ ...prev, password: undefined }));
                                            setFormData({ ...formData, password: e.target.value });
                                        }}
                                        className={cn(
                                            'h-11 border-white/12 bg-[#0b0e16] text-white placeholder:text-white/40 focus-visible:ring-primary/45',
                                            errors.password ? 'border-destructive pl-10 pr-10' : 'pl-10 pr-10',
                                        )}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                                        tabIndex={-1}
                                        aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 h-11 w-full rounded-[8px] border border-primary/30 bg-primary text-white shadow-[0_0_28px_-8px_rgba(74,126,217,0.7)] transition-all duration-300 hover:bg-primary/90 hover:shadow-[0_0_36px_-8px_rgba(74,126,217,0.9)]"
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
                            </Button>
                        </form>

                        <div className="mt-5 space-y-3 text-xs text-muted-foreground">
                            <p className="inline-flex items-center gap-2 text-white/65">
                                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden />
                                Acesso restrito a clientes autorizados. Ambiente seguro.
                            </p>
                            <p>
                                <Link href="/" className="inline-flex items-center gap-1 text-primary/90 transition-colors hover:text-primary hover:underline">
                                    <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
                                    Voltar para a página inicial
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="relative hidden min-h-screen lg:flex lg:items-center lg:justify-center">
                    <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(74,126,217,0.14),transparent_70%)]" />
                    <LoginCoinsVault />
                </div>
            </div>
        </div>
    );
}
