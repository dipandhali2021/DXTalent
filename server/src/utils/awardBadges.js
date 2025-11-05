import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { checkAndAwardBadges } from './badgeService.js';

dotenv.config();

const awardAllEligibleBadges = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🔄 Finding all users...');
    const users = await User.find({});

    console.log(`📊 Found ${users.length} users`);

    for (const user of users) {
      console.log(`\n🔄 Checking badges for user: ${user.username}`);
      console.log(
        `   Stats: ${user.badgeStats.lessonsCompletedTotal} lessons, ${user.stats.currentStreak} streak, ${user.stats.challengesCompleted} challenges`
      );

      const newBadges = await checkAndAwardBadges(user._id);

      if (newBadges.length > 0) {
        console.log(
          `✅ Awarded ${newBadges.length} new badges to ${user.username}:`
        );
        newBadges.forEach((b) => {
          console.log(
            `   - ${b.badge.emoji} ${b.badge.name} (+${b.badge.xpReward} XP)`
          );
        });
      } else {
        console.log(`   No new badges earned yet`);
      }
    }

    console.log('\n✅ Badge awarding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error awarding badges:', error);
    process.exit(1);
  }
};

awardAllEligibleBadges();
