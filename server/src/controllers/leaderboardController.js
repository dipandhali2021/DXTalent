import User from '../models/User.js';
import LessonCompletion from '../models/LessonCompletion.js';
import Lesson from '../models/Lesson.js';

/**
 * Calculate user's league based on XP
 */
const calculateLeague = (xp) => {
  if (xp >= 15000) return 'master';
  if (xp >= 10000) return 'diamond';
  if (xp >= 6000) return 'platinum';
  if (xp >= 3000) return 'gold';
  if (xp >= 1000) return 'silver';
  return 'bronze';
};

/**
 * Calculate average accuracy for a user
 */
const calculateAccuracy = async (userId) => {
  const completions = await LessonCompletion.find({ userId });

  if (completions.length === 0) return 0;

  const totalAccuracy = completions.reduce(
    (sum, completion) => sum + completion.bestScore.accuracy,
    0
  );

  return Math.round(totalAccuracy / completions.length);
};

/**
 * Get user's skills from completed lessons
 * Maps to main DX skill categories: Marketing, Development, Data, Business, Design, Other
 */
const getUserSkills = async (userId) => {
  const completions = await LessonCompletion.find({ userId })
    .populate('lessonId')
    .limit(20);

  const skillsMap = new Map();

  for (const completion of completions) {
    if (completion.lessonId && completion.lessonId.category) {
      // Use the category field directly - it already contains the main DX categories
      const category = completion.lessonId.category;

      // Map to the 6 main DX skill categories
      let skill = '';

      if (category === 'Marketing') skill = 'Marketing';
      else if (category === 'Development') skill = 'Development';
      else if (category === 'Data Science' || category === 'Data')
        skill = 'Data';
      else if (category === 'Business') skill = 'Business';
      else if (category === 'Design') skill = 'Design';
      else skill = 'Other';

      if (skill) {
        skillsMap.set(skill, (skillsMap.get(skill) || 0) + 1);
      }
    }
  }

  // Sort by frequency and return top 3
  return Array.from(skillsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([skill]) => skill);
};

/**
 * Get previous rankings for comparison (from 7 days ago)
 */
const getPreviousRankings = async () => {
  // In a real implementation, you'd store historical snapshots
  // For now, we'll just return an empty map
  // TODO: Implement historical ranking storage
  return new Map();
};

