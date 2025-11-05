import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getLeaderboard,
  getMyRank,
  getLeagueStats,
  getSkillLeaderboard,
  getLeaderboardInsights,
} from '../controllers/leaderboardController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// GET /api/leaderboard - Get global leaderboard with filters
router.get('/', getLeaderboard);

// GET /api/leaderboard/my-rank - Get current user's rank and nearby users
router.get('/my-rank', getMyRank);

// GET /api/leaderboard/league-stats - Get statistics for all leagues
router.get('/league-stats', getLeagueStats);

// GET /api/leaderboard/insights - Get AI-powered insights for current user
router.get('/insights', getLeaderboardInsights);

// GET /api/leaderboard/skills/:skill - Get skill-specific leaderboard
router.get('/skills/:skill', getSkillLeaderboard);

export default router;
