import express from 'express';
import {
  seedDefaultLessons,
  resetAndSeedLessons,
} from '../controllers/seedController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Seed default lessons if user has none
router.post('/default-lessons', authenticate, seedDefaultLessons);

// Reset and reseed all lessons (use with caution)
router.post('/reset-lessons', authenticate, resetAndSeedLessons);


export default router;