/**
 * Get global leaderboard with filters
 * GET /api/leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const {
      league = 'all',
      skill = 'all',
      timeframe = 'all-time',
      page = 1,
      limit = 50,
    } = req.query;

    // Build user filter - exclude recruiters and admins
    const userFilter = {
      role: { $nin: ['recruiter', 'admin'] },
    };
    if (league !== 'all') {
      userFilter['stats.league'] = league;
    }

    // Get all users sorted by XP
    let users = await User.find(userFilter)
      .select('username email profilePicture stats role')
      .sort({ 'stats.xpPoints': -1 })
      .lean();

    // Apply timeframe filter if needed
    if (timeframe === 'daily' || timeframe === 'weekly') {
      const days = timeframe === 'daily' ? 1 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Filter users who have activity in the timeframe
      const activeUserIds = await LessonCompletion.distinct('userId', {
        lastCompletionDate: { $gte: startDate },
      });

      users = users.filter((user) =>
        activeUserIds.some((id) => id.toString() === user._id.toString())
      );

      // Recalculate XP for timeframe
      for (const user of users) {
        const completionsInTimeframe = await LessonCompletion.find({
          userId: user._id,
          lastCompletionDate: { $gte: startDate },
        });

        // Sum XP from completions in timeframe
        user.timeframeXP = completionsInTimeframe.reduce((sum, completion) => {
          const recentCompletions = completion.completions.filter(
            (c) => new Date(c.completedAt) >= startDate
          );
          return (
            sum + recentCompletions.reduce((s, c) => s + (c.xpEarned || 0), 0)
          );
        }, 0);
      }

      // Re-sort by timeframe XP
      users.sort((a, b) => (b.timeframeXP || 0) - (a.timeframeXP || 0));
    }

    // Apply skill filter if needed
    if (skill !== 'all') {
      const userIdsWithSkill = await Lesson.distinct('userId', {
        skillName: new RegExp(skill, 'i'),
        isFullyGenerated: true,
      });

      // Filter to users who have completed lessons with this skill
      const completedUserIds = await LessonCompletion.distinct('userId', {
        lessonId: {
          $in: await Lesson.find({
            skillName: new RegExp(skill, 'i'),
          }).distinct('_id'),
        },
      });

      users = users.filter((user) =>
        completedUserIds.some((id) => id.toString() === user._id.toString())
      );
    }

    // Get previous rankings for comparison
    const previousRankings = await getPreviousRankings();

    // Build leaderboard data with additional info
    const leaderboardData = await Promise.all(
      users.map(async (user, index) => {
        const rank = index + 1;
        const accuracy = await calculateAccuracy(user._id);
        const skills = await getUserSkills(user._id);

        // Get XP gain in last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentCompletions = await LessonCompletion.find({
          userId: user._id,
          lastCompletionDate: { $gte: weekAgo },
        });

        const xpGain = recentCompletions.reduce((sum, completion) => {
          const recentXP = completion.completions
            .filter((c) => new Date(c.completedAt) >= weekAgo)
            .reduce((s, c) => s + (c.xpEarned || 0), 0);
          return sum + recentXP;
        }, 0);

        // Determine promotion status based on league threshold
        const currentXP = user.stats.xpPoints;
        const league = user.stats.league || calculateLeague(currentXP);
        let promotion = null;

        // Check if close to promotion (within 500 XP of next league)
        const leagueThresholds = {
          bronze: 1000,
          silver: 3000,
          gold: 6000,
          platinum: 10000,
          diamond: 15000,
          master: Infinity,
        };

        const nextLeagueThreshold = Object.entries(leagueThresholds).find(
          ([_, threshold]) => threshold > currentXP
        )?.[1];

        if (nextLeagueThreshold && currentXP >= nextLeagueThreshold - 500) {
          promotion = 'up';
        }

        // Check if at risk (XP decreased or very low activity)
        if (xpGain < 100 && rank > 5) {
          promotion = 'down';
        }

        const previousRank = previousRankings.get(user._id.toString()) || rank;

        // Update user's highest leaderboard rank if this is better
        const currentUser = await User.findById(user._id);
        if (
          !currentUser.badgeStats.highestLeaderboardRank ||
          rank < currentUser.badgeStats.highestLeaderboardRank
        ) {
          currentUser.badgeStats.highestLeaderboardRank = rank;
          await currentUser.save();
        }

        return {
          id: user._id.toString(),
          rank,
          username: user.username,
          email: user.email,
          avatar: user.profilePicture || '👤',
          xp: timeframe !== 'all-time' ? user.timeframeXP || 0 : currentXP,
          streak: user.stats.currentStreak || 0,
          accuracy,
          league,
          skills,
          verified: user.isEmailVerified || false,
          promotion,
          recruiterBadge: user.role === 'recruiter',
          xpGain,
          previousRank,
        };
      })
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedData = leaderboardData.slice(startIndex, endIndex);

    res.status(200).json({
      success: true,
      data: {
        leaderboard: paginatedData,
        total: leaderboardData.length,
        page: parseInt(page),
        totalPages: Math.ceil(leaderboardData.length / limit),
        filters: {
          league,
          skill,
          timeframe,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message,
    });
  }
};

/**
 * Get user's rank and position
 * GET /api/leaderboard/my-rank
 */
