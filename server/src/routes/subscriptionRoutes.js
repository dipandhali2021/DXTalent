import express from 'express';
import {
  createCheckoutSession,
  handleWebhook,
  getSubscriptionStatus,
  cancelSubscription,
  verifySession,
} from '../controllers/subscriptionController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public webhook endpoint (no auth middleware)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  handleWebhook
);

// Protected routes
router.post('/checkout', authenticate, createCheckoutSession);
router.get('/status', authenticate, getSubscriptionStatus);
router.post('/cancel', authenticate, cancelSubscription);
router.post('/verify-session', authenticate, verifySession);

export default router;
