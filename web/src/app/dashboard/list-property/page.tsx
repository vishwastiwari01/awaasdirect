'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import apiClient from '@/lib/api-client';
import { CITIES, PROPERTY_TYPES } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const schema = z.object({
    title: z.string().min(5, 'Title too short').max(200),
    description: z.string().max(5000).optional(),
    type: z.string().min(1, 'Select property type'),
    transactionType: z.string().min(1, 'Select sale or rent'),
    city: z.string().min(1, 'Select city'),
    locality: z.string().min(2, 'Add locality / area name'),
    bhk: z.coerce.number().int().min(1).max(10).optional(),
    sqft: z.coerce.number().min(1, 'Enter area in sqft'),
    price: z.coerce.number().min(1, 'Enter price'),
    furnishing: z.string().optional(),
    reraNumber: z.string().optional(),
    reraState: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const FURNISHING_OPTS = ['UNFURNISHED', 'SEMI_FURNISHED', 'FULLY_FURNISHED'];
const TX_TYPES = [{ value: 'SALE', label: '🏠 For Sale' }, { value: 'RENT', label: '🔑 For Rent' }];

export default function ListPropertyPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { type: 'APARTMENT', transactionType: 'SALE' },
    });
    const propType = watch('type');

    const onSubmit = async (data: FormData) => {
        setError('');
        try {
            await apiClient.post('/api/properties', { ...data, bhk: data.bhk ?? undefined, reraNumber: data.reraNumber || undefined });
            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err: unknown) {
            const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(msg ?? 'Failed to create listing. Please try again.');
        }
    };

    const field = (label: string, key: keyof FormData, placeholder: string, type = 'text') => (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>{label}</label>
            <input type={type} placeholder={placeholder} {...register(key as string)} style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${(errors as Record<string, unknown>)[key] ? '#FECACA' : 'var(--border)'}`, borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }} />
            {(errors as Record<string, { message?: string }>)[key] && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{(errors as Record<string, { message?: string }>)[key].message}</p>}
        </div>
    );

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
                    <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', textDecoration: 'none', marginBottom: 24, fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back to Dashboard
                    </Link>
                    <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>List a New Property</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40 }}>Connect directly with buyers and renters — free, no brokerage.</p>

                    {success && (
                        <div style={{ background: '#D8F3DC', border: '1px solid #95D5B2', borderRadius: 12, padding: '16px 20px', color: 'var(--forest)', fontSize: 15, fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
                            ✅ Listing created successfully! Redirecting to dashboard…
                        </div>
                    )}
                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '16px 20px', color: '#DC2626', fontSize: 14, marginBottom: 24 }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Section: Basic Info */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Basic Information</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {field('Property Title', 'title', '3 BHK Apartment in Whitefield, Bangalore')}
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Description</label>
                                    <textarea {...register('description')} rows={4} placeholder="Describe the property — neighbourhood, amenities, nearby landmarks…" style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)', resize: 'vertical' }} />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Property Type</label>
                                        <select {...register('type')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>For Sale / Rent</label>
                                        <select {...register('transactionType')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                            {TX_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Location</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>City</label>
                                    <select {...register('city')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                        <option value="">Select city</option>
                                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.city && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.city.message}</p>}
                                </div>
                                {field('Locality / Area', 'locality', 'Whitefield, Koramangala, Gachibowli…')}
                            </div>
                        </div>

                        {/* Details */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Property Details</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
                                {propType !== 'PLOT' && propType !== 'COMMERCIAL' && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>BHK</label>
                                        <select {...register('bhk')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} BHK</option>)}
                                        </select>
                                    </div>
                                )}
                                {field('Area (sq.ft)', 'sqft', '1200', 'number')}
                                {field('Price (₹)', 'price', '5000000', 'number')}
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>Furnishing</label>
                                    <select {...register('furnishing')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                        <option value="">Select</option>
                                        {FURNISHING_OPTS.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* RERA */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 32 }}>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 4 }}>RERA Registration <span style={{ color: 'var(--muted)', fontFamily: '"DM Sans",monospace', fontSize: 10, textTransform: 'none' }}>(optional — adds RERA Verified badge)</span></div>
                            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>Providing a RERA number builds buyer trust and improves listing visibility.</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
                                {field('RERA Registration Number', 'reraNumber', 'MH/04/BUILD/2024/00123')}
                                {field('RERA State', 'reraState', 'Maharashtra')}
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" disabled={isSubmitting}
                            style={{ width: '100%', padding: '16px', justifyContent: 'center', fontSize: 16, borderRadius: 12, boxShadow: '0 4px 16px rgba(27,67,50,0.25)' }}>
                            {isSubmitting ? 'Publishing…' : '🚀 Publish Listing — Free'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
