import axios from 'axios';
import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
});

// Attach the Supabase access token on every request
apiClient.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        // First try localStorage (fastest, set by authStore)
        const cached = localStorage.getItem('accessToken');
        if (cached) {
            config.headers.Authorization = `Bearer ${cached}`;
            return config;
        }
        // Fallback: get fresh token from Supabase
        try {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                localStorage.setItem('accessToken', session.access_token);
                config.headers.Authorization = `Bearer ${session.access_token}`;
            }
        } catch {
            // No session — request will proceed unauthenticated
        }
    }
    return config;
});

// On 401: refresh Supabase session and retry once
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const supabase = createClient();
                const { data: { session } } = await supabase.auth.refreshSession();
                if (session?.access_token) {
                    localStorage.setItem('accessToken', session.access_token);
                    original.headers.Authorization = `Bearer ${session.access_token}`;
                    return apiClient(original);
                }
            } catch {
                // Refresh failed — sign out
            }
            // No valid session → redirect to login
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
