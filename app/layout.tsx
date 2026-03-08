import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { Source_Serif_4 } from 'next/font/google';

import { ToastProvider } from '@/lib/toast-context';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const sourceSerif = Source_Serif_4({
    subsets: ['latin'],
    variable: '--font-serif-display',
});

export const metadata: Metadata = {
    title: 'CryptoForense | Rastreio de Transações em Blockchain',
    description: 'Plataforma de rastreio de transações em blockchain para investigação e identificação de destinos.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className="dark">
            <body className={`${geist.className} ${sourceSerif.variable} font-sans antialiased`}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </body>
        </html>
    );
}
