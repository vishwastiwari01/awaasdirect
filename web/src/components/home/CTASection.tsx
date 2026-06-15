import Link from 'next/link';

export function CTASection() {
    return (
        <section className="bg-gradient-to-br from-[#0D2818] via-[#1B4332] to-[#2D6A4F] py-16 px-6 md:py-24 md:px-20 text-center relative overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(82,183,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.05) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(82,183,136,0.2) 0%, transparent 60%)' }} />

            <div className="relative z-10 max-w-2xl mx-auto">
                <span className="inline-block font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-[#52B788] mb-4">Ready to Start?</span>
                <h2 className="font-serif font-black text-white text-4xl md:text-5xl lg:text-[56px] leading-[1.1] tracking-tight mb-5">
                    Find Your <em className="text-[#F4A261] italic">Dream Home</em><br />the Direct Way
                </h2>
                <p className="text-[17px] text-white/60 max-w-[460px] mx-auto mb-9 leading-relaxed">
                    Join 18,000+ verified owners and buyers who chose zero brokerage.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/properties" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-white text-[#1B4332] hover:bg-gray-100 px-8 py-3.5 rounded-full font-semibold text-[15px] transition-colors shadow-lg">
                            🔍 Browse Listings
                        </button>
                    </Link>
                    <Link href="/register" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-transparent text-white border border-white/30 hover:bg-white/10 px-8 py-3.5 rounded-full font-semibold text-[15px] transition-colors">
                            List Property Free &rarr;
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
