/**
 * Initialize default lessons on server startup
 * These lessons are global (no userId) and shared across all users
 */
import Lesson from '../models/Lesson.js';
import { defaultLessons } from './seedLessons.js';

export const initializeDefaultLessons = async () => {
  try {
    console.log('🔍 Checking for default lessons...');

    // Check if global default lessons already exist
    const existingDefaultLessons = await Lesson.countDocuments({
      isDefault: true,
      userId: null, // Global lessons have no userId
    });

    if (existingDefaultLessons > 0) {
      console.log(
        `✅ Found ${existingDefaultLessons} default lessons in database`
      );
      return {
        success: true,
        message: 'Default lessons already exist',
        count: existingDefaultLessons,
      };
    }

    console.log('📦 No default lessons found. Seeding default lessons...');

    // Create global default lessons (without userId)
    const lessonsToCreate = defaultLessons.map((lesson) => ({
      ...lesson,
      userId: null, // Global lesson - no specific user
      isDefault: true,
    }));

    const createdLessons = await Lesson.insertMany(lessonsToCreate);

    console.log(
      `✅ Successfully seeded ${createdLessons.length} default lessons`
    );
    console.log(
      `📚 Categories: Marketing, Development, Data, Business, Design`
    );

    return {
      success: true,
      message: 'Default lessons seeded successfully',
      count: createdLessons.length,
    };
  } catch (error) {
    console.error('❌ Error initializing default lessons:', error);
    return {
      success: false,
      message: 'Failed to initialize default lessons',
      error: error.message,
    };
  }
};
