import Link from 'next/link';

export function CTASection() {
    return (
        <section style={{ background: 'linear-gradient(135deg, #0D2818 0%, #1B4332 60%, #2D6A4F 100%)', padding: '96px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Grid overlay */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(82,183,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.05) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(82,183,136,0.2) 0%, transparent 60%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'inline-block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52B788', marginBottom: 16 }}>Ready to Start?</span>
                <h2 style={{
                    fontFamily: 'var(--font-playfair)', fontWeight: 900, color: 'white',
                    fontSize: 'clamp(34px,4.5vw,56px)', lineHeight: 1.1, letterSpacing: '-0.02em',
                    marginBottom: 18,
                }}>
                    Find Your <em style={{ color: '#F4A261', fontStyle: 'italic' }}>Dream Home</em><br />the Direct Way
                </h2>
                <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.6)', maxWidth: 460, margin: '0 auto 36px', lineHeight: 1.65 }}>
                    Join 18,000+ verified owners and buyers who chose zero brokerage.
                </p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
                    <Link href="/properties">
                        <button className="btn-white" style={{ padding: '14px 32px', fontSize: 15 }}>🔍 Browse Listings</button>
                    </Link>
                    <Link href="/register">
                        <button className="btn-outline-white" style={{ padding: '14px 32px', fontSize: 15 }}>List Property Free →</button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
