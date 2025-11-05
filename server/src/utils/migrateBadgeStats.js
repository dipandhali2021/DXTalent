import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import LessonCompletion from '../models/LessonCompletion.js';
import Lesson from '../models/Lesson.js';

dotenv.config();

const migrateBadgeStats = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🔄 Finding users without badge stats...');
    const users = await User.find({
      $or: [{ badges: { $exists: false } }, { badgeStats: { $exists: false } }],
    });

    console.log(`📊 Found ${users.length} users to migrate`);

    for (const user of users) {
      console.log(`\n🔄 Migrating user: ${user.username}`);

      // Initialize badges array if not exists
      if (!user.badges) {
        user.badges = [];
      }

      // Initialize badge stats if not exists
      if (!user.badgeStats) {
        user.badgeStats = {
          lessonsCompletedTotal: 0,
          lessonsCompletedToday: 0,
          lastLessonCompletionDate: null,
          perfectTestsCount: 0,
          categoriesExplored: [],
          streakRestored: false,
          highestLeaderboardRank: null,
        };
      }

      // Count actual lesson completions
      const completions = await LessonCompletion.find({ userId: user._id });
      user.badgeStats.lessonsCompletedTotal = completions.length;

      // Get categories from completed lessons
      const categories = new Set();
      for (const completion of completions) {
        const lesson = await Lesson.findById(completion.lessonId);
        if (lesson && lesson.category) {
          categories.add(lesson.category);
        }
      }
      user.badgeStats.categoriesExplored = Array.from(categories);

      // Count perfect tests (100% accuracy)
      const perfectTests = completions.filter(
        (c) => c.bestScore && c.bestScore.accuracy === 100
      ).length;
      user.badgeStats.perfectTestsCount = perfectTests;

      // Set last completion date if exists
      if (completions.length > 0) {
        const lastCompletion = completions.sort(
          (a, b) => b.lastCompletionDate - a.lastCompletionDate
        )[0];
        user.badgeStats.lastLessonCompletionDate =
          lastCompletion.lastCompletionDate;
      }

      await user.save();
      console.log(`✅ Migrated user: ${user.username}`);
      console.log(
        `   - Lessons completed: ${user.badgeStats.lessonsCompletedTotal}`
      );
      console.log(
        `   - Categories explored: ${user.badgeStats.categoriesExplored.length}`
      );
      console.log(`   - Perfect tests: ${user.badgeStats.perfectTestsCount}`);
    }

    console.log('\n✅ Badge stats migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error migrating badge stats:', error);
    process.exit(1);
  }
};

migrateBadgeStats();
