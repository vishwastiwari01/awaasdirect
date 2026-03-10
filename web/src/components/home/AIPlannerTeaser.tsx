'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Layers, Ruler, RefreshCw } from 'lucide-react';

const FEATURES = [
    { icon: <Layers size={18} color="#52B788" />, title: 'Vastu-Compliant Layouts', desc: 'AI factors direction, sunlight and traditional Vastu compliance' },
    { icon: <Ruler size={18} color="#52B788" />, title: 'Precise Dimensions', desc: 'Every room labeled with area and optimal layout position' },
    { icon: <RefreshCw size={18} color="#52B788" />, title: '3 Free Regenerations', desc: 'Adjust inputs, regenerate up to 3 times on the same plot' },
];

export function AIPlannerTeaser() {
    const [len, setLen] = useState('40');
    const [wid, setWid] = useState('60');
    const [floors, setFloors] = useState('2');
    const [style, setStyle] = useState('modern');

    return (
        <section style={{
            background: '#0D2818',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            padding: '96px 80px',
        }}>
            {/* Background effects */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,67,50,0.5) 0%, transparent 65%)' }} />
                <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,123,57,0.12) 0%, transparent 65%)' }} />
                {/* Grid lines */}
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(82,183,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 1 }}>
                {/* ── Left: copy ── */}
                <div>
                    <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52B788', marginBottom: 14 }}>AI House Planner</span>
                    <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 800, lineHeight: 1.12, color: 'white', marginBottom: 16 }}>
                        Design Your<br />
                        <em style={{ fontStyle: 'italic', color: '#F4A261' }}>Dream Floor Plan</em><br />
                        with AI
                    </h2>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 480, marginBottom: 40 }}>
                        Enter plot dimensions, floors and style — our AI returns a Vastu-compliant 2D floor plan with labeled rooms in under 30 seconds.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                                <div style={{ width: 42, height: 42, borderRadius: 11, background: 'rgba(82,183,136,0.12)', border: '1px solid rgba(82,183,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {icon}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 3 }}>{title}</h4>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.55 }}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: glass card ── */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28, backdropFilter: 'blur(10px)' }}>
                    <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#52B788', textTransform: 'uppercase', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Sparkles size={14} /> AI Floor Plan Generator
                    </div>

                    {/* Inputs */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                        {[['Plot Length (ft)', len, setLen, '40'], ['Plot Width (ft)', wid, setWid, '60']].map(([label, val, setter, ph]) => (
                            <div key={label as string}>
                                <label className="label">{label as string}</label>
                                <input value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string} className="ai-input" />
                            </div>
                        ))}
                        <div>
                            <label className="label">Floors</label>
                            <select value={floors} onChange={e => setFloors(e.target.value)} className="ai-input">
                                {['1', '2', '3', '4'].map(n => <option key={n} value={n}>{n} Floor{+n > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Style</label>
                            <select value={style} onChange={e => setStyle(e.target.value)} className="ai-input">
                                {['modern', 'traditional', 'contemporary', 'vastu'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    <Link href={`/ai-planner?length=${len}&width=${wid}&floors=${floors}&style=${style}`}>
                        <button style={{
                            width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer',
                            background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                            color: 'white', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            transition: 'all 0.25s', marginBottom: 16,
                            boxShadow: '0 4px 16px rgba(27,67,50,0.4)',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(82,183,136,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,67,50,0.4)'; }}
                        >
                            <Sparkles size={16} /> Generate Floor Plan
                        </button>
                    </Link>

                    {/* Room preview */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 14, padding: 14 }}>
                        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>Sample Output</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                { e: '🛋️', label: 'Living Room', dim: '18×14 ft' },
                                { e: '🍳', label: 'Kitchen', dim: '12×10 ft' },
                                { e: '🛏️', label: 'Master BR', dim: '14×12 ft' },
                                { e: '🚿', label: 'Bathroom', dim: '8×6 ft' },
                            ].map(({ e, label, dim }) => (
                                <div key={label} style={{
                                    background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    transition: 'all 0.2s', cursor: 'pointer',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(82,183,136,0.4)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(82,183,136,0.08)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                >
                                    <div style={{ fontSize: 18, marginBottom: 4 }}>{e}</div>
                                    <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>{label}</div>
                                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{dim}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
