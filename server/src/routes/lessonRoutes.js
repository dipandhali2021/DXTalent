import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateLessonStructure,
  generatePlaceholderContent,
  getUserLessons,
  getLessonById,
  deleteLesson,
  getLessonStats,
  completeLesson,
  getLessonCompletionStatus,
  getUserActivity,
  getUserStats,
  getAIRecommendation,
  getContinueJourney,
  generateLessonTest,
  submitTest,
  getTestStatus,
} from '../controllers/lessonController.js';
import {
  validateGenerateLessonStructure,
  validateLessonId,
  validateLessonQuery,
} from '../validators/lessonValidators.js';

const router = express.Router();

// All routes require authentication
// router.use(authenticate);

// Test endpoint without auth to verify API key
router.post('/test-generate', generateLessonStructure);

// POST /api/lessons/generate - Generate initial lesson structure (3 full + 7 placeholders)
router.post(
  '/generate',
  authenticate,
  validateGenerateLessonStructure,
  generateLessonStructure
);

// POST /api/lessons/:lessonId/generate-content - Generate content for a placeholder lesson
router.post(
  '/:lessonId/generate-content',
  authenticate,
  validateLessonId,
  generatePlaceholderContent
);

// POST /api/lessons/:lessonId/generate-test - Generate a test for a lesson
router.post(
  '/:lessonId/generate-test',
  authenticate,
  validateLessonId,
  generateLessonTest
);

// POST /api/lessons/tests/:testId/submit - Submit test attempt
router.post('/tests/:testId/submit', authenticate, submitTest);

// GET /api/lessons/:lessonId/test-status - Get test status for a lesson
router.get(
  '/:lessonId/test-status',
  authenticate,
  validateLessonId,
  getTestStatus
);

// GET /api/lessons/stats - Get lesson statistics for user
router.get('/stats', authenticate, getLessonStats);

// GET /api/lessons/user-stats - Get user statistics (weekly XP, skill proficiency)
router.get('/user-stats', authenticate, getUserStats);

// GET /api/lessons/ai-recommendation - Get AI-powered lesson recommendation for today
router.get('/ai-recommendation', authenticate, getAIRecommendation);

// GET /api/lessons/continue-journey - Get next lesson to continue based on last completed
router.get('/continue-journey', authenticate, getContinueJourney);

// GET /api/lessons/activity - Get user's daily activity for heatmap
router.get('/activity', authenticate, getUserActivity);

// GET /api/lessons - Get all lessons for authenticated user
router.get('/', authenticate, validateLessonQuery, getUserLessons);

// GET /api/lessons/:lessonId - Get a single lesson with full content
router.get('/:lessonId', authenticate, validateLessonId, getLessonById);

// GET /api/lessons/:lessonId/completion-status - Check if lesson was completed before
router.get(
  '/:lessonId/completion-status',
  authenticate,
  validateLessonId,
  getLessonCompletionStatus
);

// POST /api/lessons/:lessonId/complete - Mark lesson as complete and update user XP
router.post(
  '/:lessonId/complete',
  authenticate,
  validateLessonId,
  completeLesson
);

// DELETE /api/lessons/:lessonId - Delete a lesson
router.delete('/:lessonId', authenticate, validateLessonId, deleteLesson);

export default router;
