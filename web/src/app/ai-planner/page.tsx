'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Sparkles, Download, RefreshCw, Layers, Map, DollarSign, Compass } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';

interface GenerateResult {
    id: string;
    status: string;
    layoutJson: unknown;
    floorPlanUrl: string | null;
    generationMs: number;
}

const STYLE_OPTIONS = ['modern', 'traditional', 'contemporary', 'vastu'];
const FLOOR_OPTIONS = ['1', '2', '3', '4'];

export default function AIPlannerPage() {
    const params = useSearchParams();
    const { isAuthenticated } = useAuthStore();

    const [plotLength, setPlotLength] = useState(params.get('length') ?? '40');
    const [plotWidth, setPlotWidth] = useState(params.get('width') ?? '60');
    const [floors, setFloors] = useState(params.get('floors') ?? '2');
    const [style, setStyle] = useState(params.get('style') ?? 'modern');
    const [propertyId, setPropertyId] = useState(params.get('propertyId') ?? '');
    const [bedrooms, setBedrooms] = useState(3);
    const [bathrooms, setBathrooms] = useState(2);
    const [parking, setParking] = useState(1);
    const [poojaRoom, setPoojaRoom] = useState(true);
    const [result, setResult] = useState<GenerateResult | null>(null);

    const { mutate: generate, isPending, error } = useMutation({
        mutationFn: async (): Promise<GenerateResult> => {
            if (!propertyId) throw new Error('Enter a Property ID (must be a PLOT listing)');
            const { data } = await apiClient.post('/api/ai/floor-plan', {
                propertyId,
                plotLength: +plotLength, plotWidth: +plotWidth, floors: +floors,
                stylePrefs: style,
                roomPrefs: { bedrooms, bathrooms, kitchen: 1, hall: 1, pooja: poojaRoom, parking },
            });
            return data.data as GenerateResult;
        },
        onSuccess: setResult,
    });

    const errMsg = (error as Error | null)?.message
        ?? (error as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '';

    const selectStyle = {
        width: '100%', padding: '11px 14px', borderRadius: 12, outline: 'none', cursor: 'pointer',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        color: 'white', fontFamily: 'var(--font-sans)', fontSize: 13, appearance: 'none' as const,
    };
    const inputStyle = {
        width: '100%', padding: '11px 14px', borderRadius: 12, outline: 'none',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
        color: 'white', fontFamily: 'var(--font-sans)', fontSize: 13,
    };

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: '#0D2818' }}>
                {/* ── Hero section ── */}
                <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 80px 64px' }}>
                    {/* Background effects */}
                    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                        <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(27,67,50,0.6) 0%, transparent 65%)' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,123,57,0.1) 0%, transparent 65%)' }} />
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(82,183,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'flex-start', position: 'relative', zIndex: 1, color: 'white' }}>
                        {/* ── Left ── */}
                        <div>
                            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52B788', marginBottom: 14 }}>AI House Planner</span>
                            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: 'clamp(36px, 4vw, 52px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: 'white' }}>
                                Generate Your<br />
                                <em style={{ color: '#F4A261', fontStyle: 'italic' }}>Dream Floor Plan</em><br />
                                with AI
                            </h1>
                            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 460, marginBottom: 40 }}>
                                Enter your plot dimensions and preferences. Our AI creates a Vastu-compliant floor plan, 3D view, cost estimate and Vastu report — in under 30 seconds.
                            </p>

                            {/* Feature list */}
                            {[
                                { icon: <Layers size={16} color="#52B788" />, t: 'Vastu-Compliant Layouts', d: 'Factors direction, sunlight and traditional Vastu rules' },
                                { icon: <Map size={16} color="#52B788" />, t: 'Precise Room Dimensions', d: 'Every room labeled with area and optimal placement' },
                                { icon: <RefreshCw size={16} color="#52B788" />, t: '3 Free Regenerations', d: 'Change inputs and regenerate up to 3 times per plot' },
                                { icon: <Compass size={16} color="#52B788" />, t: 'Compliant Design', d: 'NBCC and municipal by-law guidelines followed by default' },
                            ].map(({ icon, t, d }) => (
                                <div key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
                                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(82,183,136,0.12)', border: '1px solid rgba(82,183,136,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                                    <div>
                                        <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>{t}</div>
                                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>{d}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Right: form ── */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 28, backdropFilter: 'blur(12px)' }}>
                            <div style={{ fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-mono)', letterSpacing: '0.12em', color: '#52B788', textTransform: 'uppercase', marginBottom: 22, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Sparkles size={14} /> Configure Your Floor Plan
                            </div>

                            {/* Property ID */}
                            <div style={{ marginBottom: 16 }}>
                                <label className="label">Plot Property ID</label>
                                <input value={propertyId} onChange={e => setPropertyId(e.target.value)} placeholder="Enter the CUID of a PLOT listing" style={inputStyle} />
                                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>Found in the URL on the plot detail page</div>
                            </div>

                            {/* Plot dims + floors + style */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                {[['Plot Length (ft)', plotLength, setPlotLength, '40'], ['Plot Width (ft)', plotWidth, setPlotWidth, '60']].map(([lbl, val, setter, ph]) => (
                                    <div key={lbl as string}>
                                        <label className="label">{lbl as string}</label>
                                        <input type="number" value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string} style={inputStyle} />
                                    </div>
                                ))}
                                <div>
                                    <label className="label">Floors</label>
                                    <select value={floors} onChange={e => setFloors(e.target.value)} style={selectStyle}>
                                        {FLOOR_OPTIONS.map(n => <option key={n} value={n}>{n} Floor{+n > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Style</label>
                                    <select value={style} onChange={e => setStyle(e.target.value)} style={selectStyle}>
                                        {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Room prefs */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 12 }}>Room Requirements</div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                    {[['Bedrooms', bedrooms, setBedrooms], ['Bathrooms', bathrooms, setBathrooms], ['Parking', parking, setParking]].map(([lbl, val, setter]) => (
                                        <div key={lbl as string}>
                                            <label className="label">{lbl as string}</label>
                                            <input type="number" min={0} max={10} value={val as number} onChange={e => (setter as (v: number) => void)(+e.target.value)} style={inputStyle} />
                                        </div>
                                    ))}
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, cursor: 'pointer', fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-sans)' }}>
                                    <input type="checkbox" checked={poojaRoom} onChange={e => setPoojaRoom(e.target.checked)} style={{ accentColor: '#52B788', width: 15, height: 15 }} />
                                    Include Pooja Room
                                </label>
                            </div>

                            {/* Warnings */}
                            {errMsg && <div style={{ background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.25)', borderRadius: 10, padding: '10px 14px', color: '#FCA5A5', fontSize: 13, marginBottom: 12, fontFamily: 'var(--font-sans)' }}>{errMsg}</div>}
                            {!isAuthenticated && <div style={{ background: 'rgba(224,123,57,0.12)', border: '1px solid rgba(224,123,57,0.25)', borderRadius: 10, padding: '10px 14px', color: '#FCD34D', fontSize: 13, marginBottom: 12, fontFamily: 'var(--font-sans)' }}>⚠️ You must be signed in and Aadhaar-verified to generate floor plans.</div>}

                            {/* Generate button */}
                            <button
                                onClick={() => generate()}
                                disabled={isPending}
                                style={{
                                    width: '100%', padding: '14px', border: 'none', borderRadius: 12,
                                    cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.8 : 1,
                                    background: 'linear-gradient(135deg, #1B4332, #2D6A4F)',
                                    color: 'white', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                                    transition: 'all 0.25s',
                                    boxShadow: '0 4px 16px rgba(27,67,50,0.5)',
                                }}
                                onMouseEnter={e => !isPending && (e.currentTarget.style.boxShadow = '0 12px 32px rgba(82,183,136,0.35)')}
                                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(27,67,50,0.5)')}
                            >
                                {isPending
                                    ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating (30–60s)…</>
                                    : <><Sparkles size={16} /> Generate Floor Plan</>}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ── Results section ── */}
                {result && (
                    <section style={{ padding: '0 80px 80px', position: 'relative', zIndex: 1, color: 'white' }}>
                        <div style={{ textAlign: 'center', marginBottom: 48 }}>
                            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#52B788', marginBottom: 10 }}>Generation Complete</span>
                            <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 8 }}>Your AI Floor Plan is Ready!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Generated in {((result.generationMs ?? 0) / 1000).toFixed(1)}s</p>
                        </div>

                        {/* 4 output cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 40 }}>
                            {[
                                { icon: <Layers size={22} color="#52B788" />, title: 'Floor Plan', desc: '2D room layout with dimensions', badge: 'READY', accent: '#52B788' },
                                { icon: <Map size={22} color="#F4A261" />, title: '3D View', desc: 'Rendered 3D exterior preview', badge: 'BETA', accent: '#F4A261' },
                                { icon: <DollarSign size={22} color="#60A5FA" />, title: 'Cost Estimate', desc: 'Construction cost breakdown', badge: 'EST.', accent: '#60A5FA' },
                                { icon: <Compass size={22} color="#A78BFA" />, title: 'Vastu Report', desc: 'Room and direction compliance', badge: 'PASS', accent: '#A78BFA' },
                            ].map(({ icon, title, desc, badge, accent }) => (
                                <div key={title} style={{
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 18, padding: '24px 20px', textAlign: 'center',
                                    transition: 'all 0.25s', cursor: 'pointer',
                                }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = accent; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.08)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)'; }}
                                >
                                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${accent}18`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{icon}</div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 4 }}>{title}</div>
                                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>{desc}</div>
                                    <span style={{ background: `${accent}20`, color: accent, fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-mono)', padding: '3px 9px', borderRadius: 999, letterSpacing: '0.08em' }}>{badge}</span>
                                </div>
                            ))}
                        </div>

                        {/* Floor plan image */}
                        {result.floorPlanUrl && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={result.floorPlanUrl} alt="AI Floor Plan" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: 'var(--font-playfair)', fontSize: 22, fontWeight: 700, color: 'white', marginBottom: 20 }}>Room Layout</h3>
                                    {(() => {
                                        const lj = result.layoutJson as { floors?: Array<{ level: string; rooms: Array<{ name: string; dimensions: string }> }> } | null;
                                        return lj?.floors?.map(f => (
                                            <div key={f.level} style={{ marginBottom: 16 }}>
                                                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#52B788', marginBottom: 8 }}>{f.level} Floor</div>
                                                {f.rooms.map(r => (
                                                    <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: 8, marginBottom: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
                                                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{r.name}</span>
                                                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{r.dimensions}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ));
                                    })()}
                                    <a href={result.floorPlanUrl} download="floor-plan.png" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                                        <button className="btn-accent" style={{ padding: '12px 24px' }}>
                                            <Download size={15} /> Download Plan
                                        </button>
                                    </a>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
