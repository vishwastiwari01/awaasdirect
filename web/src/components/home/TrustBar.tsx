export function TrustBar() {
    const items = [
        { icon: '🛡️', label: 'Aadhaar-Verified Owners' },
        { icon: '📋', label: 'RERA Registered Properties' },
        { icon: '🤖', label: 'AI Virtual Tours' },
        { icon: '💬', label: 'Direct Owner Chat' },
        { icon: '0️⃣', label: 'Zero Brokerage' },
    ];
    return (
        <div style={{ background: 'var(--forest)', padding: '16px 80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
            {items.map(({ icon, label }, i) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: i < items.length - 1 ? 0 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500, fontFamily: '"DM Sans",sans-serif' }}>
                        <span style={{ width: 32, height: 32, background: 'rgba(255,255,255,0.12)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{icon}</span>
                        {label}
                    </div>
                    {i < items.length - 1 && <span style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.2)', marginLeft: 24 }} />}
                </div>
            ))}
        </div>
    );
}
