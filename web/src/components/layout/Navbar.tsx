'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100'
                : 'bg-white/80 backdrop-blur-md'
            }`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-[#1B4332] rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Awaas<span className="text-[#E07B39]">Direct</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-7">
                    {[
                        { label: 'Buy', href: '/properties?transactionType=SALE' },
                        { label: 'Rent', href: '/properties?transactionType=RENT' },
                        { label: 'Properties', href: '/properties' },
                        { label: '✨ AI Planner', href: '/ai-planner' },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href}
                            className="text-sm font-medium text-gray-600 hover:text-[#1B4332] transition-colors">
                            {label}
                        </Link>
                    ))}
                    {isAuthenticated && user?.role === 'OWNER' && (
                        <Link href="/dashboard"
                            className="text-sm font-medium text-gray-600 hover:text-[#1B4332] transition-colors">
                            Dashboard
                        </Link>
                    )}
                </div>

                {/* Right actions */}
                <div className="hidden md:flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2 text-sm font-semibold text-[#1B4332] bg-[#D8F3DC] px-3 py-1.5 rounded-full">
                                <div className="w-6 h-6 bg-[#1B4332] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {(user?.name ?? 'U').charAt(0).toUpperCase()}
                                </div>
                                {user?.name?.split(' ')[0]}
                            </div>
                            <button
                                onClick={() => { logout(); window.location.href = '/'; }}
                                className="text-sm font-semibold text-gray-600 border-2 border-gray-200 px-4 py-2 rounded-xl hover:border-gray-300 transition-all">
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/dashboard/list-property"
                                className="text-sm font-semibold text-[#1B4332] border-2 border-[#1B4332] px-4 py-2 rounded-xl hover:bg-[#1B4332] hover:text-white transition-all duration-200">
                                List Property Free
                            </Link>
                            <Link href="/login"
                                className="text-sm font-semibold bg-[#1B4332] text-white px-4 py-2 rounded-xl hover:bg-[#2D6A4F] transition-all duration-200">
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button className="md:hidden p-1" onClick={() => setMobileOpen(o => !o)}>
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-4">
                    {[
                        { label: 'Buy', href: '/properties?transactionType=SALE' },
                        { label: 'Rent', href: '/properties?transactionType=RENT' },
                        { label: 'AI Planner', href: '/ai-planner' },
                        { label: 'Properties', href: '/properties' },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href} className="text-sm font-medium text-gray-700"
                            onClick={() => setMobileOpen(false)}>{label}</Link>
                    ))}
                    <Link href="/login"
                        className="bg-[#1B4332] text-white text-center py-2.5 rounded-xl font-semibold text-sm">
                        Sign In
                    </Link>
                </div>
            )}
        </nav>
    );
}

export default Navbar;
