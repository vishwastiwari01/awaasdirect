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
    title: 'My Awaas — Find Homes to Buy & Rent in India',
    description: 'Search verified properties for rent and sale across India. Connect directly with owners. Zero broker fees on My Awaas.',
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
