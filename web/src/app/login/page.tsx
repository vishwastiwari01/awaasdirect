'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Hand, AlertTriangle } from 'lucide-react';
import { BrandLogo } from '@/components/ui/BrandLogo';
import { signInWithGoogle } from '@/lib/supabase/client';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { isAuthenticated, setSession } = useAuthStore();
    const router = useRouter();

    // Sync Supabase session on mount
    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setSession(session);
                router.push('/properties');
            }
        });
    }, [setSession, router]);

    if (isAuthenticated) return null;

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithGoogle();
            // Page will redirect — no need to setLoading(false)
        } catch {
            setError('Google sign-in failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">

            {/* ── Left: Brand Panel ── */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col justify-between p-12"
                style={{ background: 'linear-gradient(145deg, #071A0F 0%, #0D2818 35%, #1B4332 70%, #2D6A4F 100%)' }}>

                {/* Animated background orbs */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-20"
                        style={{ background: 'radial-gradient(circle, #52B788, transparent)', animation: 'pulse 6s infinite ease-in-out' }} />
                    <div className="absolute bottom-1/4 right-0 w-60 h-60 rounded-full opacity-15"
                        style={{ background: 'radial-gradient(circle, #E07B39, transparent)', animation: 'pulse 8s infinite 2s ease-in-out' }} />
                    {/* Grid pattern */}
                    <div className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }} />
                </div>

                {/* Logo */}
                <Link href="/" className="relative z-10">
                    <BrandLogo dark />
                </Link>

                {/* Middle content */}
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-8">
                        <span className="w-2 h-2 bg-[#52B788] rounded-full animate-pulse" />
                        <span className="text-white/70 text-xs font-medium tracking-wider uppercase">India&apos;s #1 Direct Marketplace</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white leading-tight mb-5"
                        style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Find your perfect<br />
                        <em className="text-[#52B788] not-italic">Awaas</em>, directly.
                    </h1>
                    <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-10">
                        Connect with verified property owners. Zero broker fees. Zero commissions. Just your perfect home.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[['48K+', 'Listings'], ['₹0', 'Brokerage'], ['100%', 'Owner Direct']].map(([n, l]) => (
                            <div key={l} className="bg-white/[0.07] border border-white/10 rounded-2xl p-4 text-center">
                                <div className="text-2xl font-bold text-white mb-1"
                                    style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>{n}</div>
                                <div className="text-xs text-white/40 font-medium">{l}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom */}
                <p className="relative z-10 text-xs text-white/25">
                    © 2026 My Awaas Technologies Pvt. Ltd.
                </p>
            </div>

            {/* ── Right: Auth Panel ── */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#FAFAF9]">
                <div className="w-full max-w-[400px]">

                    {/* Mobile logo */}
                    <div className="flex justify-center mb-8 lg:hidden">
                        <Link href="/">
                            <BrandLogo />
                        </Link>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-[28px] font-bold text-gray-900 mb-2 tracking-tight"
                            style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                            <span className="flex items-center gap-2">Welcome back <Hand className="w-6 h-6 text-[#E07B39]" /></span>
                        </h2>
                        <p className="text-gray-500 text-sm">Sign in to access your account</p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500" /> {error}
                        </div>
                    )}

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-2xl transition-all duration-200 hover:shadow-md text-[15px] mb-4"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#4285F4] rounded-full animate-spin" />
                                <span>Connecting to Google…</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                <span>Continue with Google</span>
                            </>
                        )}
                    </button>

                    {/* Trust line */}
                    <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
                        By signing in you agree to our{' '}
                        <Link href="/" className="text-[#1B4332] hover:underline">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/" className="text-[#1B4332] hover:underline">Privacy Policy</Link>
                    </p>

                    {/* New user */}
                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            New to My Awaas?{' '}
                            <span className="text-[#1B4332] font-semibold">
                                Just sign in with Google — we&apos;ll set up your account automatically.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
