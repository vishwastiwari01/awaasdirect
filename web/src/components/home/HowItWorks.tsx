export function HowItWorks() {
    const steps = [
        { num: '1', emoji: '🔍', title: 'Search & Discover', desc: 'Browse RERA-verified listings by city, type, and budget with AI-powered natural language search.' },
        { num: '2', emoji: '🏠', title: 'Explore in 3D', desc: 'Take AI-generated virtual tours from your phone — no site visit needed before shortlisting.' },
        { num: '3', emoji: '💬', title: 'Chat Directly', desc: 'Message Aadhaar-verified owners directly. No broker, no commissions, no middlemen.' },
        { num: '4', emoji: '🎉', title: 'Move In!', desc: 'Agree terms, sign your agreement, and move in. That simple — always zero brokerage.' },
    ];

    return (
        <section style={{ background: 'var(--cream)', padding: '96px 80px' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <span className="section-label" style={{ display: 'block', textAlign: 'center' }}>How It Works</span>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 0 }}>Four Steps to Your New Home</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, position: 'relative' }}>
                {/* Connecting gradient line */}
                <div style={{ position: 'absolute', top: 28, left: '15%', right: '15%', height: 2, background: 'linear-gradient(to right, #52B788, #E07B39)', zIndex: 0, borderRadius: 999 }} />

                {steps.map(({ num, emoji, title, desc }) => (
                    <div key={num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                        {/* Step circle */}
                        <div style={{
                            width: 56, height: 56, background: 'white',
                            border: '2px solid #52B788', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 800, color: '#1B4332',
                            boxShadow: '0 4px 16px rgba(82,183,136,0.2)',
                        }}>{num}</div>

                        {/* Emoji */}
                        <div style={{ fontSize: 28, marginBottom: 12 }}>{emoji}</div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{title}</h3>
                        <p style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.65 }}>{desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
