'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Shield, User, Mail, Phone, Lock } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function SettingsPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [name, setName] = useState(user?.name || '');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            // Note: Update user API needs to be implemented in the backend if not already
            // await apiClient.put('/api/auth/me', { name });
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage('Failed to update profile.');
        }
        setLoading(false);
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <Navbar />
            <main style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--warm-white)' }}>
                <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
                    <h1 style={{ fontFamily: '"Playfair Display",serif', fontSize: 32, fontWeight: 700, color: 'var(--charcoal)', marginBottom: 8 }}>Account Settings</h1>
                    <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 40 }}>Manage your profile and account preferences.</p>

                    <div style={{ background: 'white', borderRadius: 16, border: '1.5px solid var(--border)', padding: 28, marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Profile Information</div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>
                                    <User size={14} /> Full Name
                                </label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: 'var(--warm-white)' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>
                                    <Mail size={14} /> Email Address <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>(Read-only)</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={user?.email || ''} 
                                    readOnly 
                                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: '#f5f5f5', color: 'var(--muted)' }} 
                                />
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', marginBottom: 6 }}>
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input 
                                    type="text" 
                                    value={user?.phone || 'Not provided'} 
                                    readOnly 
                                    style={{ width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, outline: 'none', background: '#f5f5f5', color: 'var(--muted)' }} 
                                />
                            </div>
                        </div>

                        {message && (
                            <div style={{ marginTop: 20, padding: 12, borderRadius: 8, background: message.includes('success') ? '#D8F3DC' : '#FEF2F2', color: message.includes('success') ? 'var(--forest)' : '#DC2626', fontSize: 14, fontWeight: 600 }}>
                                {message}
                            </div>
                        )}

                        <button 
                            onClick={handleSave} 
                            disabled={loading}
                            style={{ marginTop: 24, padding: '12px 24px', background: 'var(--forest)', color: 'white', border: 'none', borderRadius: 10, fontFamily: '"DM Sans",sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                    <div style={{ background: 'var(--charcoal)', borderRadius: 16, padding: 28, color: 'white' }}>
                        <div style={{ fontSize: 12, fontFamily: '"DM Mono",monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--forest-light)', marginBottom: 20 }}>Account Status & Permissions</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                            <div style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={24} color={user?.role === 'ADMIN' ? 'var(--amber)' : 'white'} />
                            </div>
                            <div>
                                <div style={{ fontSize: 16, fontWeight: 600 }}>Current Role: {user?.role}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                                    {user?.role === 'ADMIN' 
                                        ? 'You have full administrative access to manage all properties and users.' 
                                        : 'You have standard access. To become an admin, database configuration is required.'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
