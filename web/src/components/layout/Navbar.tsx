'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { usePathname } from 'next/navigation';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();
    const pathname = usePathname();
    const isHomePage = pathname === '/';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            (scrolled || !isHomePage)
                ? 'bg-[#0A0F1A]/95 backdrop-blur-xl shadow-2xl border-b border-white/10'
                : 'bg-transparent pt-2'
        }`}>
            <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[76px] flex items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <BrandLogo />
                </Link>

                {/* Desktop Nav Links — centered */}
                <div className="hidden md:flex items-center gap-1">
                    {[
                        { label: 'Buy', href: '/properties?transactionType=SALE' },
                        { label: 'Rent', href: '/properties?transactionType=RENT' },
                        { label: 'All Properties', href: '/properties' },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="relative px-4 py-2 text-[14px] font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 group"
                        >
                            {label}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#52B788] rounded-full group-hover:w-4 transition-all duration-300" />
                        </Link>
                    ))}
                    {isAuthenticated && user?.role === 'OWNER' && (
                        <Link
                            href="/dashboard"
                            className="relative px-4 py-2 text-[14px] font-medium text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 group"
                        >
                            Dashboard
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#52B788] rounded-full group-hover:w-4 transition-all duration-300" />
                        </Link>
                    )}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-3 shrink-0">
                    {isAuthenticated ? (
                        <>
                            {/* User avatar chip */}
                            <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#52B788] to-[#2D6A4F] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {(user?.name ?? 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[13px] font-semibold text-white/90">
                                    {user?.name?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={() => { logout(); window.location.href = '/'; }}
                                className="text-[13px] font-medium text-white/60 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-200"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Post listing — subtle */}
                            <Link
                                href="/dashboard/list-property"
                                className="text-[13px] font-semibold text-white/80 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5"
                            >
                                <span className="text-[#F4A261] text-base leading-none">+</span>
                                List Free
                            </Link>

                            {/* Divider */}
                            <div className="w-px h-5 bg-white/20" />

                            {/* Sign In */}
                            <Link
                                href="/login"
                                className="text-[13px] font-semibold bg-[#1B4332] text-white px-6 py-2.5 rounded-xl hover:bg-[#2D6A4F] hover:shadow-[0_4px_16px_rgba(27,67,50,0.5)] transition-all duration-200 border border-[#2D6A4F]/50"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen
                        ? <X className="w-6 h-6 text-white" />
                        : <Menu className="w-6 h-6 text-white" />
                    }
                </button>
            </div>

            {/* Mobile menu — slide down */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0A0F1A]/95 backdrop-blur-xl border-t border-white/10 ${
                mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="px-5 py-5 flex flex-col gap-1">
                    {[
                        { label: '🏠 Buy a Home', href: '/properties?transactionType=SALE' },
                        { label: '🔑 Rent a Place', href: '/properties?transactionType=RENT' },
                        { label: '🏘️ All Properties', href: '/properties' },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-sm font-medium text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    {isAuthenticated && user?.role === 'OWNER' && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-white/80 hover:text-white px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            📊 Dashboard
                        </Link>
                    )}

                    <div className="h-px bg-white/10 my-2" />

                    {isAuthenticated ? (
                        <button
                            onClick={() => { logout(); setMobileOpen(false); window.location.href = '/'; }}
                            className="text-sm font-semibold text-white/60 text-left px-3 py-2.5 rounded-lg hover:bg-white/5 transition-all"
                        >
                            Sign out
                        </button>
                    ) : (
                        <div className="flex flex-col gap-3 pt-2">
                            <Link
                                href="/dashboard/list-property"
                                className="text-sm font-semibold text-white border border-white/20 text-center py-2.5 rounded-xl hover:bg-white/5 transition-all"
                                onClick={() => setMobileOpen(false)}
                            >
                                + List Property Free
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm font-semibold bg-[#1B4332] border border-[#2D6A4F]/50 text-white text-center py-2.5 rounded-xl shadow-sm"
                                onClick={() => setMobileOpen(false)}
                            >
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
