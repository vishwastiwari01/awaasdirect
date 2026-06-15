'use client';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';

export function Footer() {
    const cols = [
        {
            title: 'Discover',
            links: [
                { label: 'Buy a Home', href: '/properties?transactionType=SALE' },
                { label: 'Rent a Flat', href: '/properties?transactionType=RENT' },
                { label: 'Buy a Plot', href: '/properties?type=PLOT' },
                { label: 'Commercial', href: '/properties?type=COMMERCIAL' },
                { label: 'PG / Hostel', href: '/properties?type=PG' },
                { label: 'New Projects', href: '/properties' },
            ],
        },
        {
            title: 'AI Tools',
            links: [
                { label: 'AI Floor Plan', href: '/ai-planner' },
                { label: '3D Virtual Tour', href: '/properties' },
                { label: 'AI Property Search', href: '/properties' },
                { label: 'Price Trends', href: '/' },
                { label: 'EMI Calculator', href: '/' },
                { label: 'Locality Report', href: '/' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/' },
                { label: 'How it Works', href: '/' },
                { label: 'RERA Compliance', href: '/' },
                { label: 'Careers', href: '/' },
                { label: 'Privacy Policy', href: '/' },
                { label: 'Terms of Use', href: '/' },
            ],
        },
    ];

    return (
        <footer className="bg-[#1A1A1A] text-white/60">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="mb-6">
                            <BrandLogo />
                        </div>
                        <p className="text-sm leading-relaxed text-white/45 max-w-[280px] mb-5">
                            India&apos;s broker-free property marketplace. Verified owners, RERA-listed properties, zero commission.
                        </p>
                        <div className="flex gap-2 flex-wrap">
                            {['RERA', 'AADHAAR', 'DPDP ACT', 'ISO 27001'].map(b => (
                                <span key={b} className="bg-white/5 border border-white/10 rounded-md px-2.5 py-1 text-[9px] font-mono text-white/45 tracking-wider">{b}</span>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(({ title, links }) => (
                        <div key={title}>
                            <h4 className="text-xs font-bold text-white tracking-widest mb-4 uppercase font-mono">{title}</h4>
                            {links.map(({ label, href }) => (
                                <Link key={label} href={href}
                                    className="block text-sm text-white/45 mb-2.5 hover:text-[#52B788] transition-colors">
                                    {label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">© 2026 My Awaas Technologies Pvt. Ltd. · Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India</span>
                    <div className="flex gap-6 flex-wrap justify-center">
                        {['Privacy', 'Terms', 'Grievance Officer', 'Sitemap'].map(l => (
                            <Link key={l} href="/" className="hover:text-[#52B788] transition-colors">{l}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
