import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { QueryProvider } from '@/lib/query-provider';
import './globals.css';

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const dmSans = DM_Sans({
    subsets: ['latin'],
    variable: '--font-dm-sans',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'AwaasDirect — India\'s Direct Housing Marketplace',
    description: 'Buy or rent verified properties directly from owners. No brokers. No commissions. AI-powered virtual tours and floor plans.',
    keywords: 'real estate India, buy property, rent flat, no broker, RERA verified, Bangalore, Hyderabad, Mumbai',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
            <body className="font-sans">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
