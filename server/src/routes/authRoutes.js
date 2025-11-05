import express from 'express';
import {
  register,
  login,
  googleAuth,
  verifyEmail,
  resendVerification,
  refreshAccessToken,
  logout,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  updateUserRole,
  updateProfile,
  getUserById,
} from '../controllers/authController.js';
import {
  authMiddleware,
  roleMiddleware,
  optionalAuthMiddleware,
} from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  emailValidation,
  resetPasswordValidation,
  updateRoleValidation,
} from '../validators/authValidators.js';
import {
  rateLimitMiddleware,
  loginLimiter,
  registerLimiter,
  passwordResetLimiter,
  emailVerificationLimiter,
} from '../utils/rateLimiter.js';

const router = express.Router();

// Public routes
router.post(
  '/register',
  rateLimitMiddleware(registerLimiter, 'Too many registration attempts'),
  registerValidation,
  register
);

router.post(
  '/login',
  rateLimitMiddleware(loginLimiter, 'Too many login attempts'),
  loginValidation,
  login
);

router.post('/google', googleAuth);

router.get('/verify/:token', verifyEmail);

router.post(
  '/resend-verification',
  rateLimitMiddleware(emailVerificationLimiter),
  emailValidation,
  resendVerification
);

router.post('/refresh', refreshAccessToken);

router.post(
  '/forgot-password',
  rateLimitMiddleware(passwordResetLimiter),
  emailValidation,
  forgotPassword
);

router.post('/reset-password', resetPasswordValidation, resetPassword);

// Protected routes
router.post('/logout', authMiddleware, logout);

router.get('/me', authMiddleware, getCurrentUser);

// Public route to get a user's public profile (with optional auth to show email for recruiters/admins)
router.get('/users/:userId', optionalAuthMiddleware, getUserById);

router.put('/profile', authMiddleware, updateProfile);

// Admin only routes
router.put(
  '/users/:userId/role',
  authMiddleware,
  roleMiddleware('admin'),
  updateRoleValidation,
  updateUserRole
);

export default router;
