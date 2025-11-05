import User from '../models/User.js';
import { BADGES } from '../config/badges.js';

/**
 * Check if a user has earned a badge
 */
const hasBadge = (user, badgeId) => {
  return user.badges.some((badge) => badge.badgeId === badgeId);
};

/**
 * Award a badge to a user
 */
const awardBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    // Check if user already has the badge
    if (hasBadge(user, badgeId)) {
      return null;
    }

    const badgeConfig = Object.values(BADGES).find((b) => b.id === badgeId);
    if (!badgeConfig) return null;

    // Add badge to user
    user.badges.push({
      badgeId,
      earnedAt: new Date(),
      claimed: false,
    });

    // Award XP
    user.stats.xpPoints += badgeConfig.xpReward;

    // Log XP transaction in history
    if (!user.xpHistory) {
      user.xpHistory = [];
    }
    user.xpHistory.push({
      amount: badgeConfig.xpReward,
      source: 'badge',
      description: `Badge earned: ${badgeConfig.name}`,
      timestamp: new Date(),
    });

    await user.save();

    return {
      badge: badgeConfig,
      xpEarned: badgeConfig.xpReward,
      totalXP: user.stats.xpPoints,
    };
  } catch (error) {
    console.error('Error awarding badge:', error);
    return null;
  }
};

/**
 * Check and award all eligible badges for a user
 */
const checkAndAwardBadges = async (userId, eventType = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const newBadges = [];

    // Check each badge
    for (const [key, badge] of Object.entries(BADGES)) {
      // Skip if user already has this badge
      if (hasBadge(user, badge.id)) continue;

      // Check if badge criteria is met
      const earned = checkBadgeCriteria(user, badge);
      if (earned) {
        const result = await awardBadge(userId, badge.id);
        if (result) {
          newBadges.push(result);
        }
      }
    }

    return newBadges;
  } catch (error) {
    console.error('Error checking badges:', error);
    return [];
  }
};

/**
 * Check if a specific badge criteria is met
 */
const checkBadgeCriteria = (user, badge) => {
  const { type, value } = badge.criteria;

  switch (type) {
    case 'lessons_completed':
      return user.badgeStats.lessonsCompletedTotal >= value;

    case 'streak':
      return user.stats.currentStreak >= value;

    case 'challenges_completed':
      return user.stats.challengesCompleted >= value;

    case 'xp_earned':
      return user.stats.xpPoints >= value;

    case 'perfect_test':
      return user.badgeStats.perfectTestsCount >= value;

    case 'lessons_per_day':
      return user.badgeStats.lessonsCompletedToday >= value;

    case 'early_completion':
      // Check if last lesson was completed before 9 AM
      if (!user.badgeStats.lastLessonCompletionDate) return false;
      const hour = new Date(
        user.badgeStats.lastLessonCompletionDate
      ).getHours();
      return hour < 9;

    case 'late_completion':
      // Check if last lesson was completed after 10 PM
      if (!user.badgeStats.lastLessonCompletionDate) return false;
      const lateHour = new Date(
        user.badgeStats.lastLessonCompletionDate
      ).getHours();
      return lateHour >= 22;

    case 'categories_explored':
      return user.badgeStats.categoriesExplored.length >= value;

    case 'skills_mastered':
      return user.stats.skillsMastered >= value;

    case 'streak_restored':
      return user.badgeStats.streakRestored;

    case 'leaderboard_rank':
      return (
        user.badgeStats.highestLeaderboardRank &&
        user.badgeStats.highestLeaderboardRank <= value
      );

    case 'league':
      const leagues = [
        'bronze',
        'silver',
        'gold',
        'platinum',
        'diamond',
        'master',
      ];
      const currentIndex = leagues.indexOf(user.stats.league);
      const requiredIndex = leagues.indexOf(value);
      return currentIndex >= requiredIndex;

    default:
      return false;
  }
};

/**
 * Get all badges with user's progress
 */
