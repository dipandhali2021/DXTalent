import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  generateLessonStructure,
  generatePlaceholderContent,
  getUserLessons,
  getLessonById,
  deleteLesson,
  getLessonStats,
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

// GET /api/lessons/stats - Get lesson statistics for user
router.get('/stats', authenticate, getLessonStats);

// GET /api/lessons - Get all lessons for authenticated user
router.get('/', authenticate, validateLessonQuery, getUserLessons);

// GET /api/lessons/:lessonId - Get a single lesson with full content
router.get('/:lessonId', authenticate, validateLessonId, getLessonById);

// DELETE /api/lessons/:lessonId - Delete a lesson
router.delete('/:lessonId', authenticate, validateLessonId, deleteLesson);

export default router;
