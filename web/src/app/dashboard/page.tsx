'use client';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BarChart3, Home, MessageSquare, Eye, Plus, Settings, ShieldCheck } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { formatPrice } from '@/lib/utils';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) router.push('/login');
        else if (user?.role === 'BUYER') router.push('/properties');
    }, [isAuthenticated, user, router]);

    const { data: listings, isLoading } = useQuery({
        queryKey: ['my-properties'],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/properties/my');
            return data.data as Array<Record<string, unknown>>;
        },
        enabled: isAuthenticated,
    });

    const totalViews = listings?.reduce((s, p) => s + ((p.viewCount as number) ?? 0), 0) ?? 0;
    const activeLists = listings?.filter(p => p.status === 'ACTIVE').length ?? 0;

    const IMG_GRADIENTS = [
        'linear-gradient(135deg,#D8F3DC,#95D5B2,#52B788)',
        'linear-gradient(135deg,#F0E6D3,#C9A96E,#E07B39)',
        'linear-gradient(135deg,#E8F4FD,#AED6F1,#3498DB)',
        'linear-gradient(135deg,#FEF9E7,#F9E79F,#F4D03F)',
    ];

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                {/* Header */}
                <div style={{ background: 'var(--forest)', padding: '40px 80px', color: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--forest-light)', marginBottom: 8 }}>Owner Dashboard</div>
                            <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                                Welcome, {user?.name?.split(' ')[0] ?? 'Owner'}
                            </h1>
                            {user?.aadhaarVerified && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
                                    <ShieldCheck size={14} style={{ color: 'var(--forest-light)' }} /> Aadhaar Verified Account
                                </div>
                            )}
                        </div>
                        <Link href="/dashboard/list-property">
                            <button style={{ background: 'var(--amber)', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Plus size={16} /> List New Property
                            </button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 32 }}>
                        {[
                            { icon: <Home size={20} />, label: 'Active Listings', value: activeLists },
                            { icon: <Eye size={20} />, label: 'Total Views', value: totalViews.toLocaleString('en-IN') },
                            { icon: <MessageSquare size={20} />, label: 'Chat Inquiries', value: '—' },
                            { icon: <BarChart3 size={20} />, label: 'This Month', value: '—' },
                        ].map(({ icon, label, value }) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '20px 24px', border: '1px solid rgba(255,255,255,0.15)' }}>
                                <div style={{ color: 'var(--forest-light)', marginBottom: 10 }}>{icon}</div>
                                <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 28, fontWeight: 700, color: 'white', marginBottom: 4 }}>{value}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Listings */}
                <div style={{ padding: '48px 80px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                        <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, fontWeight: 700 }}>My Listings</h2>
                    </div>

                    {isLoading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                            {[1, 2, 3].map(i => <div key={i} style={{ background: 'var(--border)', borderRadius: 16, height: 240, animation: 'pulse 1.5s infinite' }} />)}
                        </div>
                    ) : listings?.length ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
                            {listings.map((p, i) => {
                                const verif = p.verification as { reraStatus?: string } | null;
                                return (
                                    <div key={p.id as string} style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                                        <div style={{ height: 140, background: IMG_GRADIENTS[i % IMG_GRADIENTS.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48, position: 'relative' }}>
                                            🏠
                                            <span style={{ position: 'absolute', top: 10, left: 10, background: p.status === 'ACTIVE' ? 'var(--forest)' : '#6B6B6B', color: 'white', fontSize: 10, fontFamily: '"DM Mono",monospace', padding: '3px 8px', borderRadius: 5 }}>
                                                {p.status as string}
                                            </span>
                                            {verif?.reraStatus === 'VERIFIED' && (
                                                <span style={{ position: 'absolute', top: 10, right: 10, background: 'white', color: 'var(--forest)', fontSize: 10, padding: '3px 8px', borderRadius: 5, fontWeight: 700 }}>RERA ✓</span>
                                            )}
                                        </div>
                                        <div style={{ padding: 16 }}>
                                            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{formatPrice(p.price as number)}</div>
                                            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, color: 'var(--charcoal)' }}>{p.title as string}</div>
                                            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14 }}>{p.locality as string}, {p.city as string}</div>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <Link href={`/properties/${p.id as string}`} style={{ flex: 1 }}>
                                                    <button style={{ width: '100%', padding: '8px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'white', fontFamily: '"DM Sans",sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}><Eye size={12} /> View</button>
                                                </Link>
                                                <button style={{ padding: '8px 12px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'white', cursor: 'pointer' }}><Settings size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '64px 0' }}>
                            <div style={{ fontSize: 56, marginBottom: 16 }}>🏠</div>
                            <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 24, marginBottom: 8 }}>No listings yet</h3>
                            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Add your first property and connect with thousands of buyers.</p>
                            <Link href="/dashboard/list-property">
                                <button className="btn-primary" style={{ padding: '12px 28px' }}>+ Add First Listing</button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
