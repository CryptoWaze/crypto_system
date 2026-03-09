import type { NextAuthOptions } from 'next-auth';
import { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { UserResponse } from '@/lib/types/auth';

function getApiUrlServer(path: string): string {
    const base = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;
                const url = getApiUrlServer('/users/login');
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: credentials.email.trim().toLowerCase(),
                        password: credentials.password,
                    }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok) return null;
                if (!data.id || !data.accessToken) return null;
                return data as UserResponse;
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60,
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const u = user as UserResponse;
                token.id = u.id;
                token.email = u.email;
                token.name = u.name;
                token.createdAt = u.createdAt;
                token.accessToken = u.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user = {
                    id: token.id,
                    email: token.email ?? '',
                    name: token.name ?? null,
                    createdAt: token.createdAt ?? '',
                    accessToken: token.accessToken ?? '',
                };
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
};

export function getSession() {
    return getServerSession(authOptions);
}
