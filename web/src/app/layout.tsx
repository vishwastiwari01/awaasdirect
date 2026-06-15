import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'My Awaas — India\'s Direct Property Marketplace',
    description: 'Buy, sell or rent verified properties directly from owners on My Awaas. No brokers, no commissions. Find your perfect home in India.',
    keywords: 'my awaas, real estate India, buy property, rent flat, no broker, RERA verified, Bangalore, Hyderabad, Mumbai, Delhi',
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
            <body className="font-sans">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
