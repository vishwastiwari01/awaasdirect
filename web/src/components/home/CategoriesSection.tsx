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
        <section className="bg-[#FAFAFA] py-16 px-6 md:py-24 md:px-12 lg:px-20 overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
                <div>
                    <span className="font-mono text-xs font-semibold tracking-widest uppercase text-[#52B788] mb-4 block">Browse by Type</span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] font-black text-gray-900 leading-tight">
                        Every Kind of Home,<br className="hidden md:block" />One Platform
                    </h2>
                </div>
                <Link href="/properties" className="px-5 py-2.5 text-sm font-semibold rounded-full border border-gray-200 hover:border-[#1B4332] hover:bg-gray-50 transition-colors no-underline inline-block text-gray-900">
                    View All &rarr;
                </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATS.map(({ Icon, label, count, type, color, bg }) => (
                    <Link key={type} href={`/properties?type=${type}`} className="no-underline group">
                        <div
                            className="bg-white rounded-2xl p-6 text-center border-[1.5px] border-[#F0EBE3] cursor-pointer transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
                            style={{ borderColor: 'var(--border-color, #F0EBE3)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.setProperty('--border-color', color))}
                            onMouseLeave={(e) => (e.currentTarget.style.setProperty('--border-color', '#F0EBE3'))}
                        >
                            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ backgroundColor: bg }}>
                                <Icon size={24} color={color} strokeWidth={1.8} />
                            </div>
                            <div className="text-sm font-bold text-gray-900 mb-1">{label}</div>
                            <div className="text-xs text-gray-500 font-mono">{count}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
