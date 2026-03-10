'use client';
import Link from 'next/link';
import { useState } from 'react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import type { PropertyCardData } from '@/components/properties/PropertyCard';

const SAMPLE: PropertyCardData[] = [
    { id: 'p1', title: '3 BHK Premium Apartment in Whitefield', type: 'APARTMENT', transactionType: 'SALE', city: 'Bangalore', locality: 'Whitefield', bhk: 3, sqft: 1850, price: 12500000, verification: { reraStatus: 'VERIFIED' }, owner: { name: 'Suresh Reddy', aadhaarVerified: true }, virtualTour: { status: 'READY' } },
    { id: 'p2', title: '2 BHK Fully Furnished Flat — Rent', type: 'APARTMENT', transactionType: 'RENT', city: 'Bangalore', locality: 'Indiranagar', bhk: 2, sqft: 1100, price: 38000, verification: null, owner: { name: 'Priya Sharma', aadhaarVerified: true } },
    { id: 'p3', title: '4 BHK Independent Villa — Sarjapur', type: 'VILLA', transactionType: 'SALE', city: 'Bangalore', locality: 'Sarjapur Road', bhk: 4, sqft: 3200, price: 28000000, verification: { reraStatus: 'VERIFIED' }, owner: { name: 'Rajesh Nair', aadhaarVerified: true } },
    { id: 'p4', title: '3 BHK Flat in Gachibowli', type: 'APARTMENT', transactionType: 'SALE', city: 'Hyderabad', locality: 'Gachibowli', bhk: 3, sqft: 1980, price: 13200000, verification: { reraStatus: 'VERIFIED' }, owner: { name: 'Mohammed Iqbal', aadhaarVerified: true }, virtualTour: { status: 'READY' } },
    { id: 'p5', title: '2 BHK Rent Near Hitech City', type: 'APARTMENT', transactionType: 'RENT', city: 'Hyderabad', locality: 'Madhapur', bhk: 2, sqft: 1050, price: 32000, owner: { name: 'Sunita Kulkarni', aadhaarVerified: true } },
    { id: 'p6', title: '2 BHK Sea-View Apartment — Worli', type: 'APARTMENT', transactionType: 'SALE', city: 'Mumbai', locality: 'Worli', bhk: 2, sqft: 1250, price: 45000000, verification: { reraStatus: 'VERIFIED' }, owner: { name: 'Priya Sharma', aadhaarVerified: true } },
];

const FILTERS = ['All', 'Sale', 'Rent', 'Bangalore', 'Hyderabad', 'Mumbai'];

export function FeaturedListings() {
    const [active, setActive] = useState('All');

    const filtered = SAMPLE.filter(p => {
        if (active === 'All') return true;
        if (active === 'Sale') return p.transactionType === 'SALE';
        if (active === 'Rent') return p.transactionType === 'RENT';
        return p.city === active;
    });

    return (
        <section className="bg-[#FDFAF6] px-6 lg:px-20 pb-24">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="block text-xs font-medium tracking-widest uppercase text-[#52B788] mb-3">Featured Listings</span>
                    <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Hand-Picked Properties
                    </h2>
                </div>
                <Link href="/properties" className="text-sm font-semibold text-[#1B4332] border-2 border-[#1B4332] px-5 py-2 rounded-xl hover:bg-[#1B4332] hover:text-white transition-all">
                    View All →
                </Link>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 mb-8 flex-wrap">
                {FILTERS.map(f => (
                    <button key={f} onClick={() => setActive(f)}
                        className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${active === f
                                ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#1B4332] hover:text-[#1B4332]'
                            }`}>
                        {f}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
            </div>
        </section>
    );
}
