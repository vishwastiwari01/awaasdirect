'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
    MapPin, BedDouble, Square, Heart, Maximize2,
    Building2, Home, Castle, MapPinned, Store, BedSingle,
} from 'lucide-react';
import { formatPrice, formatArea } from '@/lib/utils';

export interface PropertyCardData {
    id: string;
    title: string;
    type: string;
    transactionType: string;
    city: string;
    locality: string;
    bhk?: number | null;
    sqft: number;
    price: number;
    furnishing?: string;
    status: string;
    photos?: { url: string }[];
    verification?: { reraStatus: string } | null;
    owner?: { name: string | null; aadhaarVerified: boolean };
    virtualTour?: { status: string } | null;
}

/* Beautiful rich gradients — one per property type */
const GRADIENTS: Record<string, string> = {
    APARTMENT: 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)',
    VILLA: 'linear-gradient(135deg, #92400E 0%, #B45309 50%, #F59E0B 100%)',
    INDEPENDENT_HOUSE: 'linear-gradient(135deg, #1E3A5F 0%, #2563EB 50%, #60A5FA 100%)',
    PLOT: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #A78BFA 100%)',
    COMMERCIAL: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)',
    PG: 'linear-gradient(135deg, #7C2D12 0%, #C2410C 50%, #FB923C 100%)',
};
const FALLBACK_GRAD = 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #52B788 100%)';

const PROP_ICON: Record<string, React.ReactNode> = {
    APARTMENT: <Building2 size={20} color="rgba(255,255,255,0.7)" />,
    VILLA: <Castle size={20} color="rgba(255,255,255,0.7)" />,
    INDEPENDENT_HOUSE: <Home size={20} color="rgba(255,255,255,0.7)" />,
    PLOT: <MapPinned size={20} color="rgba(255,255,255,0.7)" />,
    COMMERCIAL: <Store size={20} color="rgba(255,255,255,0.7)" />,
    PG: <BedSingle size={20} color="rgba(255,255,255,0.7)" />,
};

export function PropertyCard({ property, onSave, isSaved = false }: {
    property: PropertyCardData;
    index?: number;
    onSave?: (id: string) => void;
    isSaved?: boolean;
}) {
    const [saved, setSaved] = useState(isSaved);
    const gradient = GRADIENTS[property.type] ?? FALLBACK_GRAD;
    const hasRERA = property.verification?.reraStatus === 'VERIFIED';
    const has3D = property.virtualTour?.status === 'READY';
    const isOwnerVerified = property.owner?.aadhaarVerified;
    const isRent = property.transactionType === 'RENT';

    return (
        <div className="property-card">
            {/* ── Gradient image area ── */}
            <div style={{ height: 192, position: 'relative', overflow: 'hidden', background: gradient }}>
                {/* Subtle noise/depth overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.35) 100%)' }} />

                {/* RERA badge — top left */}
                {hasRERA && (
                    <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: '#1B4332', color: 'white',
                        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                        padding: '4px 9px', borderRadius: 6, letterSpacing: '0.05em',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                    }}>RERA ✓</span>
                )}

                {/* Owner direct badge — next to RERA */}
                {isOwnerVerified && (
                    <span style={{
                        position: 'absolute', top: 12, left: hasRERA ? 76 : 12,
                        background: 'rgba(255,255,255,0.92)', color: '#1B4332',
                        fontSize: 10, fontWeight: 700,
                        padding: '4px 9px', borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}>Owner Direct</span>
                )}

                {/* Heart + 3D row — top right */}
                <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6 }}>
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setSaved(s => !s); onSave?.(property.id); }}
                        style={{
                            width: 32, height: 32, borderRadius: '50%', border: 'none',
                            background: 'rgba(255,255,255,0.9)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'transform 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Heart size={14} fill={saved ? '#E07B39' : 'none'} color={saved ? '#E07B39' : '#6B6B6B'} strokeWidth={2} />
                    </button>
                </div>

                {/* Property type icon — bottom left */}
                <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{
                        width: 30, height: 30, borderRadius: 8, background: 'rgba(0,0,0,0.3)',
                        backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {PROP_ICON[property.type] ?? <Home size={16} color="white" />}
                    </div>
                </div>

                {/* 3D View CTA — bottom right */}
                {has3D && (
                    <button style={{
                        position: 'absolute', bottom: 12, right: 12,
                        background: '#E07B39', color: 'white',
                        border: 'none', borderRadius: 8,
                        fontSize: 10, fontWeight: 700, fontFamily: 'var(--font-mono)',
                        padding: '5px 11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                        boxShadow: '0 4px 12px rgba(224,123,57,0.4)',
                        transition: 'all 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <Maximize2 size={10} /> 3D VIEW
                    </button>
                )}
            </div>

            {/* ── Card body ── */}
            <Link href={`/properties/${property.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div style={{ padding: '16px 18px' }}>
                    {/* Price */}
                    <p style={{
                        fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
                        fontSize: 22, fontWeight: 800, color: '#1A1A1A', lineHeight: 1.1,
                        marginBottom: 2,
                    }}>
                        {formatPrice(property.price)}
                        {isRent && <span style={{ fontSize: 13, fontWeight: 400, fontFamily: 'var(--font-sans)', color: '#6B6B6B' }}>/mo</span>}
                    </p>

                    {/* Title */}
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 5, lineHeight: 1.4 }}>
                        {property.title}
                    </p>

                    {/* Location */}
                    <p style={{ fontSize: 12, color: '#6B6B6B', display: 'flex', alignItems: 'center', gap: 4, marginBottom: 14 }}>
                        <MapPin size={11} color="#52B788" /> {property.locality}, {property.city}
                    </p>

                    {/* Specs bar */}
                    <div style={{
                        display: 'flex', gap: 14, paddingTop: 12,
                        borderTop: '1px solid #F0EBE3',
                        fontSize: 12, color: '#6B6B6B',
                    }}>
                        {property.bhk != null && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <BedDouble size={12} color="#52B788" /> {property.bhk} BHK
                            </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Square size={12} color="#52B788" /> {formatArea(property.sqft)}
                        </span>
                        <span style={{
                            marginLeft: 'auto',
                            background: '#F7F3ED', color: '#6B6B6B',
                            fontSize: 10, fontWeight: 600, fontFamily: 'var(--font-mono)',
                            padding: '2px 8px', borderRadius: 5,
                            textTransform: 'uppercase', letterSpacing: '0.04em',
                        }}>
                            {property.type.replace('_', ' ')}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
