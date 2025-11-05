/**
 * Migration script to initialize streak fields for existing users
 * Run this script once after deploying the streak tracking system
 *
 * Usage: node src/utils/migrateStreaks.js
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import LessonCompletion from '../models/LessonCompletion.js';
import { getDateString } from './streak.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const migrateStreaks = async () => {
  try {
    console.log('🚀 Starting streak migration...');

    // Connect to MongoDB
    const dbUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/dxtalent';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        // Initialize streak fields if not present
        if (!user.stats.currentStreak) {
          user.stats.currentStreak = 0;
        }
        if (!user.stats.longestStreak) {
          user.stats.longestStreak = 0;
        }
        if (!user.dailyActivity) {
          user.dailyActivity = new Map();
        }

        // Get all lesson completions for this user to rebuild activity history
        const completions = await LessonCompletion.find({ userId: user._id });

        if (completions.length > 0) {
          // Build daily activity map from completion history
          const activityMap = new Map();

          for (const completion of completions) {
            // Process each individual completion
            if (completion.completions && completion.completions.length > 0) {
              for (const comp of completion.completions) {
                const dateStr = getDateString(comp.completedAt);
                activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
              }
            }
          }

          // Calculate streak from historical data
          const sortedDates = Array.from(activityMap.keys()).sort();

          if (sortedDates.length > 0) {
            let currentStreak = 1;
            let longestStreak = 1;
            let tempStreak = 1;

            const today = getDateString(new Date());
            const lastActivityDate = sortedDates[sortedDates.length - 1];

            // Calculate longest streak from history
            for (let i = 1; i < sortedDates.length; i++) {
              const prevDate = new Date(sortedDates[i - 1]);
              const currDate = new Date(sortedDates[i]);

              const diffTime = currDate - prevDate;
              const diffDays = diffTime / (1000 * 60 * 60 * 24);

              if (diffDays === 1) {
                tempStreak++;
                if (tempStreak > longestStreak) {
                  longestStreak = tempStreak;
                }
              } else {
                tempStreak = 1;
              }
            }

            // Calculate current streak (only if recent activity)
            const lastDate = new Date(lastActivityDate);
            const todayDate = new Date(today);
            const daysSinceLastActivity = Math.floor(
              (todayDate - lastDate) / (1000 * 60 * 60 * 24)
            );

            if (daysSinceLastActivity <= 1) {
              // Count backwards from last activity to find current streak
              currentStreak = 1;
              for (let i = sortedDates.length - 2; i >= 0; i--) {
                const prevDate = new Date(sortedDates[i]);
                const nextDate = new Date(sortedDates[i + 1]);

                const diffTime = nextDate - prevDate;
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                if (diffDays === 1) {
                  currentStreak++;
                } else {
                  break;
                }
              }
            } else {
              currentStreak = 0; // Streak broken
            }

            user.stats.currentStreak = currentStreak;
            user.stats.longestStreak = longestStreak;
            user.stats.lastLessonDate = new Date(lastActivityDate);
            user.dailyActivity = activityMap;
          }
        }

        await user.save();
        migratedCount++;

        console.log(
          `✅ Migrated user ${user.username}: Current Streak: ${user.stats.currentStreak}, Longest: ${user.stats.longestStreak}, Activities: ${user.dailyActivity.size} days`
        );
      } catch (error) {
        errorCount++;
        console.error(
          `❌ Error migrating user ${user.username}:`,
          error.message
        );
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`   ✅ Successfully migrated: ${migratedCount} users`);
    console.log(`   ❌ Errors: ${errorCount} users`);
    console.log('\n🎉 Streak migration completed!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run migration
migrateStreaks();
