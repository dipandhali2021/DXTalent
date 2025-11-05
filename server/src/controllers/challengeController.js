import User from '../models/User.js';
import LessonCompletion from '../models/LessonCompletion.js';

// Define all available challenges
const ALL_CHALLENGES = [
  // Daily Challenges
  {
    id: 'daily_1',
    type: 'daily',
    title: 'Complete 3 Lessons',
    description: 'Finish three lessons today to earn bonus XP',
    xpReward: 100,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const count = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions.filter((c) => {
            const compDate = new Date(c.completedAt);
            return compDate >= today && compDate < tomorrow;
          }).length
        );
      }, 0);

      return { progress: Math.min(count, 3), total: 3 };
    },
  },
  {
    id: 'daily_2',
    type: 'daily',
    title: 'Score 80%+ on Test',
    description: 'Pass any test with 80% or higher accuracy',
    xpReward: 250,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const hasHighScore = completions.some((comp) =>
        comp.completions.some((c) => {
          const compDate = new Date(c.completedAt);
          return compDate >= today && compDate < tomorrow && c.accuracy >= 80;
        })
      );

      return { progress: hasHighScore ? 1 : 0, total: 1 };
    },
  },
  {
    id: 'daily_3',
    type: 'daily',
    title: 'Perfect Score',
    description: 'Complete a lesson with 100% accuracy',
    xpReward: 300,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const hasPerfect = completions.some((comp) =>
        comp.completions.some((c) => {
          const compDate = new Date(c.completedAt);
          return compDate >= today && compDate < tomorrow && c.accuracy === 100;
        })
      );

      return { progress: hasPerfect ? 1 : 0, total: 1 };
    },
  },
  {
    id: 'daily_4',
    type: 'daily',
    title: 'Fast Learner',
    description: 'Complete 2 lessons in under 30 minutes',
    xpReward: 150,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const count = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions.filter((c) => {
            const compDate = new Date(c.completedAt);
            return compDate >= today && compDate < tomorrow;
          }).length
        );
      }, 0);

      return { progress: Math.min(count, 2), total: 2 };
    },
  },
  {
    id: 'daily_5',
    type: 'daily',
    title: 'Early Bird',
    description: 'Complete a lesson before 10 AM',
    xpReward: 120,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cutoff = new Date(today);
      cutoff.setHours(10, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const hasEarly = completions.some((comp) =>
        comp.completions.some((c) => {
          const compDate = new Date(c.completedAt);
          return compDate >= today && compDate < cutoff;
        })
      );

      return { progress: hasEarly ? 1 : 0, total: 1 };
    },
  },
  {
    id: 'daily_6',
    type: 'daily',
    title: 'Night Owl',
    description: 'Complete a lesson after 8 PM',
    xpReward: 120,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const cutoff = new Date(today);
      cutoff.setHours(20, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const hasLate = completions.some((comp) =>
        comp.completions.some((c) => {
          const compDate = new Date(c.completedAt);
          return compDate >= cutoff && compDate < tomorrow;
        })
      );

      return { progress: hasLate ? 1 : 0, total: 1 };
    },
  },
  {
    id: 'daily_7',
    type: 'daily',
    title: 'Quiz Master',
    description: 'Answer 15 questions correctly today',
    xpReward: 200,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const correctCount = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions
            .filter((c) => {
              const compDate = new Date(c.completedAt);
              return compDate >= today && compDate < tomorrow;
            })
            .reduce((s, c) => s + c.correctAnswers, 0)
        );
      }, 0);

      return { progress: Math.min(correctCount, 15), total: 15 };
    },
  },
  {
    id: 'daily_8',
    type: 'daily',
    title: 'Skill Sampler',
    description: 'Complete lessons from 2 different categories',
    xpReward: 180,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      }).populate('lessonId');

      const categories = new Set();
      completions.forEach((comp) => {
        comp.completions.forEach((c) => {
          const compDate = new Date(c.completedAt);
          if (
            compDate >= today &&
            compDate < tomorrow &&
            comp.lessonId?.category
          ) {
            categories.add(comp.lessonId.category);
          }
        });
      });

      return { progress: Math.min(categories.size, 2), total: 2 };
    },
  },
  {
    id: 'daily_9',
    type: 'daily',
    title: 'XP Hunter',
    description: 'Earn 200 XP today',
    xpReward: 150,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const xpEarned = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions
            .filter((c) => {
              const compDate = new Date(c.completedAt);
              return compDate >= today && compDate < tomorrow;
            })
            .reduce((s, c) => s + (c.xpEarned || 0), 0)
        );
      }, 0);

      return { progress: Math.min(xpEarned, 200), total: 200 };
    },
  },
  {
    id: 'daily_10',
    type: 'daily',
    title: 'Comeback King',
    description: 'Retry and improve a previous lesson score',
    xpReward: 175,
    checkProgress: async (userId) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: today, $lt: tomorrow },
      });

      const hasImproved = completions.some((comp) => {
        if (comp.completions.length < 2) return false;
        const todayAttempts = comp.completions.filter((c) => {
          const compDate = new Date(c.completedAt);
          return compDate >= today && compDate < tomorrow;
        });
        return todayAttempts.length > 0;
      });

      return { progress: hasImproved ? 1 : 0, total: 1 };
    },
  },

  // Weekly Challenges
  {
    id: 'weekly_1',
    type: 'weekly',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day learning streak',
    xpReward: 500,
    checkProgress: async (userId) => {
      const user = await User.findById(userId);
      const streak = user?.stats?.currentStreak || 0;
      return { progress: Math.min(streak, 7), total: 7 };
    },
  },
  {
    id: 'weekly_2',
    type: 'weekly',
    title: 'Knowledge Seeker',
    description: 'Complete 15 lessons this week',
    xpReward: 600,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      const count = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions.filter((c) => {
            const compDate = new Date(c.completedAt);
            return compDate >= weekAgo;
          }).length
        );
      }, 0);

      return { progress: Math.min(count, 15), total: 15 };
    },
  },
  {
    id: 'weekly_3',
    type: 'weekly',
    title: 'Accuracy Expert',
    description: 'Maintain 85%+ average accuracy this week',
    xpReward: 550,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      let totalAccuracy = 0;
      let count = 0;

      completions.forEach((comp) => {
        comp.completions.forEach((c) => {
          const compDate = new Date(c.completedAt);
          if (compDate >= weekAgo) {
            totalAccuracy += c.accuracy;
            count++;
          }
        });
      });

      const avgAccuracy = count > 0 ? totalAccuracy / count : 0;
      return { progress: avgAccuracy >= 85 ? 1 : 0, total: 1 };
    },
  },
  {
    id: 'weekly_4',
    type: 'weekly',
    title: 'XP Millionaire',
    description: 'Earn 1000 XP this week',
    xpReward: 700,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      const xpEarned = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions
            .filter((c) => {
              const compDate = new Date(c.completedAt);
              return compDate >= weekAgo;
            })
            .reduce((s, c) => s + (c.xpEarned || 0), 0)
        );
      }, 0);

      return { progress: Math.min(xpEarned, 1000), total: 1000 };
    },
  },
  {
    id: 'weekly_5',
    type: 'weekly',
    title: 'Category Master',
    description: 'Complete lessons in all 5 main categories',
    xpReward: 650,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      }).populate('lessonId');

      const categories = new Set();
      completions.forEach((comp) => {
        comp.completions.forEach((c) => {
          const compDate = new Date(c.completedAt);
          if (compDate >= weekAgo && comp.lessonId?.category) {
            categories.add(comp.lessonId.category);
          }
        });
      });

      return { progress: Math.min(categories.size, 5), total: 5 };
    },
  },
  {
    id: 'weekly_6',
    type: 'weekly',
    title: 'Perfect Week',
    description: 'Complete 5 lessons with 100% accuracy',
    xpReward: 800,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      let perfectCount = 0;
      completions.forEach((comp) => {
        comp.completions.forEach((c) => {
          const compDate = new Date(c.completedAt);
          if (compDate >= weekAgo && c.accuracy === 100) {
            perfectCount++;
          }
        });
      });

      return { progress: Math.min(perfectCount, 5), total: 5 };
    },
  },
  {
    id: 'weekly_7',
    type: 'weekly',
    title: 'Consistent Learner',
    description: 'Complete at least 2 lessons every day this week',
    xpReward: 750,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      weekAgo.setHours(0, 0, 0, 0);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      const dailyCounts = new Map();
      completions.forEach((comp) => {
        comp.completions.forEach((c) => {
          const compDate = new Date(c.completedAt);
          if (compDate >= weekAgo) {
            const dateStr = compDate.toISOString().split('T')[0];
            dailyCounts.set(dateStr, (dailyCounts.get(dateStr) || 0) + 1);
          }
        });
      });

      let daysWithTwoOrMore = 0;
      dailyCounts.forEach((count) => {
        if (count >= 2) daysWithTwoOrMore++;
      });

      return { progress: Math.min(daysWithTwoOrMore, 7), total: 7 };
    },
  },
  {
    id: 'weekly_8',
    type: 'weekly',
    title: 'Marathon Runner',
    description: 'Complete 20+ lessons this week',
    xpReward: 1000,
    checkProgress: async (userId) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: weekAgo },
      });

      const count = completions.reduce((sum, comp) => {
        return (
          sum +
          comp.completions.filter((c) => {
            const compDate = new Date(c.completedAt);
            return compDate >= weekAgo;
          }).length
        );
      }, 0);

      return { progress: Math.min(count, 20), total: 20 };
    },
  },
];

