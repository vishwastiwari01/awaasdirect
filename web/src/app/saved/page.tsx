'use client';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Trash2, MapPin, Square, BedDouble } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatArea } from '@/lib/utils';

const IMG_GRADIENTS = [
    'linear-gradient(135deg,#D8F3DC,#95D5B2,#52B788)',
    'linear-gradient(135deg,#F0E6D3,#C9A96E,#E07B39)',
    'linear-gradient(135deg,#E8F4FD,#AED6F1,#3498DB)',
    'linear-gradient(135deg,#FEF9E7,#F9E79F,#F4D03F)',
];

export default function SavedPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const qc = useQueryClient();

    useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

    const { data, isLoading } = useQuery({
        queryKey: ['saved-properties'],
        queryFn: async () => { const { data } = await apiClient.get('/api/saved-properties'); return data.data as Array<Record<string, unknown>>; },
        enabled: isAuthenticated,
    });

    const { mutate: unsave } = useMutation({
        mutationFn: async (propertyId: string) => { await apiClient.delete(`/api/saved-properties/${propertyId}`); },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['saved-properties'] }),
    });

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 40px' }}>
                    <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Saved Properties</h1>
                    <p style={{ color: 'var(--muted)', marginBottom: 36 }}>Your shortlisted properties for quick access.</p>

                    {isLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--border)', borderRadius: 16, height: 280, animation: 'pulse 1.5s infinite' }} />)}
                        </div>
                    ) : data?.length ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                            {data.map((item, i) => {
                                const p = item.property as Record<string, unknown> | null;
                                if (!p) return null;
                                const verif = p.verification as { reraStatus?: string } | null;
                                return (
                                    <div key={item.id as string} className="property-card">
                                        {/* Image */}
                                        <div style={{ height: 180, background: IMG_GRADIENTS[i % IMG_GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative' }}>
                                            🏠
                                            <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                                                {verif?.reraStatus === 'VERIFIED' && <span style={{ background: 'var(--forest)', color: 'white', fontSize: 9, fontFamily: '"DM Mono",monospace', fontWeight: 700, padding: '2px 7px', borderRadius: 5, letterSpacing: '0.04em' }}>RERA ✓</span>}
                                            </div>
                                            <button
                                                onClick={() => unsave(p.id as string)}
                                                style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E74C3C' }}>
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                        {/* Body */}
                                        <Link href={`/properties/${p.id as string}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <div style={{ padding: 16 }}>
                                                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 4 }}>{formatPrice(p.price as number)}</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 4 }}>{p.title as string}</div>
                                                <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                                                    <MapPin size={11} /> {p.locality as string}, {p.city as string}
                                                </div>
                                                <div style={{ display: 'flex', gap: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                                                    {p.bhk != null && <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><BedDouble size={12} /> {p.bhk as number} BHK</span>}
                                                    <span style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}><Square size={12} /> {formatArea(p.sqft as number)}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '80px 0' }}>
                            <div style={{ fontSize: 60, marginBottom: 16 }}>❤️</div>
                            <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 26, marginBottom: 8 }}>No saved properties</h3>
                            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Tap the heart on any listing to save it here.</p>
                            <Link href="/properties"><button className="btn-primary" style={{ padding: '12px 28px' }}>🔍 Browse Properties</button></Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
