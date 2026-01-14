import type { Metadata } from "next";
import { Cinzel, Inter } from 'next/font/google';
import "./globals.css";

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
    title: "BANCA DO KERB",
    description: "Sistema de gerenciamento de banca compartilhada",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR" className={`${cinzel.variable} ${inter.variable}`}>
            <body className="antialiased font-sans">
                {children}
            </body>
        </html>
    );
}
