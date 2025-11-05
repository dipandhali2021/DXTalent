import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getAllBadges,
  getUnclaimed,
  claimBadgeById,
  checkBadges,
  getBadgeConfig,
} from '../controllers/badgeController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all badges with progress
router.get('/', getAllBadges);

// Get unclaimed badges
router.get('/unclaimed', getUnclaimed);

// Get badge configuration
router.get('/config', getBadgeConfig);

// Claim a badge
router.post('/:badgeId/claim', claimBadgeById);

// Check for new badges
router.post('/check', checkBadges);

export default router;
