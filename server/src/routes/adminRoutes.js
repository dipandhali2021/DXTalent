import express from 'express';
import {
    getDashboardStats,
    getUserGrowth,
    getRevenueData,
    getRecentUsers,
    getTopLessons,
    getAllUsers,
    updateUser,
    deleteUser,
    getAnalytics,
} from '../controllers/adminController.js';
import adminAuthMiddleware from '../middleware/adminAuth.js';

const router = express.Router();

// All routes require admin authentication
router.use(adminAuthMiddleware);

// Dashboard Overview
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/user-growth', getUserGrowth);
router.get('/dashboard/revenue', getRevenueData);
router.get('/dashboard/recent-users', getRecentUsers);
router.get('/dashboard/top-lessons', getTopLessons);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

// Analytics
router.get('/analytics', getAnalytics);

export default router;