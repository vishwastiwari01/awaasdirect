import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: string;
    name: string | null;
    email: string | null;
    role: 'BUYER' | 'OWNER' | 'ADMIN';
    aadhaarVerified: boolean;
    image?: string | null;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            setAuth: (user, accessToken, refreshToken) => {
                // Also store in localStorage for Axios interceptor
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                }
                set({ user, accessToken, refreshToken, isAuthenticated: true });
            },

            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                }
                set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
            },

            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        { name: 'awaasdirect-auth' }
    )
);
