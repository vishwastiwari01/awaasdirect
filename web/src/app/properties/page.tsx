'use client';
import { useState } from 'react';
import { SlidersHorizontal, Grid3X3, List, Search } from 'lucide-react';
import { PropertyCard } from '@/components/properties/PropertyCard';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const SAMPLE_PROPERTIES = Array.from({ length: 9 }, (_, i) => ({
    id: String(i + 1),
    title: [
        '3 BHK Premium Apartment in Whitefield',
        '2 BHK Fully Furnished Flat for Rent',
        '4 BHK Independent Villa — Sarjapur',
        '3 BHK Flat in Gachibowli',
        '2 BHK Near Hitech City',
        '2 BHK Sea-View Apartment — Worli',
        'Spacious 1 BHK in Koramangala',
        'Luxury Penthouse — Banjara Hills',
        'Corner Plot — North-East Facing',
    ][i],
    price: [7_200_000, 24_000, 14_500_000, 13_200_000, 32_000, 45_000_000, 18_000, 85_000_000, 3_800_000][i],
    listingType: ['SALE', 'RENT', 'SALE', 'SALE', 'RENT', 'SALE', 'RENT', 'SALE', 'SALE'][i],
    propertyType: ['APARTMENT', 'APARTMENT', 'VILLA', 'APARTMENT', 'APARTMENT', 'APARTMENT', 'APARTMENT', 'APARTMENT', 'PLOT'][i],
    city: ['Bangalore', 'Bangalore', 'Bangalore', 'Hyderabad', 'Hyderabad', 'Mumbai', 'Bangalore', 'Hyderabad', 'Hyderabad'][i],
    locality: ['Whitefield', 'Indiranagar', 'Sarjapur', 'Gachibowli', 'Hitech City', 'Worli', 'Koramangala', 'Banjara Hills', 'Kompally'][i],
    bedrooms: [3, 2, 4, 3, 2, 2, 1, 4, 0][i],
    bathrooms: [2, 2, 4, 3, 2, 2, 1, 4, 0][i],
    sqft: [1580, 1100, 3200, 1420, 980, 1050, 650, 4200, 1200][i],
    images: [] as string[],
}));

const CITIES = ['Bangalore', 'Hyderabad', 'Mumbai', 'Pune', 'Delhi'];
const TYPES = ['Apartment', 'House', 'Villa', 'Plot', 'PG / Hostel', 'Commercial'];
const BHKS = ['1', '2', '3', '4', '5+'];
const AMENITIES = ['Parking', 'Gym', 'Swimming Pool', 'Garden', 'Lift', 'Power Backup', 'Security', 'Club House'];

export default function PropertiesPage() {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [listingType, setListingType] = useState('all');
    const [selectedCity, setSelectedCity] = useState('');
    const [sort, setSort] = useState('Best Match');

    const filtered = SAMPLE_PROPERTIES.filter(p => {
        if (listingType !== 'all' && p.listingType !== listingType) return false;
        if (selectedCity && p.city !== selectedCity) return false;
        return true;
    });

    return (
        <>
            <Navbar />
            <div className="pt-16 min-h-screen bg-[#FDFAF6]">

                {/* Page header */}
                <div className="bg-white border-b border-gray-100 px-6 lg:px-12 py-6">
                    <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair, "Playfair Display", serif)' }}>
                        Properties in India
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Showing {filtered.length} verified properties · Owner direct · Zero brokerage
                    </p>
                </div>

                <div className="flex max-w-7xl mx-auto px-4 lg:px-8 py-8 gap-8">

                    {/* ── Sidebar ── */}
                    <div className="hidden lg:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">

                            {/* Listing type toggle */}
                            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
                                {[['all', 'All'], ['RENT', 'For Rent'], ['SALE', 'For Sale']].map(([val, label]) => (
                                    <button key={val} onClick={() => setListingType(val)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${listingType === val ? 'bg-[#1B4332] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                            }`}>{label}</button>
                                ))}
                            </div>

                            {/* Search */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input placeholder="Search by keyword..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-[#1B4332] transition-all" />
                            </div>

                            {/* Property Type */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Property Type</h4>
                                <div className="flex flex-col gap-2">
                                    {TYPES.map(type => (
                                        <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
                                            <input type="checkbox" className="w-4 h-4 accent-[#1B4332] rounded" />
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* City */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">City</h4>
                                <div className="flex flex-wrap gap-2">
                                    {CITIES.map(city => (
                                        <button key={city}
                                            onClick={() => setSelectedCity(c => c === city ? '' : city)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedCity === city
                                                    ? 'bg-[#1B4332] text-white border-[#1B4332]'
                                                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#1B4332]'
                                                }`}>{city}</button>
                                    ))}
                                </div>
                            </div>

                            {/* BHK */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Bedrooms (BHK)</h4>
                                <div className="flex gap-2">
                                    {BHKS.map(bhk => (
                                        <button key={bhk}
                                            className="flex-1 py-2 rounded-lg text-xs font-semibold border border-gray-200 bg-gray-50 hover:border-[#1B4332] hover:text-[#1B4332] transition-all">
                                            {bhk}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Amenities</h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {AMENITIES.map(a => (
                                        <label key={a} className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" className="w-3.5 h-3.5 accent-[#1B4332]" />
                                            <span className="text-xs text-gray-600">{a}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-semibold py-3 rounded-xl text-sm transition-all">
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">
                        {/* Top bar */}
                        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-900">{filtered.length} properties</span> found
                            </p>
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="w-4 h-4 text-gray-400 lg:hidden" />
                                <select value={sort} onChange={e => setSort(e.target.value)}
                                    className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-[#1B4332] bg-white">
                                    <option>Best Match</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Newest First</option>
                                </select>
                                <div className="flex bg-gray-100 rounded-xl p-1">
                                    <button onClick={() => setView('grid')}
                                        className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                                        <Grid3X3 className="w-4 h-4 text-gray-600" />
                                    </button>
                                    <button onClick={() => setView('list')}
                                        className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-white shadow-sm' : ''}`}>
                                        <List className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Grid / List */}
                        <div className={view === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5'
                            : 'flex flex-col gap-4'
                        }>
                            {filtered.map((property, i) => (
                                <PropertyCard key={property.id} property={property} index={i} />
                            ))}
                        </div>

                        {filtered.length === 0 && (
                            <div className="text-center py-20 text-gray-400">
                                <p className="text-4xl mb-4">🏠</p>
                                <p className="text-lg font-semibold text-gray-600">No properties found</p>
                                <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
