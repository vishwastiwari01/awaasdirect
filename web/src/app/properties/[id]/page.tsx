'use client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { MapPin, BedDouble, Square, Shield, MessageSquare, Heart, Building, Calendar, ChevronLeft, Play, Sparkles, Sofa } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { formatPrice, formatArea } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { MediaGallery } from '@/components/ui/MediaGallery';
import { MapViewer } from '@/components/ui/MapViewer';

const IMG_GRADIENTS = [
    'linear-gradient(135deg,#D8F3DC,#95D5B2,#52B788)',
    'linear-gradient(135deg,#F0E6D3,#C9A96E,#E07B39)',
    'linear-gradient(135deg,#E8F4FD,#AED6F1,#3498DB)',
];

export default function PropertyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const [activeImg, setActiveImg] = useState(0);
    const [saved, setSaved] = useState(false);
    const [chatMsg, setChatMsg] = useState('');
    const [chatSent, setChatSent] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ['property', id],
        queryFn: async () => {
            const { data } = await apiClient.get(`/api/properties/${id}`);
            return data.data as Record<string, unknown>;
        },
    });

    const { mutate: startChat, isPending: chatLoading } = useMutation({
        mutationFn: async () => {
            if (!isAuthenticated) { router.push('/login'); return; }
            const { data: convData } = await apiClient.post('/api/conversations', { propertyId: id });
            const convId = (convData.data as { id: string }).id;
            if (chatMsg) {
                await apiClient.post('/api/messages', { conversationId: convId, content: chatMsg });
            }
            router.push('/messages');
        },
        onSuccess: () => setChatSent(true),
    });

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 80px' }}>
                        <div style={{ borderRadius: 20, background: '#E8E0D5', height: 400, animation: 'pulse 1.5s infinite', marginBottom: 32 }} />
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
                            <div style={{ background: '#E8E0D5', borderRadius: 16, height: 300, animation: 'pulse 1.5s infinite' }} />
                            <div style={{ background: '#E8E0D5', borderRadius: 16, height: 300, animation: 'pulse 1.5s infinite' }} />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (isError || !data) {
        return (
            <>
                <Navbar />
                <div style={{ paddingTop: 64, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, background: 'var(--warm-white)' }}>
                    <Building size={60} color="var(--muted)" />
                    <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 28 }}>Property not found</h2>
                    <Link href="/properties"><button className="btn-primary">Browse Other Listings</button></Link>
                </div>
                <Footer />
            </>
        );
    }

    const p = data as any;
    const verification = p.verification as { reraStatus?: string; reraNumber?: string } | null;
    const owner = p.owner as { name?: string | null; aadhaarVerified?: boolean } | null;
    const virtualTour = p.virtualTour as { status?: string } | null;
    const hasRERA = verification?.reraStatus === 'VERIFIED';
    const has3D = virtualTour?.status === 'READY';

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 80px' }}>
                    {/* Back */}
                    <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', marginBottom: 24, fontFamily: '"DM Sans",sans-serif', fontSize: 14 }}>
                        <ChevronLeft size={16} /> Back to listings
                    </button>

                    {/* Media gallery */}
                    <MediaGallery photos={(p.photos as any) || []}>
                        {/* Badges */}
                        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 8, zIndex: 20 }}>
                            {hasRERA && <span style={{ background: 'var(--forest)', color: 'white', fontFamily: '"DM Mono",monospace', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, letterSpacing: '0.05em' }}>RERA ✓ {verification?.reraNumber}</span>}
                            {owner?.aadhaarVerified && <span style={{ background: 'white', color: 'var(--forest)', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 4 }}><Shield size={12} /> Verified Owner</span>}
                        </div>
                        {/* 3D tour */}
                        {has3D && (
                            <button style={{ position: 'absolute', bottom: 20, right: 20, background: 'var(--amber)', color: 'white', border: 'none', borderRadius: 10, padding: '10px 20px', fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, zIndex: 20 }}>
                                <Play size={14} fill="white" /> View 3D Tour
                            </button>
                        )}
                        {/* Favorite */}
                        <button onClick={() => setSaved(!saved)} style={{ position: 'absolute', top: 20, right: 20, width: 44, height: 44, background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.15)', zIndex: 20 }}>
                            <Heart size={20} fill={saved ? '#EF4444' : 'transparent'} color={saved ? '#EF4444' : 'var(--charcoal)'} />
                        </button>
                    </MediaGallery>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40 }}>
                        {/* Left: details */}
                        <div>
                            <div style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>
                                {formatPrice(p.price as number)}
                                {p.transactionType === 'RENT' && <span style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 16, fontWeight: 400, color: 'var(--muted)' }}>/month</span>}
                            </div>
                            <h1 style={{ fontFamily: '"DM Sans",sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>{p.title as string}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
                                <MapPin size={14} /> {p.locality as string}, {p.city as string}
                            </div>

                            {/* Specs */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, background: 'var(--cream)', borderRadius: 16, padding: 24, marginBottom: 32 }}>
                                {[
                                    { icon: <BedDouble size={24} color="var(--forest)" />, label: 'BHK', value: p.bhk ? `${p.bhk as string} BHK` : '—' },
                                    { icon: <Square size={24} color="var(--forest)" />, label: 'Area', value: formatArea(p.sqft as number) },
                                    { icon: <Building size={24} color="var(--forest)" />, label: 'Type', value: (p.type as string)?.replace('_', ' ') ?? '—' },
                                    { icon: <Sofa size={24} color="var(--forest)" />, label: 'Furnishing', value: (p.furnishing as string | undefined)?.replace('_', ' ') ?? '—' },
                                ].map(({ icon, label, value }) => (
                                    <div key={label} style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{icon}</div>
                                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--charcoal)' }}>{value as any}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Description */}
                            {!!p.description && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, marginBottom: 12 }}>About this Property</h3>
                                    <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>{p.description as string}</p>
                                </div>
                            )}

                            {/* AI floor plan for plots */}
                            {p.type === 'PLOT' && (
                                <div style={{ background: 'var(--charcoal)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 32 }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: '"DM Mono",monospace', color: 'var(--forest-light)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>AI Floor Plan Generator</div>
                                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>This is a plot. Generate a custom floor plan tailored to your preferences using AI.</p>
                                    <Link href={`/ai-planner?propertyId=${id}`}>
                                        <button style={{ background: 'linear-gradient(135deg,var(--forest),var(--forest-mid))', color: 'white', border: 'none', borderRadius: 10, padding: '12px 24px', fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}><Sparkles size={16} /> Generate Floor Plan</button>
                                    </Link>
                                </div>
                            )}

                            {/* Map Location */}
                            {p.latitude && p.longitude && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Location Map</h3>
                                    <div style={{ height: 350, borderRadius: 16, border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                                        <MapViewer lat={p.latitude as number} lng={p.longitude as number} />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Contact card */}
                        <div>
                            <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--card-shadow)', position: 'sticky', top: 80 }}>
                                {/* Chat header */}
                                <div style={{ background: 'var(--forest)', color: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 38, height: 38, background: 'var(--forest-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                                        {owner?.name?.[0] ?? '?'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600 }}>{owner?.name ?? 'Owner'}</div>
                                        <div style={{ fontSize: 11, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <span style={{ width: 6, height: 6, background: '#4CAF50', borderRadius: '50%', display: 'inline-block' }} />
                                            Online · {owner?.aadhaarVerified ? 'Aadhaar Verified' : 'Registered Owner'}
                                        </div>
                                    </div>
                                </div>

                                {/* Chat messages preview */}
                                <div style={{ background: 'var(--cream)', padding: 16, minHeight: 160, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                                        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5 }}>
                                            Hello! I&apos;m the owner of this property. Feel free to ask any questions!
                                        </div>
                                        <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>Just now</div>
                                    </div>
                                </div>

                                {/* Message box */}
                                <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
                                    <textarea
                                        value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                                        placeholder="Introduce yourself and ask about this property…"
                                        rows={3}
                                        style={{ width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 13, resize: 'none', outline: 'none', marginBottom: 10, background: 'var(--warm-white)' }}
                                    />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => startChat()}
                                            disabled={chatLoading}
                                            style={{ flex: 1, padding: 10, background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 8, fontFamily: '"DM Sans",sans-serif', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                            <MessageSquare size={14} /> {chatLoading ? 'Sending…' : 'Chat with Owner'}
                                        </button>
                                        <button onClick={() => setSaved(!saved)} style={{ padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 16 }}>
                                            <Heart size={20} fill={saved ? '#EF4444' : 'transparent'} color={saved ? '#EF4444' : 'var(--charcoal)'} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
