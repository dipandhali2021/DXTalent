import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import LessonCompletion from '../models/LessonCompletion.js';

// @desc    Get trending skills (most popular skills being learned)
// @route   GET /api/recruiter/trending-skills
// @access  Private (Recruiter/Admin)
export const getTrendingSkills = async (req, res) => {
  try {
    const { limit = 5, days = 30 } = req.query;

    // Calculate date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - parseInt(days));

    // Aggregate lesson completions by category
    const trendingSkills = await LessonCompletion.aggregate([
      {
        $match: {
          lastCompletionDate: { $gte: dateThreshold },
        },
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonId',
          foreignField: '_id',
          as: 'lesson',
        },
      },
      {
        $unwind: '$lesson',
      },
      {
        $group: {
          _id: '$lesson.category',
          completionCount: { $sum: '$completionCount' },
          uniqueLearners: { $addToSet: '$userId' },
        },
      },
      {
        $project: {
          skill: '$_id',
          demand: '$completionCount',
          learnerCount: { $size: '$uniqueLearners' },
          _id: 0,
        },
      },
      {
        $sort: { demand: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.json({
      success: true,
      data: {
        trendingSkills,
        period: `${days} days`,
      },
    });
  } catch (error) {
    console.error('Get trending skills error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending skills',
    });
  }
};

// @desc    Get active learners statistics (weekly activity)
// @route   GET /api/recruiter/active-learners
// @access  Private (Recruiter/Admin)
export const getActiveLearners = async (req, res) => {
  try {
    const { weeks = 4 } = req.query;

    const weeklyData = [];
    const now = new Date();

    // Calculate weekly activity for the past N weeks
    for (let i = parseInt(weeks) - 1; i >= 0; i--) {
      const weekEnd = new Date(now);
      weekEnd.setDate(weekEnd.getDate() - i * 7);

      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 7);

      // Count unique active users in this week
      const activeUsers = await LessonCompletion.distinct('userId', {
        lastCompletionDate: {
          $gte: weekStart,
          $lt: weekEnd,
        },
      });

      weeklyData.push({
        week: `Week ${parseInt(weeks) - i}`,
        learners: activeUsers.length,
        startDate: weekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
      });
    }

    res.json({
      success: true,
      data: {
        weeklyActivity: weeklyData,
      },
    });
  } catch (error) {
    console.error('Get active learners error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active learners',
    });
  }
};

// @desc    Get top candidates based on performance
// @route   GET /api/recruiter/top-candidates
// @access  Private (Recruiter/Admin)
export const getTopCandidates = async (req, res) => {
  try {
    const {
      limit = 10,
      minLevel = 1,
      league,
      skill,
      sortBy = 'xp',
    } = req.query;

    // Build query
    const query = {
      'stats.level': { $gte: parseInt(minLevel) },
    };

    if (league) {
      query['stats.league'] = league.toLowerCase();
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'xp':
        sort = { 'stats.xpPoints': -1 };
        break;
      case 'level':
        sort = { 'stats.level': -1 };
        break;
      case 'streak':
        sort = { 'stats.currentStreak': -1 };
        break;
      default:
        sort = { 'stats.xpPoints': -1 };
    }

    let candidates = await User.find(query)
      .select('username email profilePicture stats isEmailVerified createdAt')
      .sort(sort)
      .limit(parseInt(limit));

    // If skill filter is provided, filter by users who have completed lessons in that skill
    if (skill) {
      const userIds = candidates.map((c) => c._id);

      const usersWithSkill = await LessonCompletion.aggregate([
        {
          $match: {
            userId: { $in: userIds },
          },
        },
        {
          $lookup: {
            from: 'lessons',
            localField: 'lessonId',
            foreignField: '_id',
            as: 'lesson',
          },
        },
        {
          $unwind: '$lesson',
        },
        {
          $match: {
            'lesson.skillName': { $regex: skill, $options: 'i' },
          },
        },
        {
          $group: {
            _id: '$userId',
            totalCompletions: { $sum: '$completionCount' },
          },
        },
      ]);

      const skillUserIds = usersWithSkill.map((u) => u._id.toString());
      candidates = candidates.filter((c) =>
        skillUserIds.includes(c._id.toString())
      );
    }

    // Get top skills for each candidate with categories
    const candidateIds = candidates.map((c) => c._id);
    const topSkillsByUser = await LessonCompletion.aggregate([
      {
        $match: {
          userId: { $in: candidateIds },
        },
      },
      {
        $lookup: {
          from: 'lessons',
          localField: 'lessonId',
          foreignField: '_id',
          as: 'lesson',
        },
      },
      {
        $unwind: '$lesson',
      },
      {
        $group: {
          _id: {
            userId: '$userId',
            category: '$lesson.category',
          },
          completions: { $sum: '$completionCount' },
        },
      },
      {
        $sort: { completions: -1 },
      },
      {
        $group: {
          _id: '$_id.userId',
          topCategories: {
            $push: {
              category: '$_id.category',
              completions: '$completions',
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          topCategories: { $slice: ['$topCategories', 3] }, // Top 3 categories
        },
      },
    ]);

    const categoriesMap = topSkillsByUser.reduce((acc, item) => {
      acc[item._id.toString()] = item.topCategories.map((c) => c.category);
      return acc;
    }, {});

    // Format response
    const formattedCandidates = candidates.map((candidate) => ({
      id: candidate._id,
      name: candidate.username,
      username: candidate.username,
      email: candidate.email,
      avatar: candidate.profilePicture || '',
      xp: candidate.stats.xpPoints,
      accuracy: Math.round(
        (candidate.stats.challengesCompleted /
          Math.max(candidate.stats.challengesCompleted + 5, 1)) *
          100
      ), // Approximation
      league:
        candidate.stats.league.charAt(0).toUpperCase() +
        candidate.stats.league.slice(1),
      topSkills: categoriesMap[candidate._id.toString()] || [],
      streak: candidate.stats.currentStreak || 0,
      level: candidate.stats.level,
      isEmailVerified: candidate.isEmailVerified,
      joinedAt: candidate.createdAt,
    }));

    res.json({
      success: true,
      data: {
        candidates: formattedCandidates,
        total: formattedCandidates.length,
      },
    });
  } catch (error) {
    console.error('Get top candidates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top candidates',
    });
  }
};

// @desc    Get recruiter dashboard overview
// @route   GET /api/recruiter/overview
// @access  Private (Recruiter/Admin)
export const getRecruiterOverview = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get users by league
    const usersByLeague = await User.aggregate([
      {
        $group: {
          _id: '$stats.league',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get active users in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await LessonCompletion.distinct('userId', {
      lastCompletionDate: { $gte: sevenDaysAgo },
    });

    // Get total lessons completed
    const totalCompletions = await LessonCompletion.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$completionCount' },
        },
      },
    ]);

    // Get most popular categories
    const popularCategories = await Lesson.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers: activeUsers.length,
        totalCompletions:
          totalCompletions.length > 0 ? totalCompletions[0].total : 0,
        usersByLeague: usersByLeague.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        popularCategories: popularCategories.map((c) => ({
          category: c._id,
          count: c.count,
        })),
      },
    });
  } catch (error) {
    console.error('Get recruiter overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recruiter overview',
    });
  }
};
