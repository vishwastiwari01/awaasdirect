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
        <section className="bg-[#0D2818] text-white relative overflow-hidden py-16 px-6 md:py-24 md:px-20">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(27,67,50,0.5) 0%, transparent 65%)' }} />
                <div className="absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(224,123,57,0.12) 0%, transparent 65%)' }} />
                {/* Grid lines */}
                <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(82,183,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(82,183,136,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
                {/* ── Left: copy ── */}
                <div>
                    <span className="block font-mono text-[11px] font-medium tracking-[0.15em] uppercase text-[#52B788] mb-3.5">AI House Planner</span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-[48px] font-black leading-[1.12] text-white mb-4">
                        Design Your<br />
                        <em className="italic text-[#F4A261]">Dream Floor Plan</em><br />
                        with AI
                    </h2>
                    <p className="text-base text-white/60 leading-[1.7] max-w-[480px] mb-10">
                        Enter plot dimensions, floors and style — our AI returns a Vastu-compliant 2D floor plan with labeled rooms in under 30 seconds.
                    </p>

                    <div className="flex flex-col gap-4.5">
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} className="flex gap-4 items-start">
                                <div className="w-[42px] h-[42px] rounded-[11px] bg-[#52B788]/10 border border-[#52B788]/20 flex items-center justify-center shrink-0 mb-4 lg:mb-0">
                                    {icon}
                                </div>
                                <div>
                                    <h4 className="text-[15px] font-semibold text-white mb-1">{title}</h4>
                                    <p className="text-[13px] text-white/50 leading-[1.55]">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Right: glass card ── */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-7 backdrop-blur-md">
                    <div className="text-xs font-bold font-mono tracking-[0.12em] text-[#52B788] uppercase mb-5 flex items-center gap-2">
                        <Sparkles size={14} /> AI Floor Plan Generator
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                        {[['Plot Length (ft)', len, setLen, '40'], ['Plot Width (ft)', wid, setWid, '60']].map(([label, val, setter, ph]) => (
                            <div key={label as string}>
                                <label className="label">{label as string}</label>
                                <input value={val as string} onChange={e => (setter as (v: string) => void)(e.target.value)} placeholder={ph as string} className="ai-input w-full" />
                            </div>
                        ))}
                        <div>
                            <label className="label">Floors</label>
                            <select value={floors} onChange={e => setFloors(e.target.value)} className="ai-input w-full">
                                {['1', '2', '3', '4'].map(n => <option key={n} value={n}>{n} Floor{+n > 1 ? 's' : ''}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Style</label>
                            <select value={style} onChange={e => setStyle(e.target.value)} className="ai-input w-full text-black">
                                {['modern', 'traditional', 'contemporary', 'vastu'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                        </div>
                    </div>

                    <Link href={`/ai-planner?length=${len}&width=${wid}&floors=${floors}&style=${style}`} className="w-full p-3.5 border-none rounded-xl cursor-pointer bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] text-white font-sans text-[15px] font-bold flex items-center justify-center gap-2.5 transition-all mb-4 shadow-[0_4px_16px_rgba(27,67,50,0.4)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(82,183,136,0.3)] no-underline">
                        <Sparkles size={16} /> Generate Floor Plan
                    </Link>

                    {/* Room preview */}
                    <div className="bg-black/20 rounded-2xl p-3.5">
                        <div className="text-[10px] font-mono uppercase tracking-[0.1em] text-white/40 mb-2.5">Sample Output</div>
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { e: '🛋️', label: 'Living Room', dim: '18×14 ft' },
                                { e: '🍳', label: 'Kitchen', dim: '12×10 ft' },
                                { e: '🛏️', label: 'Master BR', dim: '14×12 ft' },
                                { e: '🚿', label: 'Bathroom', dim: '8×6 ft' },
                            ].map(({ e, label, dim }) => (
                                <div key={label} className="bg-white/5 rounded-xl p-2.5 px-3 border border-white/5 transition-all cursor-pointer hover:border-[#52B788]/40 hover:bg-[#52B788]/10">
                                    <div className="text-lg mb-1">{e}</div>
                                    <div className="text-[11px] font-semibold text-white/80">{label}</div>
                                    <div className="text-[10px] text-white/40 font-mono">{dim}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
