import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getDailyChallenges,
  claimChallenge,
} from '../controllers/challengeController.js';

const router = express.Router();

// GET /api/challenges/daily - Get daily challenges for user
router.get('/daily', authenticate, getDailyChallenges);

// POST /api/challenges/:challengeId/claim - Claim challenge reward
router.post('/:challengeId/claim', authenticate, claimChallenge);

export default router;