export const getMyRank = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all users sorted by XP
    const users = await User.find()
      .select('_id stats.xpPoints')
      .sort({ 'stats.xpPoints': -1 })
      .lean();

    // Find user's position
    const userIndex = users.findIndex(
      (u) => u._id.toString() === userId.toString()
    );

    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'User not found in leaderboard',
      });
    }

    const rank = userIndex + 1;
    const totalUsers = users.length;

    const user = await User.findById(userId);
    const accuracy = await calculateAccuracy(userId);
    const skills = await getUserSkills(userId);
    const league = user.stats.league || calculateLeague(user.stats.xpPoints);

    // Get nearby users (5 above and 5 below)
    const nearbyStart = Math.max(0, userIndex - 5);
    const nearbyEnd = Math.min(users.length, userIndex + 6);
    const nearbyUsers = users.slice(nearbyStart, nearbyEnd);

    const nearbyLeaderboard = await Promise.all(
      nearbyUsers.map(async (u, index) => {
        const nearbyUser = await User.findById(u._id);
        const nearbyAccuracy = await calculateAccuracy(u._id);
        const nearbySkills = await getUserSkills(u._id);

        return {
          id: u._id.toString(),
          rank: nearbyStart + index + 1,
          username: nearbyUser.username,
          avatar: nearbyUser.profilePicture || '👤',
          xp: u.stats.xpPoints,
          streak: nearbyUser.stats.currentStreak || 0,
          accuracy: nearbyAccuracy,
          league: nearbyUser.stats.league || calculateLeague(u.stats.xpPoints),
          skills: nearbySkills,
          isCurrentUser: u._id.toString() === userId.toString(),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        rank,
        totalUsers,
        percentile: Math.round(((totalUsers - rank) / totalUsers) * 100),
        xp: user.stats.xpPoints,
        league,
        accuracy,
        skills,
        streak: user.stats.currentStreak || 0,
        nearbyUsers: nearbyLeaderboard,
      },
    });
  } catch (error) {
    console.error('Error fetching user rank:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user rank',
      error: error.message,
    });
  }
};

/**
 * Get league statistics
 * GET /api/leaderboard/league-stats
 */