/**
 * Get daily challenges for a user
 * GET /api/challenges/daily
 */
export const getDailyChallenges = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Initialize challenges if not exists
    if (!user.challenges) {
      user.challenges = {
        dailyChallenges: [],
        completedChallenges: [],
        lastReset: new Date(),
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastReset = user.challenges.lastReset
      ? new Date(user.challenges.lastReset)
      : null;

    // Check if we need to reset daily challenges
    let needsReset = false;
    if (!lastReset || lastReset < today) {
      needsReset = true;
    }

    // Reset challenges if needed
    if (needsReset) {
      // Separate daily and weekly challenges
      const dailyChallenges = ALL_CHALLENGES.filter((c) => c.type === 'daily');
      const weeklyChallenges = ALL_CHALLENGES.filter(
        (c) => c.type === 'weekly'
      );

      // Randomly select 2 daily challenges
      const selectedDaily = [];
      const dailyIndices = new Set();
      while (
        selectedDaily.length < 2 &&
        selectedDaily.length < dailyChallenges.length
      ) {
        const index = Math.floor(Math.random() * dailyChallenges.length);
        if (!dailyIndices.has(index)) {
          dailyIndices.add(index);
          selectedDaily.push(dailyChallenges[index].id);
        }
      }

      // Randomly select 1 weekly challenge
      const weeklyIndex = Math.floor(Math.random() * weeklyChallenges.length);
      const selectedWeekly = weeklyChallenges[weeklyIndex].id;

      user.challenges.dailyChallenges = [...selectedDaily, selectedWeekly];
      user.challenges.completedChallenges = [];
      user.challenges.lastReset = today;
      await user.save();
    }

    // Get current challenges with progress
    const challenges = await Promise.all(
      user.challenges.dailyChallenges.map(async (challengeId) => {
        const challenge = ALL_CHALLENGES.find((c) => c.id === challengeId);
        if (!challenge) return null;

        const { progress, total } = await challenge.checkProgress(userId);
        const completed = progress >= total;
        const claimed =
          user.challenges.completedChallenges?.includes(challengeId);

        return {
          id: challenge.id,
          type: challenge.type,
          title: challenge.title,
          description: challenge.description,
          xpReward: challenge.xpReward,
          progress,
          total,
          completed,
          claimed,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        challenges: challenges.filter((c) => c !== null),
      },
    });
  } catch (error) {
    console.error('Error fetching daily challenges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch challenges',
      error: error.message,
    });
  }
};

