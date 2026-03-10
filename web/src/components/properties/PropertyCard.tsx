'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MapPin, BedDouble, Bath, Square, Boxes, Heart } from 'lucide-react';

const UNSPLASH_IMAGES = [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80',
    'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=80',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80',
];

function formatPrice(price: number, listingType: string) {
    if (listingType === 'RENT') return `₹${(price / 1000).toFixed(0)}k/mo`;
    if (price >= 10_000_000) return `₹${(price / 10_000_000).toFixed(2)} Cr`;
    if (price >= 100_000) return `₹${(price / 100_000).toFixed(0)}L`;
    return `₹${price.toLocaleString('en-IN')}`;
}

export interface PropertyCardData {
    id: string;
    title: string;
    price: number;
    listingType?: string;
    transactionType?: string;
    propertyType?: string;
    type?: string;
    city: string;
    locality: string;
    bedrooms?: number | null;
    bhk?: number | null;
    bathrooms?: number | null;
    sqft: number;
    images?: string[];
    photos?: { url: string }[];
    verification?: { reraStatus: string } | null;
    owner?: { name: string | null; aadhaarVerified: boolean };
    virtualTour?: { status: string } | null;
}

export function PropertyCard({ property, index = 0, onSave, isSaved = false }: {
    property: PropertyCardData;
    index?: number;
    onSave?: (id: string) => void;
    isSaved?: boolean;
}) {
    const [liked, setLiked] = useState(isSaved);

    const imgSrc = property.photos?.[0]?.url
        || property.images?.[0]
        || UNSPLASH_IMAGES[index % UNSPLASH_IMAGES.length];

    const txType = property.listingType ?? property.transactionType ?? 'SALE';
    const propType = property.propertyType ?? property.type ?? 'APARTMENT';
    const beds = property.bedrooms ?? property.bhk;
    const hasRERA = property.verification?.reraStatus === 'VERIFIED';
    const has3D = property.virtualTour?.status === 'READY';
    const isOwnerV = property.owner?.aadhaarVerified;

    return (
        <Link href={`/properties/${property.id}`} className="block h-full">
            <div className="group rounded-2xl overflow-hidden bg-white border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer h-full">

                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                    <Image
                        src={imgSrc}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                    {/* Top-left badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5">
                        {hasRERA && (
                            <span className="bg-[#1B4332] text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wide">
                                RERA ✓
                            </span>
                        )}
                        {isOwnerV && (
                            <span className="bg-white/90 backdrop-blur-sm text-[#1B4332] text-[10px] font-bold px-2 py-1 rounded-md">
                                Owner Direct
                            </span>
                        )}
                    </div>

                    {/* Favorite */}
                    <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l); onSave?.(property.id); }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-sm">
                        <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>

                    {/* 3D View */}
                    {has3D && (
                        <button onClick={e => e.preventDefault()}
                            className="absolute bottom-3 right-3 bg-[#E07B39] hover:bg-[#C96B2F] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                            <Boxes className="w-3.5 h-3.5" />
                            3D View
                        </button>
                    )}

                    {/* Type label */}
                    <span className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {propType.replace('_', ' ')}
                    </span>
                </div>

                {/* Body */}
                <div className="p-4">
                    <p className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        {formatPrice(property.price, txType)}
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mb-1 line-clamp-1">{property.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-[#1B4332]" />
                        {property.locality}, {property.city}
                    </p>
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                        {beds != null && (
                            <span className="flex items-center gap-1">
                                <BedDouble className="w-3.5 h-3.5" /> {beds} BHK
                            </span>
                        )}
                        {property.bathrooms != null && (
                            <span className="flex items-center gap-1">
                                <Bath className="w-3.5 h-3.5" /> {property.bathrooms} Bath
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Square className="w-3.5 h-3.5" /> {property.sqft} sqft
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default PropertyCard;
