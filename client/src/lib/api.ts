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
    completeLesson: async (lessonId: string, correctAnswers: number, totalQuestions: number) => {
        const response = await api.post(`/lessons/${lessonId}/complete`, {
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

// Badge API functions
export const badgeAPI = {
    // Get all badges with user progress
    getAllBadges: async () => {
        const response = await api.get('/badges');
        return response.data;
    },

    // Get unclaimed badges
    getUnclaimedBadges: async () => {
        const response = await api.get('/badges/unclaimed');
        return response.data;
    },

    // Claim a badge
    claimBadge: async (badgeId: string) => {
        const response = await api.post(`/badges/${badgeId}/claim`);
        return response.data;
    },

    // Check for new badges
    checkBadges: async () => {
        const response = await api.post('/badges/check');
        return response.data;
    },

    // Get badge configuration
    getBadgeConfig: async () => {
        const response = await api.get('/badges/config');
        return response.data;
    }
};

// Recruiter API functions
export const recruiterAPI = {
    // Get trending skills
    getTrendingSkills: async (options?: { limit?: number; days?: number }) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', String(options.limit));
        if (options?.days) params.append('days', String(options.days));

        const response = await api.get(`/recruiter/trending-skills${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get active learners statistics
    getActiveLearners: async (options?: { weeks?: number }) => {
        const params = new URLSearchParams();
        if (options?.weeks) params.append('weeks', String(options.weeks));

        const response = await api.get(`/recruiter/active-learners${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get top candidates
    getTopCandidates: async (options?: {
        limit?: number;
        minLevel?: number;
        league?: string;
        skill?: string;
        sortBy?: 'xp' | 'level' | 'streak';
    }) => {
        const params = new URLSearchParams();
        if (options?.limit) params.append('limit', String(options.limit));
        if (options?.minLevel) params.append('minLevel', String(options.minLevel));
        if (options?.league) params.append('league', options.league);
        if (options?.skill) params.append('skill', options.skill);
        if (options?.sortBy) params.append('sortBy', options.sortBy);

        const response = await api.get(`/recruiter/top-candidates${params.toString() ? '?' + params.toString() : ''}`);
        return response.data;
    },

    // Get recruiter dashboard overview
    getOverview: async () => {
        const response = await api.get('/recruiter/overview');
        return response.data;
    }
};

// Subscription API
export const subscriptionAPI = {
    // Create Stripe checkout session
    createCheckoutSession: async (subscriptionType: string, isAddon: boolean = false) => {
        const response = await api.post('/subscription/checkout', {
            subscriptionType,
            isAddon
        });
        return response.data;
    },

    // Get current subscription status
    getSubscriptionStatus: async () => {
        const response = await api.get('/subscription/status');
        return response.data;
    },

    // Cancel subscription
    cancelSubscription: async () => {
        const response = await api.post('/subscription/cancel');
        return response.data;
    },

    // Verify session after successful payment
    verifySession: async (sessionId: string) => {
        const response = await api.post('/subscription/verify-session', {
            sessionId
        });
        return response.data;
    }
};

// Admin API functions
export const adminAPI = {
    // Get dashboard statistics
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard/stats');
        return response.data;
    },

    // Get user growth data
    getUserGrowth: async (months: number = 6) => {
        const response = await api.get(`/admin/dashboard/user-growth?months=${months}`);
        return response.data;
    },

    // Get revenue data
    getRevenueData: async (months: number = 6) => {
        const response = await api.get(`/admin/dashboard/revenue?months=${months}`);
        return response.data;
    },

    // Get recent users
    getRecentUsers: async (limit: number = 10) => {
        const response = await api.get(`/admin/dashboard/recent-users?limit=${limit}`);
        return response.data;
    },

    // Get top lessons
    getTopLessons: async (limit: number = 10) => {
        const response = await api.get(`/admin/dashboard/top-lessons?limit=${limit}`);
        return response.data;
    },

    // Get all users with pagination and filters
    getAllUsers: async (params?: {
        page?: number;
        limit?: number;
        role?: string;
        status?: string;
        subscriptionType?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }) => {
        const queryString = new URLSearchParams(params as any).toString();
        const response = await api.get(`/admin/users?${queryString}`);
        return response.data;
    },

    // Get user details
    getUserDetails: async (userId: string) => {
        const response = await api.get(`/admin/users/${userId}`);
        return response.data;
    },

    // Update user
    updateUser: async (userId: string, updates: any) => {
        const response = await api.put(`/admin/users/${userId}`, updates);
        return response.data;
    },

    // Update user role
    updateUserRole: async (userId: string, role: string) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    // Delete user
    deleteUser: async (userId: string) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Suspend user
    suspendUser: async (userId: string) => {
        const response = await api.post(`/admin/users/${userId}/suspend`);
        return response.data;
    },

    // Activate user
    activateUser: async (userId: string) => {
        const response = await api.post(`/admin/users/${userId}/activate`);
        return response.data;
    },

    // Get analytics
    getAnalytics: async (timeRange: number = 30) => {
        const response = await api.get(`/admin/analytics?timeRange=${timeRange}`);
        return response.data;
    },

    // Payment Management APIs

    // Get all payments with filtering and pagination
    getAllPayments: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        paymentType?: string;
        startDate?: string;
        endDate?: string;
        userId?: string;
    }) => {
        const queryString = new URLSearchParams(
            Object.entries(params || {}).reduce((acc, [key, value]) => {
                if (value) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();
        const response = await api.get(`/admin/payments?${queryString}`);
        return response.data;
    },

    // Get payment statistics
    getPaymentStats: async (months: number = 6) => {
        const response = await api.get(`/admin/payments/stats?months=${months}`);
        return response.data;
    },

    // Get payment details
    getPaymentDetails: async (paymentId: string) => {
        const response = await api.get(`/admin/payments/${paymentId}`);
        return response.data;
    },

    // Process refund
    processRefund: async (paymentId: string, refundData: {
        refundAmount: number;
        refundReason: string;
    }) => {
        const response = await api.post(`/admin/payments/${paymentId}/refund`, refundData);
        return response.data;
    }
};

export default api;
