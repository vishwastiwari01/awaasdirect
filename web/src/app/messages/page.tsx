'use client';
import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Send } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/store/authStore';
import { timeAgo } from '@/lib/utils';

export default function MessagesPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const qc = useQueryClient();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [msg, setMsg] = useState('');

    useEffect(() => { if (!isAuthenticated) router.push('/login'); }, [isAuthenticated, router]);

    const { data: convos } = useQuery({
        queryKey: ['conversations'],
        queryFn: async () => { const { data } = await apiClient.get('/api/conversations'); return data.data as Array<Record<string, unknown>>; },
        enabled: isAuthenticated,
        refetchInterval: 10_000,
    });

    const { data: msgs } = useQuery({
        queryKey: ['messages', activeId],
        queryFn: async () => { const { data } = await apiClient.get(`/api/messages/${activeId}`); return (data.data as { messages: Array<Record<string, unknown>> }).messages; },
        enabled: !!activeId,
        refetchInterval: 5_000,
    });

    const { mutate: send } = useMutation({
        mutationFn: async () => { await apiClient.post('/api/messages', { conversationId: activeId, content: msg }); },
        onSuccess: () => { setMsg(''); qc.invalidateQueries({ queryKey: ['messages', activeId] }); },
    });

    useEffect(() => { if (convos?.length && !activeId) setActiveId((convos[0] as { id: string }).id); }, [convos, activeId]);

    const activeConvo = convos?.find(c => (c as { id: string }).id === activeId);
    const prop = activeConvo ? (activeConvo.property as { title?: string; city?: string; ownerId?: string } | null) : null;
    const buyer = activeConvo ? (activeConvo.buyer as { name?: string | null } | null) : null;
    const isOwner = user?.id === prop?.ownerId;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, height: '100vh', display: 'flex', background: 'var(--warm-white)' }}>
                {/* Sidebar */}
                <div style={{ width: 340, borderRight: '1.5px solid var(--border)', height: '100%', overflowY: 'auto', background: 'white' }}>
                    <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)' }}>
                        <h2 style={{ fontFamily: '"Playfair Display",serif', fontSize: 20, fontWeight: 700, color: 'var(--charcoal)' }}>Messages</h2>
                        <p style={{ fontSize: 13, color: 'var(--muted)' }}>{convos?.length ?? 0} conversations</p>
                    </div>
                    {convos?.map(c => {
                        const p = c.property as { title?: string; city?: string } | null;
                        const b = c.buyer as { name?: string | null } | null;
                        const lastMsg = (c.messages as Array<{ content: string; createdAt: string }> | undefined)?.[0];
                        return (
                            <div key={(c as { id: string }).id}
                                onClick={() => setActiveId((c as { id: string }).id)}
                                style={{
                                    padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                                    background: activeId === (c as { id: string }).id ? 'var(--forest-pale)' : 'white',
                                    borderLeft: activeId === (c as { id: string }).id ? '3px solid var(--forest)' : '3px solid transparent',
                                    transition: 'all 0.2s',
                                }}>
                                <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--charcoal)', marginBottom: 3 }}>{b?.name ?? 'Buyer'}</div>
                                <div style={{ fontSize: 12, color: 'var(--forest)', marginBottom: 6 }}>{p?.title?.slice(0, 40)}{(p?.title?.length ?? 0) > 40 ? '…' : ''}</div>
                                {lastMsg && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{lastMsg.content.slice(0, 48)}…  · {timeAgo(lastMsg.createdAt)}</div>}
                            </div>
                        );
                    })}
                    {!convos?.length && (
                        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
                            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                            <p style={{ fontSize: 14 }}>No conversations yet.<br />Start by chatting with an owner.</p>
                        </div>
                    )}
                </div>

                {/* Chat window */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {activeId ? (
                        <>
                            {/* Header */}
                            <div style={{ background: 'var(--forest)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{ width: 40, height: 40, background: 'var(--forest-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                    {isOwner ? (buyer?.name?.[0] ?? 'B') : '🏠'}
                                </div>
                                <div>
                                    <div style={{ fontSize: 15, fontWeight: 600 }}>{isOwner ? buyer?.name : 'Property Owner'}</div>
                                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                                        {prop?.title?.slice(0, 50)} · {prop?.city}
                                    </div>
                                </div>
                            </div>

                            {/* Messages */}
                            <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12, background: 'var(--cream)' }}>
                                {msgs?.map(m => {
                                    const sender = m.sender as { id?: string } | null;
                                    const isMe = sender?.id === user?.id;
                                    return (
                                        <div key={(m as { id: string }).id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                            <div style={{
                                                padding: '10px 14px', borderRadius: '14px',
                                                ...(isMe
                                                    ? { borderBottomRightRadius: 4, background: 'var(--forest)', color: 'white' }
                                                    : { borderBottomLeftRadius: 4, background: 'white', border: '1px solid var(--border)', color: 'var(--charcoal)' }),
                                                fontSize: 14, lineHeight: 1.5,
                                            }}>
                                                {m.content as string}
                                            </div>
                                            <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4, textAlign: isMe ? 'right' : 'left', padding: '0 4px' }}>
                                                {timeAgo(m.createdAt as string)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input */}
                            <div style={{ padding: '16px 24px', borderTop: '1.5px solid var(--border)', background: 'white', display: 'flex', gap: 12 }}>
                                <input
                                    value={msg} onChange={e => setMsg(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && msg.trim() && send()}
                                    placeholder="Type a message…"
                                    style={{ flex: 1, padding: '12px 16px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }}
                                />
                                <button
                                    onClick={() => msg.trim() && send()}
                                    style={{ width: 44, height: 44, background: 'var(--forest)', border: 'none', borderRadius: 10, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Send size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 16, color: 'var(--muted)' }}>
                            <div style={{ fontSize: 60 }}>💬</div>
                            <h3 style={{ fontFamily: '"Playfair Display",serif', fontSize: 22 }}>Select a conversation</h3>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
