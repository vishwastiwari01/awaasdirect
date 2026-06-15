import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';

interface AppUser {
    id: string;
    name: string | null;
    email: string | null;
    role: 'BUYER' | 'OWNER' | 'ADMIN';
    aadhaarVerified: boolean;
    image?: string | null;
}

interface AuthState {
    user: AppUser | null;
    session: Session | null;
    isAuthenticated: boolean;
    // Called after Supabase auth resolves
    setSession: (session: Session | null) => void;
    // Called after role is selected on first login
    setUser: (user: AppUser) => void;
    logout: () => void;
    updateUser: (updates: Partial<AppUser>) => void;
    // Helper: get the current access token (Supabase session token)
    getAccessToken: () => string | null;
}

/** Build a minimal AppUser from a Supabase session */
function userFromSession(session: Session): AppUser {
    const su: SupabaseUser = session.user;
    return {
        id: su.id,
        name: su.user_metadata?.full_name ?? su.user_metadata?.name ?? null,
        email: su.email ?? null,
        role: (su.user_metadata?.role as AppUser['role']) ?? 'BUYER',
        aadhaarVerified: false,
        image: su.user_metadata?.avatar_url ?? null,
    };
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isAuthenticated: false,

            setSession: (session) => {
                if (session) {
                    const user = userFromSession(session);
                    // Store token for Axios interceptor
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('accessToken', session.access_token);
                    }
                    set({ session, user, isAuthenticated: true });
                } else {
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('accessToken');
                    }
                    set({ session: null, user: null, isAuthenticated: false });
                }
            },

            setUser: (user) => set({ user }),

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                }
                set({ session: null, user: null, isAuthenticated: false });
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),

            getAccessToken: () => get().session?.access_token ?? null,
        }),
        {
            name: 'myawaas-auth',
            // Don't persist the full session object (it contains tokens)
            // Supabase SSR will handle session refresh via cookies
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
