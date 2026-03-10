'use client';
import Link from 'next/link';
import { Building2, Home, Castle, MapPinned, Store, BedSingle } from 'lucide-react';

const CATS = [
    { Icon: Building2, label: 'Apartments', count: '12,400+', type: 'APARTMENT', color: '#1B4332', bg: '#D8F3DC' },
    { Icon: Home, label: 'Houses', count: '5,800+', type: 'INDEPENDENT_HOUSE', color: '#92400E', bg: '#FDE68A' },
    { Icon: Castle, label: 'Villas', count: '3,200+', type: 'VILLA', color: '#1E3A5F', bg: '#DBEAFE' },
    { Icon: MapPinned, label: 'Plots', count: '8,100+', type: 'PLOT', color: '#4C1D95', bg: '#EDE9FE' },
    { Icon: Store, label: 'Commercial', count: '2,600+', type: 'COMMERCIAL', color: '#1A1A2E', bg: '#E0E7FF' },
    { Icon: BedSingle, label: 'PG/Hostel', count: '4,900+', type: 'PG', color: '#7C2D12', bg: '#FED7AA' },
];

export function CategoriesSection() {
    return (
        <section style={{ background: 'var(--warm-white)', padding: '96px 80px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 44 }}>
                <div>
                    <span className="section-label">Browse by Type</span>
                    <h2 className="section-title">Every Kind of Home,<br />One Platform</h2>
                </div>
                <Link href="/properties" style={{ textDecoration: 'none' }}>
                    <button className="btn-ghost" style={{ padding: '10px 22px', fontSize: 13 }}>View All →</button>
                </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 16 }}>
                {CATS.map(({ Icon, label, count, type, color, bg }) => (
                    <Link key={type} href={`/properties?type=${type}`} style={{ textDecoration: 'none' }}>
                        <div
                            style={{
                                background: 'white', borderRadius: 20, padding: '26px 18px',
                                textAlign: 'center', border: '1.5px solid #F0EBE3',
                                cursor: 'pointer', transition: 'all 0.25s',
                            }}
                            onMouseEnter={e => {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.transform = 'translateY(-5px)';
                                el.style.boxShadow = `0 16px 40px rgba(0,0,0,0.1)`;
                                el.style.borderColor = color;
                            }}
                            onMouseLeave={e => {
                                const el = e.currentTarget as HTMLDivElement;
                                el.style.transform = 'translateY(0)';
                                el.style.boxShadow = 'none';
                                el.style.borderColor = '#F0EBE3';
                            }}
                        >
                            <div style={{
                                width: 52, height: 52, borderRadius: 14, background: bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 14px',
                                transition: 'transform 0.25s',
                            }}>
                                <Icon size={24} color={color} strokeWidth={1.8} />
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{label}</div>
                            <div style={{ fontSize: 11, color: '#6B6B6B', fontFamily: 'var(--font-mono)' }}>{count}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
