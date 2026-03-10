'use client';
import { useState } from 'react';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

const POPULAR_CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi NCR', 'Goa'];

export function HeroSection() {
    const [activeTab, setActiveTab] = useState('Buy');
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [budget, setBudget] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        const tab = activeTab === 'Rent' ? 'RENT' : 'SALE';
        const params = new URLSearchParams({ transactionType: tab });
        if (location) params.set('q', location);
        if (propertyType) params.set('type', propertyType.toUpperCase());
        router.push(`/properties?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

            {/* Background */}
            <div className="absolute inset-0 z-0"
                style={{ background: 'linear-gradient(135deg, #0A0F1A 0%, #0D1F12 40%, #1B2838 100%)' }}>

                {/* Animated orbs */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full transition-all"
                    style={{ background: 'radial-gradient(circle, rgba(27,67,50,0.7), transparent)', animation: 'pulse 8s infinite ease-in-out' }} />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(224,123,57,0.4), transparent)', animation: 'pulse 6s infinite 2s ease-in-out' }} />

                {/* Grid */}
                <div className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
                        backgroundSize: '48px 48px',
                    }} />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/80 text-xs font-medium px-4 py-2 rounded-full mb-8 tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 bg-[#52B788] rounded-full animate-pulse" />
                    No Brokers · Direct Owners · RERA Verified
                </div>

                {/* Heading */}
                <h1 className="font-bold text-white leading-tight mb-6"
                    style={{
                        fontFamily: 'var(--font-playfair, "Playfair Display", serif)',
                        fontSize: 'clamp(42px, 8vw, 80px)',
                        letterSpacing: '-0.02em',
                    }}>
                    Find Your Perfect
                    <br />
                    <em className="text-[#52B788] not-italic">Awaas</em>
                    <span className="text-white">, Directly.</span>
                </h1>

                <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
                    India&apos;s first AI-powered direct housing marketplace.
                    Verified owners. Zero commission. Instant 3D tours.
                </p>

                {/* Search card */}
                <div className="bg-white rounded-2xl shadow-2xl p-3 max-w-4xl mx-auto mb-8">

                    {/* Tabs */}
                    <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-3 w-fit mx-auto">
                        {['Buy', 'Rent', 'Plot'].map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab
                                        ? 'bg-[#1B4332] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}>
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Inputs */}
                    <div className="flex flex-col md:flex-row gap-2">
                        {/* Location */}
                        <div className="flex-1 relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={location}
                                onChange={e => setLocation(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                placeholder="City, locality, landmark..."
                                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#1B4332] focus:bg-white transition-all"
                            />
                        </div>

                        {/* Property type */}
                        <div className="relative">
                            <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#1B4332] focus:bg-white transition-all min-w-[160px] cursor-pointer">
                                <option value="">Property Type</option>
                                <option value="APARTMENT">Apartment</option>
                                <option value="VILLA">Villa</option>
                                <option value="INDEPENDENT_HOUSE">House</option>
                                <option value="PLOT">Plot</option>
                                <option value="PG">PG / Hostel</option>
                                <option value="COMMERCIAL">Commercial</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Budget */}
                        <div className="relative">
                            <select value={budget} onChange={e => setBudget(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:border-[#1B4332] focus:bg-white transition-all min-w-[160px] cursor-pointer">
                                <option value="">Budget</option>
                                <option>Under ₹20L</option>
                                <option>₹20L – ₹50L</option>
                                <option>₹50L – ₹1Cr</option>
                                <option>₹1Cr – ₹2Cr</option>
                                <option>Above ₹2Cr</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        {/* Search */}
                        <button onClick={handleSearch}
                            className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white px-8 py-3.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all hover:shadow-lg whitespace-nowrap">
                            <Search className="w-4 h-4" />
                            Search
                        </button>
                    </div>

                    {/* Popular cities */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 flex-wrap">
                        <span className="text-xs text-gray-400 font-medium">Popular:</span>
                        {POPULAR_CITIES.map(city => (
                            <button key={city} onClick={() => { setLocation(city); }}
                                className="text-xs text-[#1B4332] font-semibold bg-[#D8F3DC] px-3 py-1 rounded-full hover:bg-[#1B4332] hover:text-white transition-all">
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-8 flex-wrap">
                    {[
                        ['48,200+', 'Verified Listings'],
                        ['100%', 'Owner Direct'],
                        ['₹0', 'Broker Fees'],
                        ['4.8★', 'User Rating'],
                    ].map(([num, label]) => (
                        <div key={label} className="text-center">
                            <div className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>{num}</div>
                            <div className="text-xs text-white/50 font-medium mt-0.5">{label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;
