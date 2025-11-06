import Lesson from '../models/Lesson.js';
import { defaultLessons } from '../utils/seedLessons.js';

/**
 * Seed default lessons for a user
 * POST /api/seed/default-lessons
 * NOTE: This endpoint is deprecated. Default lessons are now seeded globally on server startup.
 */
export const seedDefaultLessons = async (req, res) => {
  try {
    // Check if global default lessons exist
    const existingDefaultLessons = await Lesson.countDocuments({
      isDefault: true,
      userId: null,
    });

    if (existingDefaultLessons > 0) {
      return res.status(200).json({
        success: true,
        message: 'Default lessons already available',
        data: {
          count: existingDefaultLessons,
          note: 'Default lessons are now global and shared across all users',
        },
      });
    }

    // Create global default lessons (without userId)
    const lessonsToCreate = defaultLessons.map((lesson) => ({
      ...lesson,
      userId: null, // Global lesson - no specific user
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
 * NOTE: This will delete ALL lessons (user-specific and global) and reseed global defaults
 */
export const resetAndSeedLessons = async (req, res) => {
  try {
    // Delete all existing lessons
    const deleteResult = await Lesson.deleteMany({});

    // Create global default lessons
    const lessonsToCreate = defaultLessons.map((lesson) => ({
      ...lesson,
      userId: null, // Global lesson - no specific user
      isDefault: true,
    }));

    const createdLessons = await Lesson.insertMany(lessonsToCreate);

    res.status(201).json({
      success: true,
      message: `Successfully reset and seeded ${createdLessons.length} global default lessons`,
      data: {
        deleted: deleteResult.deletedCount,
        created: createdLessons.length,
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
