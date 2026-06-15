export function TrustBar() {
    const items = [
        { icon: '🛡️', label: 'Aadhaar-Verified Owners' },
        { icon: '📋', label: 'RERA Registered Properties' },
        { icon: '🤖', label: 'AI Virtual Tours' },
        { icon: '💬', label: 'Direct Owner Chat' },
        { icon: '0️⃣', label: 'Zero Brokerage' },
    ];
    return (
        <div className="bg-[#1B4332] py-4 px-6 md:px-12 lg:px-20 overflow-x-auto no-scrollbar">
            <div className="flex items-center justify-start lg:justify-between gap-6 min-w-max">
                {items.map(({ icon, label }, i) => (
                    <div key={label} className="flex items-center">
                        <div className="flex items-center gap-2.5 text-white/85 text-[13px] font-medium font-sans whitespace-nowrap">
                            <span className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-base shrink-0">{icon}</span>
                            {label}
                        </div>
                        {i < items.length - 1 && <span className="w-px h-7 bg-white/20 ml-6 hidden md:block" />}
                    </div>
                ))}
            </div>
        </div>
    );
}
