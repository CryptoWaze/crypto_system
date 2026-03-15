import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Source_Serif_4 } from 'next/font/google';

import { ToastProvider } from '@/lib/toast-context';
import { SessionProvider } from '@/components/providers/SessionProvider';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const sourceSerif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif-display',
});

export const metadata: Metadata = {
    title: 'CryptoForense | Rede de Inteligência On-Chain',
    description: 'Rastreio e análise de transações em blockchain. Múltiplas chains, milhares de tokens. Investigação, compliance e recuperação de ativos.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark" suppressHydrationWarning>
            <body className={`${geist.className} ${sourceSerif.variable} font-sans antialiased`} suppressHydrationWarning>
                <SessionProvider>
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
