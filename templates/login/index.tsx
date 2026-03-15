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
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
                <div className="mx-auto w-full max-w-sm">
                    <div className="flex justify-center">
                        <img src="/logo.png" alt="CryptoForense" className="h-12 w-auto sm:h-14" width={180} height={48} />
                    </div>

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
                                className={cn('h-11', errors.email ? 'border-destructive pl-10' : 'pl-10')}
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
                            <Link href="#" className="text-xs text-muted-foreground hover:text-primary hover:underline">
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
                                className={cn('h-11', errors.password ? 'border-destructive pl-10 pr-10' : 'pl-10 pr-10')}
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

                        <Button
                            type="submit"
                            className="mt-6 h-11 w-full rounded-[6px] bg-primary text-primary-foreground hover:bg-primary/90"
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

                    <p className="mt-6 text-center text-xs text-muted-foreground lg:text-left">
                        Acesso restrito a clientes autorizados. Ambiente seguro.
                    </p>
                    <p className="mt-4 text-center text-xs text-muted-foreground lg:text-left">
                        Voltar para a{' '}
                        <Link href="/" className="text-primary hover:text-primary/90 hover:underline">
                            página inicial
                        </Link>
                    </p>
                </div>
            </div>

            <div className="relative hidden min-h-screen overflow-hidden bg-secondary/30 lg:block">
                <img
                    src="/login-panel.jpg"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
            </div>
        </div>
    );
}
