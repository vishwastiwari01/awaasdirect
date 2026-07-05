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
import { ChevronLeft, UploadCloud, X as XIcon, Film } from 'lucide-react';
import Link from 'next/link';

import { State, City } from 'country-state-city';
import { useEffect } from 'react';

const loadRazorpay = () => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
});

const schema = z.object({
    title: z.string().min(5, 'Title too short').max(200),
    description: z.string().max(5000).optional(),
    type: z.string().min(1, 'Select property type'),
    transactionType: z.string().min(1, 'Select sale or rent'),
    state: z.string().min(1, 'Select state'),
    city: z.string().min(1, 'Select city'),
    pincode: z.string().length(6, 'Pincode must be 6 digits').regex(/^\d+$/, 'Numbers only'),
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
const TX_TYPES = [{ value: 'SALE', label: 'For Sale' }, { value: 'RENT', label: 'For Rent' }];

export default function ListPropertyPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [limitReached, setLimitReached] = useState(false);
    const [paymentPending, setPaymentPending] = useState(false);

    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { type: 'APARTMENT', transactionType: 'SALE' },
    });
    const propType = watch('type');
    const selectedStateName = watch('state');

    const [statesList] = useState(() => State.getStatesOfCountry('IN'));
    const [citiesList, setCitiesList] = useState<{name: string}[]>([]);

    useEffect(() => {
        const s = statesList.find(st => st.name === selectedStateName);
        if (s) {
            setCitiesList(City.getCitiesOfState('IN', s.isoCode));
        } else {
            setCitiesList([]);
        }
    }, [selectedStateName, statesList]);

    const onSubmit = async (data: FormData) => {
        setError('');
        try {
            const res = await apiClient.post('/api/properties', { 
                ...data, 
                bhk: data.bhk ?? undefined, 
                reraNumber: data.reraNumber || undefined,
                latitude: location?.lat,
                longitude: location?.lng
            });
            const propertyId = res.data.data.id;

            if (files.length > 0) {
                const formData = new FormData();
                files.forEach(f => formData.append('photos', f));
                await apiClient.post(`/api/properties/${propertyId}/photos`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setSuccess(true);
            setTimeout(() => router.push('/dashboard'), 1500);
        } catch (err: any) {
            console.error('Submission error:', err);
            const code = err?.response?.data?.code;
            const msg = err?.response?.data?.message || err.message || 'Unknown error occurred';
            if (code === 'LIMIT_REACHED') {
                setLimitReached(true);
                setError(msg ?? 'You have reached the daily limit.');
            } else {
                setError(`Error: ${msg}. Please try again.`);
            }
        }
    };

    const handlePayment = async () => {
        setPaymentPending(true);
        setError('');
        try {
            const loaded = await loadRazorpay();
            if (!loaded) throw new Error('Razorpay SDK failed to load');

            const { data } = await apiClient.post('/api/payments/create-order');
            const order = data.data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "AwaasDirect",
                description: "Unlock 1 Property Listing",
                order_id: order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await apiClient.post('/api/payments/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (verifyRes.data.success) {
                            setLimitReached(false);
                            setError('');
                            // Auto-submit the form now that credit is purchased
                            handleSubmit(onSubmit)();
                        }
                    } catch (err) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                theme: { color: "#1B4332" }
            };
            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(`Payment failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (err: any) {
            setError(err.message || 'Failed to initialize payment');
        } finally {
            setPaymentPending(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (files.length + newFiles.length > 10) {
                setError('You can upload a maximum of 10 media files.');
                return;
            }
            const invalidFile = newFiles.find(f => f.size > 50 * 1024 * 1024);
            if (invalidFile) {
                setError('File size must be under 50MB.');
                return;
            }
            setFiles(prev => [...prev, ...newFiles]);
            setError('');
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const field = (label: string, key: keyof FormData, placeholder: string, type = 'text') => (
        <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>{label}</label>
            <input type={type} placeholder={placeholder} {...register(key as any)} style={{ width: '100%', padding: '12px 14px', border: `1.5px solid ${(errors as Record<string, unknown>)[key] ? '#FECACA' : 'var(--border)'}`, borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }} />
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
                            Listing created successfully! Redirecting to dashboard…
                        </div>
                    )}
                    {error && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '16px 20px', color: '#DC2626', fontSize: 14, marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <span>{error}</span>
                            {limitReached && (
                                <button type="button" onClick={handlePayment} disabled={paymentPending} style={{ padding: '10px 16px', background: '#DC2626', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-start' }}>
                                    {paymentPending ? 'Processing…' : 'Pay ₹100 to Unlock'}
                                </button>
                            )}
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
                                            {PROPERTY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
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
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>State</label>
                                    <select {...register('state')} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                        <option value="">Select state</option>
                                        {statesList.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                                    </select>
                                    {errors.state && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.state.message}</p>}
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>City</label>
                                    <select {...register('city')} disabled={!selectedStateName} style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, background: 'var(--warm-white)', outline: 'none' }}>
                                        <option value="">Select city</option>
                                        {citiesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                                    </select>
                                    {errors.city && <p style={{ fontSize: 12, color: '#DC2626', marginTop: 4 }}>{errors.city.message}</p>}
                                </div>
                                {field('Locality / Area', 'locality', 'Whitefield, Koramangala, Gachibowli…')}
                                {field('Pincode', 'pincode', '500081')}
                            </div>
                            <div style={{ marginTop: 24 }}>
                                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>
                                    Exact Location <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: 12 }}>(optional — helps buyers find your property on map)</span>
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(
                                                    (pos) => {
                                                        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                                                        setLocation(coords);
                                                    },
                                                    () => {
                                                        alert('Unable to retrieve your location. Please check browser permissions.');
                                                    }
                                                );
                                            } else {
                                                alert('Geolocation is not supported by your browser.');
                                            }
                                        }}
                                        style={{
                                            padding: '8px 14px',
                                            background: 'var(--forest)',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: 13,
                                            fontWeight: 600,
                                        }}
                                    >
                                        📍 Use Current Location
                                    </button>
                                    {location && (
                                        <button
                                            type="button"
                                            onClick={() => setLocation(null)}
                                            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                                {location ? (
                                    <p style={{ fontSize: 12, color: 'var(--forest)', marginTop: 8 }}>
                                        ✓ Location pinned ({location.lat.toFixed(4)}, {location.lng.toFixed(4)})
                                    </p>
                                ) : (
                                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                                        Skip this if you prefer not to share exact coordinates.
                                    </p>
                                )}
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

                        {/* Media Upload */}
                        <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 20 }}>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Media (Images & Videos)</div>
                            <div style={{ border: '2px dashed var(--border)', borderRadius: 12, padding: '32px 24px', textAlign: 'center', background: 'var(--warm-white)', position: 'relative', overflow: 'hidden' }}>
                                <input type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime" onChange={handleFileChange} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }} title="Upload media" />
                                <UploadCloud size={32} color="var(--forest)" style={{ margin: '0 auto 12px' }} />
                                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>Drag & drop or click to upload</div>
                                <div style={{ fontSize: 12, color: 'var(--muted)' }}>Supports JPG, PNG, WEBP, MP4 (Max 50MB, up to 10 files)</div>
                            </div>
                            {files.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12, marginTop: 16 }}>
                                    {files.map((file, i) => (
                                        <div key={i} style={{ position: 'relative', height: 100, borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {file.type.startsWith('image/') ? (
                                                <img src={URL.createObjectURL(file)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="preview" />
                                            ) : (
                                                <div style={{ textAlign: 'center', color: 'var(--muted)' }}><Film size={24} style={{ margin: '0 auto 4px' }}/><div style={{ fontSize: 10 }}>Video</div></div>
                                            )}
                                            <button type="button" onClick={(e) => { e.preventDefault(); removeFile(i); }} style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, background: 'rgba(0,0,0,0.5)', color: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
                                                <XIcon size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                            {isSubmitting ? 'Publishing…' : 'Publish Listing — Free'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer />
        </>
    );
}
