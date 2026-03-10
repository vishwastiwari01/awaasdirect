'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Home, Eye, EyeOff, Search, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import apiClient from '@/lib/api-client';

export default function RegisterPage() {
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const { setAuth } = useAuthStore();

    const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

    const handleSubmit = async () => {
        if (!role) { setError('Please select your role first'); return; }
        if (!form.name || !form.phone || !form.password) { setError('Please fill all required fields'); return; }
        setLoading(true); setError('');
        try {
            const { data } = await apiClient.post('/api/auth/register', {
                name: form.name,
                phone: `+91${form.phone}`,
                email: form.email || undefined,
                password: form.password,
                role: role === 'buyer' ? 'BUYER' : 'OWNER',
            });
            setAuth(data.data.user, data.data.tokens.accessToken, data.data.tokens.refreshToken);
            router.push(role === 'owner' ? '/dashboard' : '/properties');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg ?? 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">

            {/* ── Left panel ── */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12"
                style={{ background: 'linear-gradient(160deg, #0D2818 0%, #1B4332 50%, #2D6A4F 100%)' }}>
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Awaas<span className="text-[#F4A261]">Direct</span>
                    </span>
                </Link>

                <div>
                    <h2 className="text-4xl font-bold text-white mb-4 leading-tight"
                        style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Join 48,000+<br />
                        <em className="text-[#52B788]">families</em> finding<br />
                        their Awaas.
                    </h2>
                    <p className="text-white/60 text-sm mb-8 leading-relaxed">
                        India&apos;s most trusted direct property marketplace. No brokers, no hidden fees.
                    </p>
                    <div className="flex flex-col gap-4">
                        {[
                            'Zero broker fees — save ₹50,000+',
                            'Verified owners only — no fake listings',
                            'AI-powered search and 3D tours',
                            'Digital agreements — sign from anywhere',
                        ].map(item => (
                            <div key={item} className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-[#52B788] flex-shrink-0" />
                                <span className="text-white/80 text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative */}
                <div className="flex items-end justify-center opacity-10">
                    <div style={{ width: 120, height: 80, background: 'white', borderRadius: '4px 4px 0 0', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: -40, left: -10, right: -10, height: 50, background: 'white', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="flex-1 flex items-center justify-center p-8 bg-[#FDFAF6]">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                            Create your account
                        </h1>
                        <p className="text-gray-500 text-sm">Free forever. No credit card needed.</p>
                    </div>

                    {/* Role selection */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                            { id: 'buyer', Icon: Search, label: "I'm Looking", sub: 'Buyer / Tenant' },
                            { id: 'owner', Icon: Home, label: "I'm an Owner", sub: 'List my property' },
                        ].map(({ id, Icon, label, sub }) => (
                            <button key={id} onClick={() => setRole(id)}
                                className={`p-4 rounded-2xl border-2 text-left transition-all ${role === id ? 'border-[#1B4332] bg-[#D8F3DC]' : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${role === id ? 'bg-[#1B4332]' : 'bg-gray-100'}`}>
                                    <Icon className={`w-5 h-5 ${role === id ? 'text-white' : 'text-gray-500'}`} />
                                </div>
                                <div className={`text-sm font-bold ${role === id ? 'text-[#1B4332]' : 'text-gray-800'}`}>{label}</div>
                                <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
                            </button>
                        ))}
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>
                    )}

                    {/* Fields */}
                    <div className="flex flex-col gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                            <input type="text" placeholder="Your full name" value={form.name} onChange={e => update('name', e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email <span className="text-gray-400 font-normal">(optional)</span></label>
                            <input type="email" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all" />
                            <p className="text-xs text-gray-400 mt-1">Optional — for account recovery</p>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mobile Number *</label>
                            <div className="flex">
                                <span className="px-3 py-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500 font-medium">+91</span>
                                <input type="tel" placeholder="9876543210" maxLength={10} value={form.phone} onChange={e => update('phone', e.target.value)}
                                    className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-r-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all" />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} placeholder="Min 8 characters" value={form.password} onChange={e => update('password', e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition-all pr-12" />
                                <button type="button" onClick={() => setShowPassword(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={loading}
                        className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-all hover:shadow-lg text-sm mb-4">
                        {loading ? 'Creating account…' : 'Create Free Account →'}
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400">or</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Google */}
                    <button className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-3 text-sm mb-6">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[#1B4332] font-semibold hover:underline">Sign in</Link>
                    </p>
                    <p className="text-center text-xs text-gray-400 mt-3">
                        By registering you agree to our Terms of Service &amp; Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
