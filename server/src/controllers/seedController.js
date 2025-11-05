import Lesson from '../models/Lesson.js';
import { defaultLessons } from '../utils/seedLessons.js';

/**
 * Seed default lessons for a user
 * POST /api/seed/default-lessons
 */
export const seedDefaultLessons = async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Check if user already has lessons
    const existingLessons = await Lesson.countDocuments({ userId });

    if (existingLessons > 0) {
      return res.status(200).json({
        success: true,
        message: 'User already has lessons',
        data: { count: existingLessons },
      });
    }

    // Create default lessons for the user
    const lessonsToCreate = defaultLessons.map((lesson) => ({
      ...lesson,
      userId,
      isDefault: true,
    }));

    const createdLessons = await Lesson.insertMany(lessonsToCreate);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${createdLessons.length} default lessons`,
      data: {
        count: createdLessons.length,
        categories: ['Marketing', 'Development', 'Data', 'Business', 'Design'],
      },
    });
  } catch (error) {
    console.error('Error seeding default lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed default lessons',
      error: error.message,
    });
  }
};

/**
 * Reset and reseed all lessons (admin only)
 * POST /api/seed/reset-lessons
 */
export const resetAndSeedLessons = async (req, res) => {
  try {
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Delete all existing lessons for the user
    await Lesson.deleteMany({ userId });

    // Create default lessons
    const lessonsToCreate = defaultLessons.map((lesson) => ({
      ...lesson,
      userId,
      isDefault: true,
    }));

    const createdLessons = await Lesson.insertMany(lessonsToCreate);

    res.status(201).json({
      success: true,
      message: `Successfully reset and seeded ${createdLessons.length} lessons`,
      data: {
        count: createdLessons.length,
        categories: ['Marketing', 'Development', 'Data', 'Business', 'Design'],
      },
    });
  } catch (error) {
    console.error('Error resetting lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset lessons',
      error: error.message,
    });
  }
};
