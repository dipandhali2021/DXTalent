import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const initializeLeaderboardRanks = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log('🔄 Calculating leaderboard ranks...');

    // Get all users sorted by XP
    const users = await User.find({})
      .select('username stats badgeStats')
      .sort({ 'stats.xpPoints': -1 });

    console.log(`📊 Found ${users.length} users`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const rank = i + 1;

      // Set highest leaderboard rank
      if (
        !user.badgeStats.highestLeaderboardRank ||
        rank < user.badgeStats.highestLeaderboardRank
      ) {
        user.badgeStats.highestLeaderboardRank = rank;
        await user.save();
        console.log(
          `✅ Set rank ${rank} for ${user.username} (${user.stats.xpPoints} XP)`
        );
      }
    }

    console.log('\n✅ Leaderboard ranks initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing leaderboard ranks:', error);
    process.exit(1);
  }
};

initializeLeaderboardRanks();
