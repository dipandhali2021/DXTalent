/**
 * Migration script to clean up duplicate user-specific default lessons
 * and replace them with global default lessons
 *
 * Run this script once to migrate from the old system to the new global lesson system
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Lesson from '../models/Lesson.js';
import LessonCompletion from '../models/LessonCompletion.js';

dotenv.config();

const migrateLessons = async () => {
  try {
    console.log('🔄 Starting lesson migration...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Step 1: Count existing user-specific default lessons
    const userDefaultLessons = await Lesson.countDocuments({
      isDefault: true,
      userId: { $ne: null },
    });
    console.log(`📊 Found ${userDefaultLessons} user-specific default lessons`);

    // Step 2: Check if global default lessons exist
    const globalDefaultLessons = await Lesson.countDocuments({
      isDefault: true,
      userId: null,
    });
    console.log(`📊 Found ${globalDefaultLessons} global default lessons`);

    if (globalDefaultLessons === 0) {
      console.log(
        '⚠️  No global default lessons found. Please start the server to seed them first.'
      );
      process.exit(0);
    }

    // Step 3: Get all user-specific default lessons
    const userLessons = await Lesson.find({
      isDefault: true,
      userId: { $ne: null },
    }).select('_id userId');

    if (userLessons.length === 0) {
      console.log('✅ No user-specific default lessons to migrate');
      process.exit(0);
    }

    console.log(
      `🔄 Migrating ${userLessons.length} user-specific default lessons...`
    );

    // Step 4: Get lesson completion records for these lessons
    const lessonIds = userLessons.map((l) => l._id);
    const completions = await LessonCompletion.find({
      lessonId: { $in: lessonIds },
    });

    console.log(
      `📚 Found ${completions.length} completion records to preserve`
    );

    // Step 5: Create a mapping of old lesson IDs to global lesson IDs
    // This is a simplified approach - you may need to adjust based on your data structure
    const globalLessons = await Lesson.find({
      isDefault: true,
      userId: null,
    }).select('_id skillName category difficulty');

    // Create a map for matching: skillName + category + difficulty -> global lesson ID
    const globalLessonMap = new Map();
    globalLessons.forEach((lesson) => {
      const key = `${lesson.skillName}|${lesson.category}|${lesson.difficulty}`;
      globalLessonMap.set(key, lesson._id);
    });

    // Step 6: Update completion records to point to global lessons
    let updatedCompletions = 0;
    for (const completion of completions) {
      // Find the corresponding user lesson
      const userLesson = await Lesson.findById(completion.lessonId);
      if (userLesson) {
        const key = `${userLesson.skillName}|${userLesson.category}|${userLesson.difficulty}`;
        const globalLessonId = globalLessonMap.get(key);

        if (globalLessonId) {
          // Check if a completion already exists for this user and global lesson
          const existingCompletion = await LessonCompletion.findOne({
            userId: completion.userId,
            lessonId: globalLessonId,
          });

          if (existingCompletion) {
            // Keep the best completion record
            if (completion.bestScore > existingCompletion.bestScore) {
              existingCompletion.bestScore = completion.bestScore;
              existingCompletion.completionCount = Math.max(
                completion.completionCount,
                existingCompletion.completionCount
              );
              existingCompletion.lastCompletionDate = new Date(
                Math.max(
                  completion.lastCompletionDate.getTime(),
                  existingCompletion.lastCompletionDate.getTime()
                )
              );
              await existingCompletion.save();
            }
            // Delete the old completion
            await LessonCompletion.deleteOne({ _id: completion._id });
          } else {
            // Update to point to global lesson
            completion.lessonId = globalLessonId;
            await completion.save();
          }
          updatedCompletions++;
        }
      }
    }

    console.log(`✅ Updated ${updatedCompletions} completion records`);

    // Step 7: Delete user-specific default lessons
    const deleteResult = await Lesson.deleteMany({
      isDefault: true,
      userId: { $ne: null },
    });

    console.log(
      `✅ Deleted ${deleteResult.deletedCount} user-specific default lessons`
    );

    // Final summary
    console.log('\n📊 Migration Summary:');
    console.log(
      `   - User-specific default lessons deleted: ${deleteResult.deletedCount}`
    );
    console.log(`   - Completion records updated: ${updatedCompletions}`);
    console.log(
      `   - Global default lessons available: ${globalDefaultLessons}`
    );
    console.log('\n✅ Migration completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run migration
migrateLessons();
