import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15_000,
});

// Attach JWT token from localStorage on every request
apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const { data } = await axios.post(`${API_URL}/api/auth/refresh`, { refreshToken });
                    const newToken = data.data.tokens.accessToken;
                    localStorage.setItem('accessToken', newToken);
                    original.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(original);
                }
            } catch {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