const getUserBadgesWithProgress = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const badgesWithProgress = Object.values(BADGES).map((badge) => {
      const earned = hasBadge(user, badge.id);
      const earnedBadge = user.badges.find((b) => b.badgeId === badge.id);

      let progress = 0;
      let current = 0;
      const target = badge.criteria.value;

      // Calculate progress based on badge type
      switch (badge.criteria.type) {
        case 'lessons_completed':
          current = user.badgeStats.lessonsCompletedTotal;
          break;
        case 'streak':
          current = user.stats.currentStreak;
          break;
        case 'challenges_completed':
          current = user.stats.challengesCompleted;
          break;
        case 'xp_earned':
          current = user.stats.xpPoints;
          break;
        case 'perfect_test':
          current = user.badgeStats.perfectTestsCount;
          break;
        case 'skills_mastered':
          current = user.stats.skillsMastered;
          break;
        case 'categories_explored':
          current = user.badgeStats.categoriesExplored.length;
          break;
        case 'leaderboard_rank':
          // For leaderboard rank, lower is better (rank 1 is best)
          // Show progress based on how close user is to target rank
          if (!user.badgeStats.highestLeaderboardRank) {
            current = 0;
          } else {
            // If rank is better than target, they've achieved it
            if (user.badgeStats.highestLeaderboardRank <= target) {
              current = target;
            } else {
              // Calculate inverse progress (closer to target = higher progress)
              // e.g., if target is 10 and user is rank 50, show progress
              current = Math.max(
                0,
                100 - user.badgeStats.highestLeaderboardRank
              );
            }
          }
          break;
        case 'league':
          // For league badges, show current league index vs target
          const leagues = [
            'bronze',
            'silver',
            'gold',
            'platinum',
            'diamond',
            'master',
          ];
          const currentLeagueIndex = leagues.indexOf(user.stats.league);
          const targetLeagueIndex = leagues.indexOf(target);
          current = currentLeagueIndex >= 0 ? currentLeagueIndex + 1 : 0;
          // target becomes the required league index + 1
          const leagueTarget = targetLeagueIndex + 1;
          progress = earned
            ? 100
            : Math.min((current / leagueTarget) * 100, 100);
          return {
            ...badge,
            earned,
            earnedAt: earnedBadge?.earnedAt || null,
            claimed: earnedBadge?.claimed || false,
            progress: Math.round(progress),
            current: user.stats.league,
            target: target,
          };
        case 'early_completion':
        case 'late_completion':
        case 'streak_restored':
        case 'lessons_per_day':
          // Boolean-style badges - either done or not done
          current = earned ? 1 : 0;
          progress = earned ? 100 : 0;
          return {
            ...badge,
            earned,
            earnedAt: earnedBadge?.earnedAt || null,
            claimed: earnedBadge?.claimed || false,
            progress: Math.round(progress),
            current: earned ? 'Completed' : 'Not yet',
            target: badge.description,
          };
        default:
          current = earned ? target : 0;
      }

      progress = earned ? 100 : Math.min((current / target) * 100, 100);

      return {
        ...badge,
        earned,
        earnedAt: earnedBadge?.earnedAt || null,
        claimed: earnedBadge?.claimed || false,
        progress: Math.round(progress),
        current,
        target,
      };
    });

    // Sort: earned first (by date), then by progress
    badgesWithProgress.sort((a, b) => {
      if (a.earned && !b.earned) return -1;
      if (!a.earned && b.earned) return 1;
      if (a.earned && b.earned) {
        return new Date(b.earnedAt) - new Date(a.earnedAt);
      }
      return b.progress - a.progress;
    });

    return badgesWithProgress;
  } catch (error) {
    console.error('Error getting user badges:', error);
    return [];
  }
};

/**
 * Claim a badge (mark as viewed)
 */
const claimBadge = async (userId, badgeId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    const badge = user.badges.find((b) => b.badgeId === badgeId);
    if (!badge) return false;

    badge.claimed = true;
    await user.save();

    return true;
  } catch (error) {
    console.error('Error claiming badge:', error);
    return false;
  }
};

/**
 * Get recently earned unclaimed badges
 */
const getUnclaimedBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const unclaimed = user.badges
      .filter((b) => !b.claimed)
      .map((b) => {
        const badgeConfig = Object.values(BADGES).find(
          (badge) => badge.id === b.badgeId
        );
        return {
          ...badgeConfig,
          earnedAt: b.earnedAt,
        };
      })
      .filter((b) => b.id); // Filter out any undefined badges

    return unclaimed;
  } catch (error) {
    console.error('Error getting unclaimed badges:', error);
    return [];
  }
};

export {
  awardBadge,
  checkAndAwardBadges,
  checkBadgeCriteria,
  getUserBadgesWithProgress,
  hasBadge,
  claimBadge,
  getUnclaimedBadges,
};
