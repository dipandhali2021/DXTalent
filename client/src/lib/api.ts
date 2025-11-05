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

// Public user API
export const userAPI = {
    getUserPublic: async (userId: string) => {
        const response = await api.get(`/auth/users/${userId}`);
        return response.data;
    }
};

// Lesson API functions
export const lessonAPI = {
    // Generate lesson structure (3 full + 7 placeholders) with progressive difficulty
    generateLessonStructure: async (topic: string) => {
        const response = await api.post('/lessons/generate', { topic });
        return response.data;
    },

    // Generate content for a placeholder lesson
    generatePlaceholderContent: async (lessonId: string) => {
        const response = await api.post(`/lessons/${lessonId}/generate-content`);
        return response.data;
    },

    // Get all lessons with optional filters
    getUserLessons: async (filters?: { category?: string; difficulty?: string; isFullyGenerated?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.category) params.append('category', filters.category);
        if (filters?.difficulty) params.append('difficulty', filters.difficulty);
        if (filters?.isFullyGenerated !== undefined) params.append('isFullyGenerated', String(filters.isFullyGenerated));

        const response = await api.get(`/lessons${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get single lesson with full content
    getLessonById: async (lessonId: string) => {
        const response = await api.get(`/lessons/${lessonId}`);
        return response.data;
    },

    // Get lesson statistics
    getLessonStats: async () => {
        const response = await api.get('/lessons/stats');
        return response.data;
    },

    // Delete a lesson
    deleteLesson: async (lessonId: string) => {
        const response = await api.delete(`/lessons/${lessonId}`);
        return response.data;
    },

    // Complete a lesson and update user XP
    completeLesson: async (lessonId: string, xpEarned: number, correctAnswers: number, totalQuestions: number) => {
        const response = await api.post(`/lessons/${lessonId}/complete`, {
            xpEarned,
            correctAnswers,
            totalQuestions
        });
        return response.data;
    },

    // Get lesson completion status
    getLessonCompletionStatus: async (lessonId: string) => {
        const response = await api.get(`/lessons/${lessonId}/completion-status`);
        return response.data;
    },

    // Generate test for a lesson
    generateTest: async (lessonId: string, questionCount?: number, forceNew?: boolean) => {
        const response = await api.post(`/lessons/${lessonId}/generate-test`, { questionCount, forceNew });
        return response.data;
    },

    // Submit test attempt
    submitTest: async (testId: string, answers: number[], timeTaken: number) => {
        const response = await api.post(`/lessons/tests/${testId}/submit`, { answers, timeTaken });
        return response.data;
    },

    // Get test status for a lesson
    getTestStatus: async (lessonId: string) => {
        const response = await api.get(`/lessons/${lessonId}/test-status`);
        return response.data;
    }
};

// Seed API functions
export const seedAPI = {
    // Seed default lessons if user has none
    seedDefaultLessons: async () => {
        const response = await api.post('/seed/default-lessons');
        return response.data;
    },

    // Reset and reseed all lessons
    resetAndSeedLessons: async () => {
        const response = await api.post('/seed/reset-lessons');
        return response.data;
    }
};

// Leaderboard API functions
export const leaderboardAPI = {
    // Get global leaderboard with filters
    getLeaderboard: async (filters?: {
        league?: string;
        skill?: string;
        timeframe?: string;
        page?: number;
        limit?: number;
    }) => {
        const params = new URLSearchParams();
        if (filters?.league) params.append('league', filters.league);
        if (filters?.skill) params.append('skill', filters.skill);
        if (filters?.timeframe) params.append('timeframe', filters.timeframe);
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));

        const response = await api.get(`/leaderboard${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get current user's rank and nearby users
    getMyRank: async () => {
        const response = await api.get('/leaderboard/my-rank');
        return response.data;
    },

    // Get league statistics
    getLeagueStats: async () => {
        const response = await api.get('/leaderboard/league-stats');
        return response.data;
    },

    // Get skill-specific leaderboard
    getSkillLeaderboard: async (skill: string, limit?: number) => {
        const params = new URLSearchParams();
        if (limit) params.append('limit', String(limit));

        const response = await api.get(`/leaderboard/skills/${skill}${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get AI-powered insights
    getInsights: async () => {
        const response = await api.get('/leaderboard/insights');
        return response.data;
    }
};

// Admin API functions
export const adminAPI = {
    // Dashboard Stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    // User Growth Data
    getUserGrowth: async (months: number = 6) => {
        const response = await api.get(`/admin/dashboard/user-growth?months=${months}`);
        return response.data;
    },

    // Revenue Data
    getRevenueData: async (months: number = 6) => {
        const response = await api.get(`/admin/dashboard/revenue?months=${months}`);
        return response.data;
    },

    // Recent Users
    getRecentUsers: async (limit: number = 10) => {
        const response = await api.get(`/admin/dashboard/recent-users?limit=${limit}`);
        return response.data;
    },

    // Top Lessons
    getTopLessons: async (limit: number = 10) => {
        const response = await api.get(`/admin/dashboard/top-lessons?limit=${limit}`);
        return response.data;
    },

    // Get All Users with pagination
    getAllUsers: async (filters?: {
        page?: number;
        limit?: number;
        role?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const params = new URLSearchParams();
        if (filters?.page) params.append('page', String(filters.page));
        if (filters?.limit) params.append('limit', String(filters.limit));
        if (filters?.role) params.append('role', filters.role);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.sortBy) params.append('sortBy', filters.sortBy);
        if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

        const response = await api.get(`/admin/users${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Update User
    updateUser: async (userId: string, updateData: { role?: string; isEmailVerified?: boolean }) => {
        const response = await api.put(`/admin/users/${userId}`, updateData);
        return response.data;
    },

    // Delete User
    deleteUser: async (userId: string) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Get Analytics
    getAnalytics: async () => {
        const response = await api.get('/admin/analytics');
        return response.data;
    }
};

export default api;