import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustBar } from '@/components/home/TrustBar';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { FeaturedListings } from '@/components/home/FeaturedListings';
import { AIPlannerTeaser } from '@/components/home/AIPlannerTeaser';
import { HowItWorks } from '@/components/home/HowItWorks';
import { CTASection } from '@/components/home/CTASection';

export const metadata: Metadata = {
    title: 'AwaasDirect — India\'s Direct Housing Marketplace',
    description: 'Buy or rent verified properties directly from owners. No brokers. No commissions. AI-powered virtual tours and floor plans.',
};

export default function HomePage() {
    return (
        <>
            <Navbar />
            <main>
                <HeroSection />
                <TrustBar />
                <CategoriesSection />
                <FeaturedListings />
                <AIPlannerTeaser />
                <HowItWorks />
                <CTASection />
            </main>
            <Footer />
        </>
    );
}