export const getLeagueStats = async (req, res) => {
  try {
    const leagues = [
      'bronze',
      'silver',
      'gold',
      'platinum',
      'diamond',
      'master',
    ];

    const stats = await Promise.all(
      leagues.map(async (league) => {
        const count = await User.countDocuments({ 'stats.league': league });

        // Get average XP for league
        const usersInLeague = await User.find({ 'stats.league': league })
          .select('stats.xpPoints')
          .lean();

        const avgXP =
          usersInLeague.length > 0
            ? Math.round(
                usersInLeague.reduce((sum, u) => sum + u.stats.xpPoints, 0) /
                  usersInLeague.length
              )
            : 0;

        // Get top 3 users in league
        const topUsers = await User.find({ 'stats.league': league })
          .select('username stats.xpPoints profilePicture')
          .sort({ 'stats.xpPoints': -1 })
          .limit(3)
          .lean();

        return {
          league,
          count,
          avgXP,
          topUsers: topUsers.map((u) => ({
            username: u.username,
            xp: u.stats.xpPoints,
            avatar: u.profilePicture || '👤',
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching league stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch league statistics',
      error: error.message,
    });
  }
};

/**
 * Get skill-based rankings
 * GET /api/leaderboard/skills/:skill
 */
export const getSkillLeaderboard = async (req, res) => {
  try {
    const { skill } = req.params;
    const { limit = 20 } = req.query;

    // Find all lessons for this skill
    const lessons = await Lesson.find({
      skillName: new RegExp(skill, 'i'),
      isFullyGenerated: true,
    }).select('_id');

    const lessonIds = lessons.map((l) => l._id);

    // Find all completions for these lessons
    const completions = await LessonCompletion.find({
      lessonId: { $in: lessonIds },
    })
      .populate('userId')
      .lean();

    // Aggregate by user
    const userSkillMap = new Map();

    for (const completion of completions) {
      if (!completion.userId) continue;

      const userId = completion.userId._id.toString();
      if (!userSkillMap.has(userId)) {
        userSkillMap.set(userId, {
          user: completion.userId,
          totalXP: 0,
          completedLessons: 0,
          avgAccuracy: 0,
          accuracySum: 0,
        });
      }

      const userData = userSkillMap.get(userId);
      userData.totalXP += completion.totalXPEarned || 0;
      userData.completedLessons += 1;
      userData.accuracySum += completion.bestScore.accuracy || 0;
    }

    // Convert to array and calculate averages
    const leaderboard = Array.from(userSkillMap.values())
      .map((data) => ({
        id: data.user._id.toString(),
        username: data.user.username,
        avatar: data.user.profilePicture || '👤',
        xp: data.totalXP,
        completedLessons: data.completedLessons,
        accuracy: Math.round(data.accuracySum / data.completedLessons),
        league:
          data.user.stats.league || calculateLeague(data.user.stats.xpPoints),
        streak: data.user.stats.currentStreak || 0,
      }))
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit)
      .map((user, index) => ({
        ...user,
        rank: index + 1,
      }));

    res.status(200).json({
      success: true,
      data: {
        skill,
        leaderboard,
        total: leaderboard.length,
      },
    });
  } catch (error) {
    console.error('Error fetching skill leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill leaderboard',
      error: error.message,
    });
  }
};

/**
 * Get AI insights for leaderboard
 * GET /api/leaderboard/insights
 */
export const getLeaderboardInsights = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const insights = [];

    // Insight 1: User's progress to next league
    const currentXP = user.stats.xpPoints;
    const league = user.stats.league || calculateLeague(currentXP);
    const leagueThresholds = {
      bronze: { next: 'silver', xp: 1000 },
      silver: { next: 'gold', xp: 3000 },
      gold: { next: 'platinum', xp: 6000 },
      platinum: { next: 'diamond', xp: 10000 },
      diamond: { next: 'master', xp: 15000 },
    };

    if (leagueThresholds[league]) {
      const threshold = leagueThresholds[league];
      const xpNeeded = threshold.xp - currentXP;
      const lessonsNeeded = Math.ceil(xpNeeded / 50); // Assuming avg 50 XP per lesson

      insights.push({
        type: 'recommendation',
        title: `Path to ${
          threshold.next.charAt(0).toUpperCase() + threshold.next.slice(1)
        } League`,
        description: `Complete ${lessonsNeeded} more lessons to reach ${threshold.next} league (${xpNeeded} XP needed).`,
        icon: 'Target',
      });
    }

    // Insight 2: Top performers in same league
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const topInLeague = await User.find({
      'stats.league': league,
      'stats.lastLessonDate': { $gte: weekAgo },
    })
      .sort({ 'stats.xpPoints': -1 })
      .limit(3)
      .select('username stats.xpPoints');

    if (topInLeague.length > 0) {
      insights.push({
        type: 'performers',
        title: 'Top Performers in Your League',
        description: `${topInLeague[0].username} leads ${league} league with ${topInLeague[0].stats.xpPoints} XP.`,
        icon: 'TrendingUp',
      });
    }

    // Insight 3: Trending skills
    const recentCompletions = await LessonCompletion.find({
      lastCompletionDate: { $gte: weekAgo },
    })
      .populate('lessonId')
      .limit(100);

    const skillCounts = new Map();
    recentCompletions.forEach((completion) => {
      if (completion.lessonId && completion.lessonId.skillName) {
        const skill = completion.lessonId.skillName;
        skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1);
      }
    });

    const topSkills = Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([skill]) => skill);

    if (topSkills.length > 0) {
      insights.push({
        type: 'trending',
        title: 'Trending Skills',
        description: `Users focusing on ${topSkills.join(
          ' & '
        )} are advancing faster this week.`,
        icon: 'Sparkles',
      });
    }

    // Insight 4: Streak motivation
    const currentStreak = user.stats.currentStreak || 0;
    if (currentStreak >= 5) {
      insights.push({
        type: 'prediction',
        title: 'Streak Milestone',
        description: `Amazing! Your ${currentStreak}-day streak puts you in the top 20% of learners.`,
        icon: 'Crown',
      });
    } else {
      insights.push({
        type: 'prediction',
        title: 'Build Your Streak',
        description: `Complete a lesson daily to build momentum and earn bonus XP.`,
        icon: 'Crown',
      });
    }

    res.status(200).json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Error fetching leaderboard insights:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch insights',
      error: error.message,
    });
  }
};

export { calculateLeague };
