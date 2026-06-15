'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, isAuthenticated, logout } = useAuthStore();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            scrolled
                ? 'bg-white/98 backdrop-blur-xl shadow-[0_2px_20px_rgba(0,0,0,0.08)] border-b border-gray-100/80'
                : 'bg-white/90 backdrop-blur-md'
        }`}>
            <div className="max-w-7xl mx-auto px-5 lg:px-10 h-[68px] flex items-center justify-between gap-6">

                {/* Logo */}
                <Link href="/" className="flex items-center shrink-0">
                    <Image
                        src="/website_logo.png"
                        alt="My Awaas"
                        width={140}
                        height={40}
                        className="object-contain h-10 w-auto"
                        priority
                    />
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
                            className="relative px-4 py-2 text-[13.5px] font-medium text-gray-600 hover:text-[#1B4332] rounded-lg hover:bg-[#1B4332]/[0.06] transition-all duration-200 group"
                        >
                            {label}
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1B4332] rounded-full group-hover:w-4 transition-all duration-300" />
                        </Link>
                    ))}
                    {isAuthenticated && user?.role === 'OWNER' && (
                        <Link
                            href="/dashboard"
                            className="relative px-4 py-2 text-[13.5px] font-medium text-gray-600 hover:text-[#1B4332] rounded-lg hover:bg-[#1B4332]/[0.06] transition-all duration-200 group"
                        >
                            Dashboard
                            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#1B4332] rounded-full group-hover:w-4 transition-all duration-300" />
                        </Link>
                    )}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-2.5 shrink-0">
                    {isAuthenticated ? (
                        <>
                            {/* User avatar chip */}
                            <div className="flex items-center gap-2 bg-[#F0FFF4] border border-[#B7E4C7] px-3 py-1.5 rounded-full">
                                <div className="w-6 h-6 bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {(user?.name ?? 'U').charAt(0).toUpperCase()}
                                </div>
                                <span className="text-[13px] font-semibold text-[#1B4332]">
                                    {user?.name?.split(' ')[0]}
                                </span>
                            </div>
                            <button
                                onClick={() => { logout(); window.location.href = '/'; }}
                                className="text-[13px] font-medium text-gray-500 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                            >
                                Sign out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Post listing — subtle */}
                            <Link
                                href="/dashboard/list-property"
                                className="text-[13px] font-semibold text-[#1B4332] px-4 py-2 rounded-lg hover:bg-[#1B4332]/[0.08] transition-all duration-200 flex items-center gap-1.5"
                            >
                                <span className="text-[#E07B39] text-base leading-none">+</span>
                                List Free
                            </Link>

                            {/* Divider */}
                            <div className="w-px h-5 bg-gray-200" />

                            {/* Sign In */}
                            <Link
                                href="/login"
                                className="text-[13px] font-semibold bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white px-5 py-2.5 rounded-xl hover:shadow-[0_4px_16px_rgba(27,67,50,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                            >
                                Sign In
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileOpen(o => !o)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen
                        ? <X className="w-5 h-5 text-gray-700" />
                        : <Menu className="w-5 h-5 text-gray-700" />
                    }
                </button>
            </div>

            {/* Mobile menu — slide down */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="bg-white border-t border-gray-100 px-5 py-5 flex flex-col gap-1">
                    {[
                        { label: '🏠 Buy a Home', href: '/properties?transactionType=SALE' },
                        { label: '🔑 Rent a Place', href: '/properties?transactionType=RENT' },
                        { label: '🏘️ All Properties', href: '/properties' },
                    ].map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            className="text-sm font-medium text-gray-700 hover:text-[#1B4332] px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    {isAuthenticated && user?.role === 'OWNER' && (
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-gray-700 hover:text-[#1B4332] px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                            onClick={() => setMobileOpen(false)}
                        >
                            📊 Dashboard
                        </Link>
                    )}

                    <div className="h-px bg-gray-100 my-1" />

                    {isAuthenticated ? (
                        <button
                            onClick={() => { logout(); setMobileOpen(false); window.location.href = '/'; }}
                            className="text-sm font-semibold text-gray-600 text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Sign out
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 pt-1">
                            <Link
                                href="/dashboard/list-property"
                                className="text-sm font-semibold text-[#1B4332] border-2 border-[#1B4332]/30 text-center py-2.5 rounded-xl hover:border-[#1B4332] transition-all"
                                onClick={() => setMobileOpen(false)}
                            >
                                + List Property Free
                            </Link>
                            <Link
                                href="/login"
                                className="text-sm font-semibold bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white text-center py-2.5 rounded-xl shadow-sm"
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
