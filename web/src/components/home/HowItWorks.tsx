export function HowItWorks() {
    const steps = [
        { num: '1', emoji: '🔍', title: 'Search & Discover', desc: 'Browse RERA-verified listings by city, type, and budget with AI-powered natural language search.' },
        { num: '2', emoji: '🏠', title: 'Explore in 3D', desc: 'Take AI-generated virtual tours from your phone — no site visit needed before shortlisting.' },
        { num: '3', emoji: '💬', title: 'Chat Directly', desc: 'Message Aadhaar-verified owners directly. No broker, no commissions, no middlemen.' },
        { num: '4', emoji: '🎉', title: 'Move In!', desc: 'Agree terms, sign your agreement, and move in. That simple — always zero brokerage.' },
    ];

    return (
        <section className="bg-[#FFFDF9] py-16 px-6 md:py-24 md:px-12 lg:px-20 overflow-hidden">
            <div className="text-center mb-12 md:mb-16">
                <span className="font-mono text-xs font-semibold tracking-widest uppercase text-[#52B788] mb-4 block">How It Works</span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-[44px] font-black text-gray-900 leading-tight">Four Steps to Your New Home</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 relative">
                {/* Connecting gradient line (Hidden on mobile) */}
                <div className="hidden lg:block absolute top-[28px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[#52B788] to-[#E07B39] z-0 rounded-full" />

                {steps.map(({ num, emoji, title, desc }) => (
                    <div key={num} className="text-center relative z-10 flex flex-col items-center">
                        {/* Step circle */}
                        <div className="w-14 h-14 bg-white border-2 border-[#52B788] rounded-full flex items-center justify-center mb-5 font-serif text-xl font-black text-[#1B4332] shadow-[0_4px_16px_rgba(82,183,136,0.2)]">
                            {num}
                        </div>

                        {/* Emoji */}
                        <div className="text-3xl mb-3">{emoji}</div>
                        <h3 className="text-base font-bold text-gray-900 mb-2">{title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
