'use client';
import Link from 'next/link';

export function Footer() {
    const cols = [
        {
            title: 'Discover',
            links: [
                { label: 'Buy a Home', href: '/properties?transactionType=SALE' },
                { label: 'Rent a Flat', href: '/properties?transactionType=RENT' },
                { label: 'Buy a Plot', href: '/properties?type=PLOT' },
                { label: 'Commercial', href: '/properties?type=COMMERCIAL' },
                { label: 'PG / Hostel', href: '/properties?type=PG' },
                { label: 'New Projects', href: '/properties' },
            ],
        },
        {
            title: 'AI Tools',
            links: [
                { label: 'AI Floor Plan', href: '/ai-planner' },
                { label: '3D Virtual Tour', href: '/properties' },
                { label: 'AI Property Search', href: '/properties' },
                { label: 'Price Trends', href: '/' },
                { label: 'EMI Calculator', href: '/' },
                { label: 'Locality Report', href: '/' },
            ],
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/' },
                { label: 'How it Works', href: '/' },
                { label: 'RERA Compliance', href: '/' },
                { label: 'Careers', href: '/' },
                { label: 'Privacy Policy', href: '/' },
                { label: 'Terms of Use', href: '/' },
            ],
        },
    ];

    return (
        <footer style={{ background: '#1A1A1A', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-sans)' }}>
            <div style={{ padding: '64px 80px 40px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 56 }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#1B4332,#2D6A4F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 17 }}>🏠</span>
                            </div>
                            <span style={{ fontFamily: 'var(--font-playfair)', fontSize: 20, fontWeight: 700, color: 'white' }}>
                                Awaas<span style={{ color: '#E07B39' }}>Direct</span>
                            </span>
                        </div>
                        <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 280, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
                            India&apos;s first broker-free property marketplace. Verified owners, RERA-listed properties, zero commission.
                        </p>
                        {/* Compliance badges */}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {['RERA', 'AADHAAR', 'DPDP ACT', 'ISO 27001'].map(b => (
                                <span key={b} style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 6, padding: '4px 10px',
                                    fontSize: 9, fontFamily: 'var(--font-mono)',
                                    color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em',
                                }}>{b}</span>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {cols.map(({ title, links }) => (
                        <div key={title}>
                            <h4 style={{ fontSize: 12, fontWeight: 700, color: 'white', letterSpacing: '0.08em', marginBottom: 18, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>{title}</h4>
                            {links.map(({ label, href }) => (
                                <Link key={label} href={href} style={{
                                    display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.45)',
                                    textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#52B788'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
                                >{label}</Link>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div style={{ paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                    <span>© 2026 AwaasDirect Technologies Pvt. Ltd. · Made with ❤️ in India</span>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy', 'Terms', 'Grievance Officer', 'Sitemap'].map(l => (
                            <Link key={l} href="/" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#52B788'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
                            >{l}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
