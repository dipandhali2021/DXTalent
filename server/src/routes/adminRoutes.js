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
  getUserDetails,
  getAllPayments,
  getPaymentStats,
  getPaymentDetails,
  processRefund,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// Dashboard statistics
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/user-growth', getUserGrowth);
router.get('/dashboard/revenue', getRevenueData);
router.get('/dashboard/recent-users', getRecentUsers);
router.get('/dashboard/top-lessons', getTopLessons);

// User management
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserDetails);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);

// Analytics
router.get('/analytics', getAnalytics);

// Payment management
router.get('/payments', getAllPayments);
router.get('/payments/stats', getPaymentStats);
router.get('/payments/:paymentId', getPaymentDetails);
router.post('/payments/:paymentId/refund', processRefund);

export default router;