/**
 * Claim reward for completed challenge
 * POST /api/challenges/:challengeId/claim
 */
export const claimChallenge = async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if challenge is active
    if (!user.challenges?.dailyChallenges?.includes(challengeId)) {
      return res.status(400).json({
        success: false,
        message: 'Challenge not active',
      });
    }

    // Check if already claimed
    if (user.challenges.completedChallenges?.includes(challengeId)) {
      return res.status(400).json({
        success: false,
        message: 'Challenge already claimed',
      });
    }

    // Find challenge and check completion
    const challenge = ALL_CHALLENGES.find((c) => c.id === challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: 'Challenge not found',
      });
    }

    const { progress, total } = await challenge.checkProgress(userId);
    if (progress < total) {
      return res.status(400).json({
        success: false,
        message: 'Challenge not completed yet',
      });
    }

    // Award XP
    user.stats.xpPoints += challenge.xpReward;
    user.challenges.completedChallenges.push(challengeId);

    // Log XP transaction in history
    if (!user.xpHistory) {
      user.xpHistory = [];
    }
    user.xpHistory.push({
      amount: challenge.xpReward,
      source: 'challenge',
      description: `Challenge completed: ${challenge.title}`,
      timestamp: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Challenge reward claimed!',
      data: {
        xpEarned: challenge.xpReward,
        totalXP: user.stats.xpPoints,
      },
    });
  } catch (error) {
    console.error('Error claiming challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim challenge reward',
      error: error.message,
    });
  }
};
