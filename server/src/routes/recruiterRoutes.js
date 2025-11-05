import express from 'express';
import {
  getTrendingSkills,
  getActiveLearners,
  getTopCandidates,
  getRecruiterOverview,
} from '../controllers/recruiterController.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and recruiter/admin role
router.use(authMiddleware);
router.use(roleMiddleware('recruiter', 'admin'));

// Get trending skills
router.get('/trending-skills', getTrendingSkills);

// Get active learners statistics
router.get('/active-learners', getActiveLearners);

// Get top candidates
router.get('/top-candidates', getTopCandidates);

// Get recruiter dashboard overview
router.get('/overview', getRecruiterOverview);

export default router;
