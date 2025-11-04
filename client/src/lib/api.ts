import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const response = await axios.post(
                    `${API_URL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken } = response.data.data;

                // Store new access token
                localStorage.setItem('accessToken', accessToken);

                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    // Register new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Google OAuth
    googleAuth: async (googleData) => {
        const response = await api.post('/auth/google', googleData);
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Logout
    logout: async () => {
        const response = await api.post('/auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },

    // Verify email
    verifyEmail: async (token) => {
        const response = await api.get(`/auth/verify/${token}`);
        return response.data;
    },

    // Resend verification email
    resendVerification: async (email) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },

    // Forgot password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    },

    // Refresh token
    refreshToken: async () => {
        const response = await api.post('/auth/refresh');
        if (response.data.success) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        return response.data;
    },

    // Update profile
    updateProfile: async (profileData: { username?: string; email?: string; profilePicture?: string }) => {
        const response = await api.put('/auth/profile', profileData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    }
};

export default api;
