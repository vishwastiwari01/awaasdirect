'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
    password: z.string().min(8, 'At least 8 characters'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const { setAuth } = useAuthStore();
    const [error, setError] = useState('');
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

    const onSubmit = async (data: FormData) => {
        setError('');
        try {
            const res = await apiClient.post('/api/auth/login', data);
            const { user, tokens } = res.data.data;
            setAuth(user, tokens.accessToken, tokens.refreshToken);
            router.push('/properties');
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg ?? 'Login failed. Please try again.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 440 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: 'var(--forest)' }}>
                            🏠 Awaas<span style={{ color: 'var(--amber)' }}>Direct</span>
                        </div>
                    </Link>
                    <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 8 }}>Sign in to your account</p>
                </div>

                {/* Card */}
                <div style={{ background: 'white', borderRadius: 20, padding: 40, border: '1.5px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
                    <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 26, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 28 }}>Welcome Back</h2>

                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', color: '#DC2626', fontSize: 14, marginBottom: 20 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Mobile Number</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14, fontWeight: 500 }}>+91</span>
                                <input {...register('phone')} placeholder="9876543210" style={{ width: '100%', padding: '13px 14px 13px 52px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }} />
                            </div>
                            {errors.phone && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{errors.phone.message}</p>}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Password</label>
                            <input {...register('password')} type="password" placeholder="••••••••" style={{ width: '100%', padding: '13px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }} />
                            {errors.password && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 6 }}>{errors.password.message}</p>}
                        </div>

                        <button type="submit" className="btn-primary" disabled={isSubmitting}
                            style={{ width: '100%', padding: '14px', justifyContent: 'center', fontSize: 15, borderRadius: 10, marginTop: 8 }}>
                            {isSubmitting ? 'Signing in…' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--muted)', marginTop: 24 }}>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" style={{ color: 'var(--forest)', fontWeight: 600, textDecoration: 'none' }}>Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
