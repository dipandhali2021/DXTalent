/**
 * Migration script to backfill level data for existing users
 * Run this script once after deploying the new level system
 *
 * Usage: node src/utils/migrateLevels.js
 */

import mongoose from 'mongoose';
import User from '../models/User.js';
import { computeLevelFromXP } from './level.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const migrateLevels = async () => {
  try {
    console.log('🚀 Starting level migration...');

    // Connect to MongoDB
    const dbUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/dxtalent';
    await mongoose.connect(dbUri);
    console.log('✅ Connected to MongoDB');

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const user of users) {
      try {
        const totalXP = user.stats.xpPoints || 0;

        // Calculate level info from total XP
        const levelInfo = computeLevelFromXP(totalXP);

        // Update user's level fields
        user.stats.level = levelInfo.level;
        user.stats.levelName = levelInfo.levelName;
        user.stats.xpIntoLevel = levelInfo.xpIntoLevel;
        user.stats.xpForNextLevel = levelInfo.xpForNextLevel;
        user.stats.xpProgress = levelInfo.xpProgress;

        await user.save();
        migratedCount++;

        console.log(
          `✅ Migrated user ${user.username} (${user.email}): Level ${levelInfo.level} - ${levelInfo.levelName} (${totalXP} XP)`
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
    console.log(`   ⏭️  Skipped: ${skippedCount} users`);
    console.log(`   ❌ Errors: ${errorCount} users`);
    console.log('\n🎉 Level migration completed!');
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
migrateLevels();
