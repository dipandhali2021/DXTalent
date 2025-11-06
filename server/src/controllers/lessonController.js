import Lesson from '../models/Lesson.js';
import Test from '../models/Test.js';
import User from '../models/User.js';
import {
  generateLesson,
  generateLessonOutlines,
  categorizeTopic,
  recommendTodaysLesson,
  generateTest,
} from '../utils/gemini.js';
import { computeLevelFromXP, calculateLessonXP } from '../utils/level.js';
import { updateStreak, getActivityData } from '../utils/streak.js';
import { calculateLeague } from './leaderboardController.js';
import { checkAndAwardBadges } from '../utils/badgeService.js';

/**
 * Generate initial lesson structure with first 3 lessons fully generated
 * and remaining 7 as placeholders
 * POST /api/lessons/generate
 */
const generateLessonStructure = async (req, res) => {
  try {
    const { topic } = req.body;
    // For testing without auth, use a test user ID
    const userId = req.user?.id || '507f1f77bcf86cd799439011'; // Test user ID

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    // Get user to check generation limits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check generation limits (Topic generation costs 1.0 credit)
    if (user.role !== 'recruiter') {
      const totalCredits =
        user.generationLimits.aiLessonsPerMonth +
        user.generationLimits.addonGenerations;
      const usedCredits = user.generationLimits.currentMonthGenerations;
      const availableCredits = totalCredits - usedCredits;

      if (availableCredits < 1.0) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient AI credits for topic generation',
          data: {
            required: 1.0,
            available: availableCredits,
            total: totalCredits,
            used: usedCredits,
            subscriptionType: user.subscriptionType,
            upgradeMessage:
              user.subscriptionType === 'free'
                ? 'Upgrade to Pro Learner for 5 credits per month'
                : 'Purchase addon package for 3 more credits',
          },
        });
      }
    }

    // Get topic metadata
    const metadata = await categorizeTopic(topic);

    // Define progressive difficulty levels for 10 lessons
    // 1-4: Beginner, 5-7: Intermediate, 8-10: Advanced
    const difficultyProgression = [
      'Beginner', // Lesson 1
      'Beginner', // Lesson 2
      'Beginner', // Lesson 3
      'Beginner', // Lesson 4
      'Intermediate', // Lesson 5
      'Intermediate', // Lesson 6
      'Intermediate', // Lesson 7
      'Advanced', // Lesson 8
      'Advanced', // Lesson 9
      'Advanced', // Lesson 10
    ];

    // Generate 10 lesson outlines with progressive difficulty
    const outlines = await generateLessonOutlines(topic, 10);

    // Generate first 3 lessons with full content
    const generatedLessons = [];
    for (let i = 0; i < 3 && i < outlines.length; i++) {
      const lessonDifficulty = difficultyProgression[i];
      const lessonContent = await generateLesson(
        outlines[i].skillName,
        lessonDifficulty,
        5
      );

      const lesson = await Lesson.create({
        userId,
        topic, // Add topic field for grouping
        skillName: lessonContent.skillName,
        skillIcon: lessonContent.skillIcon || metadata.skillIcon,
        category: lessonContent.category || metadata.category,
        difficulty: lessonDifficulty,
        description: lessonContent.description,
        duration: lessonContent.duration,
        questions: lessonContent.questions,
        isFullyGenerated: true,
        placeholder: false,
      });

      generatedLessons.push(lesson);
    }

    // Create placeholders for remaining 7 lessons
    const placeholderLessons = [];
    for (let i = 3; i < outlines.length; i++) {
      const lessonDifficulty = difficultyProgression[i];
      const placeholder = await Lesson.create({
        userId,
        topic, // Add topic field for grouping
        skillName: outlines[i].skillName,
        skillIcon: outlines[i].skillIcon || metadata.skillIcon,
        category: metadata.category,
        difficulty: lessonDifficulty,
        description: outlines[i].description,
        duration: outlines[i].duration,
        questions: [],
        isFullyGenerated: false,
        placeholder: true,
      });

      placeholderLessons.push(placeholder);
    }

    // Deduct 1.0 credit for topic generation (only for non-recruiters)
    if (user.role !== 'recruiter') {
      user.generationLimits.currentMonthGenerations += 1.0;
      await user.save();
    }

    // Calculate remaining credits
    const totalCredits =
      user.generationLimits.aiLessonsPerMonth +
      user.generationLimits.addonGenerations;
    const usedCredits = user.generationLimits.currentMonthGenerations;
    const remainingCredits = totalCredits - usedCredits;

    res.status(201).json({
      success: true,
      message: 'Lesson structure generated successfully',
      data: {
        topic,
        metadata,
        fullyGenerated: generatedLessons,
        placeholders: placeholderLessons,
        creditsUsed: 1.0,
        creditsRemaining: remainingCredits,
      },
    });
  } catch (error) {
    console.error('Error generating lesson structure:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lesson structure',
      error: error.message,
    });
  }
};

/**
 * Generate full content for a placeholder lesson
 * POST /api/lessons/:lessonId/generate-content
 */
const generatePlaceholderContent = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Get user to check generation limits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check generation limits (Individual lesson generation costs 0.5 credit)
    if (user.role !== 'recruiter') {
      const totalCredits =
        user.generationLimits.aiLessonsPerMonth +
        user.generationLimits.addonGenerations;
      const usedCredits = user.generationLimits.currentMonthGenerations;
      const availableCredits = totalCredits - usedCredits;

      if (availableCredits < 0.5) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient AI credits for lesson generation',
          data: {
            required: 0.5,
            available: availableCredits,
            total: totalCredits,
            used: usedCredits,
            subscriptionType: user.subscriptionType,
            upgradeMessage:
              user.subscriptionType === 'free'
                ? 'Upgrade to Pro Learner for 5 credits per month'
                : 'Purchase addon package for 3 more credits',
          },
        });
      }
    }

    const lesson = await Lesson.findOne({ _id: lessonId, userId });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    if (lesson.isFullyGenerated && !lesson.placeholder) {
      return res.status(400).json({
        success: false,
        message: 'Lesson content already generated',
      });
    }

    // Generate full lesson content
    const lessonContent = await generateLesson(
      lesson.skillName,
      lesson.difficulty,
      5
    );

    // Update the lesson
    lesson.questions = lessonContent.questions;
    lesson.description = lessonContent.description || lesson.description;
    lesson.duration = lessonContent.duration || lesson.duration;
    lesson.isFullyGenerated = true;
    lesson.placeholder = false;

    await lesson.save();

    // Deduct 0.5 credit for individual lesson generation (only for non-recruiters)
    if (user.role !== 'recruiter') {
      user.generationLimits.currentMonthGenerations += 0.5;
      await user.save();
    }

    // Calculate remaining credits
    const totalCredits =
      user.generationLimits.aiLessonsPerMonth +
      user.generationLimits.addonGenerations;
    const usedCredits = user.generationLimits.currentMonthGenerations;
    const remainingCredits = totalCredits - usedCredits;

    res.status(200).json({
      success: true,
      message: 'Lesson content generated successfully',
      data: lesson,
      creditsUsed: 0.5,
      creditsRemaining:
        user.role === 'recruiter' ? 'unlimited' : remainingCredits,
    });
  } catch (error) {
    console.error('Error generating placeholder content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate lesson content',
      error: error.message,
    });
  }
};

/**
 * Get all lessons for the authenticated user
 * GET /api/lessons
 */
const getUserLessons = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, difficulty, isFullyGenerated } = req.query;

    // Build filter for user-specific and global default lessons
    const userFilter = { userId };
    const globalFilter = { userId: null, isDefault: true };

    if (category) {
      userFilter.category = category;
      globalFilter.category = category;
    }
    if (difficulty) {
      userFilter.difficulty = difficulty;
      globalFilter.difficulty = difficulty;
    }
    if (isFullyGenerated !== undefined) {
      userFilter.isFullyGenerated = isFullyGenerated === 'true';
      globalFilter.isFullyGenerated = isFullyGenerated === 'true';
    }

    // Fetch both user-specific and global default lessons
    const [userLessons, defaultLessons] = await Promise.all([
      Lesson.find(userFilter).sort({ createdAt: -1 }).select('-questions'),
      Lesson.find(globalFilter).sort({ createdAt: -1 }).select('-questions'),
    ]);

    // Combine lessons (user-specific first, then defaults)
    const lessons = [...userLessons, ...defaultLessons];

    // Get completion status for all lessons
    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;
    const lessonIds = lessons.map((lesson) => lesson._id);

    const completions = await LessonCompletion.find({
      userId,
      lessonId: { $in: lessonIds },
    });

    // Create a map of lesson completions
    const completionMap = new Map();
    completions.forEach((completion) => {
      completionMap.set(completion.lessonId.toString(), {
        isCompleted: true,
        completionCount: completion.completionCount,
        bestScore: completion.bestScore,
        lastCompletionDate: completion.lastCompletionDate,
      });
    });

    // Add completion status to each lesson
    const lessonsWithCompletion = lessons.map((lesson) => {
      const lessonObj = lesson.toObject();
      const completion = completionMap.get(lesson._id.toString());
      return {
        ...lessonObj,
        completionStatus: completion || {
          isCompleted: false,
          completionCount: 0,
        },
      };
    });

    res.status(200).json({
      success: true,
      count: lessonsWithCompletion.length,
      data: lessonsWithCompletion,
    });
  } catch (error) {
    console.error('Error fetching user lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lessons',
      error: error.message,
    });
  }
};

/**
 * Get a single lesson with full content
 * GET /api/lessons/:lessonId
 */
const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Try to find user-specific lesson first, then global default lesson
    let lesson = await Lesson.findOne({ _id: lessonId, userId });

    if (!lesson) {
      // Check if it's a global default lesson
      lesson = await Lesson.findOne({
        _id: lessonId,
        userId: null,
        isDefault: true,
      });
    }

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    if (lesson.placeholder && !lesson.isFullyGenerated) {
      return res.status(400).json({
        success: false,
        message: 'Lesson content not yet generated. Please generate it first.',
        data: {
          lessonId: lesson._id,
          skillName: lesson.skillName,
          placeholder: true,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson',
      error: error.message,
    });
  }
};

/**
 * Delete a lesson
 * DELETE /api/lessons/:lessonId
 */
const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await Lesson.findOneAndDelete({ _id: lessonId, userId });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete lesson',
      error: error.message,
    });
  }
};

/**
 * Get lesson statistics for user
 * GET /api/lessons/stats
 */
const getLessonStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Convert userId to ObjectId for aggregation
    const mongoose = await import('mongoose');
    const userObjectId = new mongoose.default.Types.ObjectId(userId);

    // Count user-specific lessons
    const userLessons = await Lesson.countDocuments({ userId });
    const userFullyGenerated = await Lesson.countDocuments({
      userId,
      isFullyGenerated: true,
    });
    const userPlaceholders = await Lesson.countDocuments({
      userId,
      placeholder: true,
    });

    // Count global default lessons
    const globalLessons = await Lesson.countDocuments({
      userId: null,
      isDefault: true,
    });
    const globalFullyGenerated = await Lesson.countDocuments({
      userId: null,
      isDefault: true,
      isFullyGenerated: true,
    });

    // Total counts
    const totalLessons = userLessons + globalLessons;
    const fullyGenerated = userFullyGenerated + globalFullyGenerated;
    const placeholders = userPlaceholders;

    // Category breakdown (both user and global lessons)
    const categoryBreakdown = await Lesson.aggregate([
      {
        $match: {
          $or: [{ userId: userObjectId }, { userId: null, isDefault: true }],
        },
      },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Difficulty breakdown (both user and global lessons)
    const difficultyBreakdown = await Lesson.aggregate([
      {
        $match: {
          $or: [{ userId: userObjectId }, { userId: null, isDefault: true }],
        },
      },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLessons,
        fullyGenerated,
        placeholders,
        userLessons,
        globalLessons,
        categoryBreakdown,
        difficultyBreakdown,
      },
    });
  } catch (error) {
    console.error('Error fetching lesson stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson statistics',
      error: error.message,
    });
  }
};

/**
 * Complete a lesson and update user XP
 * POST /api/lessons/:lessonId/complete
 */
const completeLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { correctAnswers, totalQuestions } = req.body;
    const userId = req.user.id;

    // Validate input
    if (correctAnswers === undefined || totalQuestions === undefined) {
      return res.status(400).json({
        success: false,
        message: 'correctAnswers and totalQuestions are required',
      });
    }

    // Verify lesson exists (user-specific or global)
    let lesson = await Lesson.findOne({ _id: lessonId, userId });

    if (!lesson) {
      // Check if it's a global default lesson
      lesson = await Lesson.findOne({
        _id: lessonId,
        userId: null,
        isDefault: true,
      });
    }

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Import models
    const User = (await import('../models/User.js')).default;
    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;

    // Check if user has completed this lesson before
    let lessonCompletion = await LessonCompletion.findOne({
      userId,
      lessonId,
    });

    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    let actualXpEarned = 0;
    let isFirstCompletion = false;

    if (!lessonCompletion) {
      // First time completing this lesson - award difficulty-based XP proportional to score
      isFirstCompletion = true;
      actualXpEarned = calculateLessonXP(
        lesson.difficulty,
        true,
        correctAnswers,
        totalQuestions
      );

      // Create new completion record
      lessonCompletion = await LessonCompletion.create({
        userId,
        lessonId,
        completionCount: 1,
        firstCompletionDate: new Date(),
        lastCompletionDate: new Date(),
        bestScore: {
          correctAnswers,
          totalQuestions,
          accuracy,
        },
        totalXPEarned: actualXpEarned,
        completions: [
          {
            completedAt: new Date(),
            correctAnswers,
            totalQuestions,
            accuracy,
            xpEarned: actualXpEarned,
          },
        ],
      });
    } else {
      // Lesson completed before - award only 10 XP
      actualXpEarned = calculateLessonXP(lesson.difficulty, false);

      // Update completion record
      lessonCompletion.completionCount += 1;
      lessonCompletion.lastCompletionDate = new Date();
      lessonCompletion.totalXPEarned += actualXpEarned;

      // Update best score if this attempt is better
      if (accuracy > lessonCompletion.bestScore.accuracy) {
        lessonCompletion.bestScore = {
          correctAnswers,
          totalQuestions,
          accuracy,
        };
      }

      // Add this completion to history
      lessonCompletion.completions.push({
        completedAt: new Date(),
        correctAnswers,
        totalQuestions,
        accuracy,
        xpEarned: actualXpEarned,
      });

      await lessonCompletion.save();
    }

    // Update user stats
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Store previous level for level-up detection
    const previousLevel = user.stats.level;

    // Add XP to user stats
    user.stats.xpPoints += actualXpEarned;

    // Log XP transaction in history
    if (!user.xpHistory) {
      user.xpHistory = [];
    }
    user.xpHistory.push({
      amount: actualXpEarned,
      source: 'lesson',
      description: `Completed lesson: ${lesson.title}`,
      timestamp: new Date(),
    });

    // Increment challenges completed only on first completion
    if (isFirstCompletion) {
      user.stats.challengesCompleted += 1;
    }

    // Update streak and daily activity
    const streakInfo = updateStreak(user, new Date());

    // Update badge stats
    if (isFirstCompletion) {
      user.badgeStats.lessonsCompletedTotal += 1;
    }

    // Track lessons completed today
    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.badgeStats.lastLessonCompletionDate
      ? new Date(user.badgeStats.lastLessonCompletionDate)
          .toISOString()
          .split('T')[0]
      : null;

    if (lastDate === today) {
      user.badgeStats.lessonsCompletedToday += 1;
    } else {
      user.badgeStats.lessonsCompletedToday = 1;
    }

    user.badgeStats.lastLessonCompletionDate = new Date();

    // Track perfect test scores
    if (accuracy === 100) {
      user.badgeStats.perfectTestsCount += 1;
    }

    // Track categories explored
    if (
      lesson.category &&
      !user.badgeStats.categoriesExplored.includes(lesson.category)
    ) {
      user.badgeStats.categoriesExplored.push(lesson.category);
    }

    // Calculate new level based on milestone system
    const levelInfo = computeLevelFromXP(user.stats.xpPoints);
    user.stats.level = levelInfo.level;
    user.stats.levelName = levelInfo.levelName;
    user.stats.xpIntoLevel = levelInfo.xpIntoLevel;
    user.stats.xpForNextLevel = levelInfo.xpForNextLevel;
    user.stats.xpProgress = levelInfo.xpProgress;

    // Calculate and update league based on XP
    const previousLeague = user.stats.league;
    const newLeague = calculateLeague(user.stats.xpPoints);
    user.stats.league = newLeague;

    await user.save();

    // Check for newly earned badges
    const newBadges = await checkAndAwardBadges(userId);

    // Check if user leveled up
    const leveledUp = levelInfo.level > previousLevel;
    const leagueChanged = previousLeague !== newLeague;

    res.status(200).json({
      success: true,
      message: isFirstCompletion
        ? 'Lesson completed successfully!'
        : 'Lesson retaken successfully!',
      data: {
        xpEarned: actualXpEarned,
        totalXP: user.stats.xpPoints,
        level: levelInfo.level,
        levelName: levelInfo.levelName,
        xpIntoLevel: levelInfo.xpIntoLevel,
        xpForNextLevel: levelInfo.xpForNextLevel,
        xpProgress: levelInfo.xpProgress,
        nextLevelName: levelInfo.nextLevelName,
        league: newLeague,
        leagueChanged,
        previousLeague,
        correctAnswers,
        totalQuestions,
        accuracy,
        isFirstCompletion,
        completionCount: lessonCompletion.completionCount,
        bestScore: lessonCompletion.bestScore,
        leveledUp,
        streak: {
          current: streakInfo.currentStreak,
          longest: streakInfo.longestStreak,
          todayLessons: streakInfo.todayLessons,
          streakIncreased: streakInfo.streakIncreased,
        },
        newBadges: newBadges.length > 0 ? newBadges : undefined,
      },
    });
  } catch (error) {
    console.error('Error completing lesson:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete lesson',
      error: error.message,
    });
  }
};

/**
 * Get lesson completion status
 * GET /api/lessons/:lessonId/completion-status
 */
const getLessonCompletionStatus = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;

    const completion = await LessonCompletion.findOne({
      userId,
      lessonId,
    });

    if (!completion) {
      return res.status(200).json({
        success: true,
        data: {
          isCompleted: false,
          completionCount: 0,
          message: 'First attempt - Full XP will be awarded!',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isCompleted: true,
        completionCount: completion.completionCount,
        bestScore: completion.bestScore,
        firstCompletionDate: completion.firstCompletionDate,
        lastCompletionDate: completion.lastCompletionDate,
        totalXPEarned: completion.totalXPEarned,
        message: 'Already completed - Only 10 XP will be awarded for retake',
      },
    });
  } catch (error) {
    console.error('Error fetching lesson completion status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch lesson completion status',
      error: error.message,
    });
  }
};

/**
 * Get user's daily activity for heatmap
 * GET /api/lessons/activity?days=365 or ?month=0&year=2024
 */
const getUserActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 365, month, year } = req.query;

    const User = (await import('../models/User.js')).default;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get activity data - either for specific month/year or last N days
    let activityData;
    if (month !== undefined && year !== undefined) {
      activityData = getActivityData(
        user.dailyActivity,
        parseInt(days),
        parseInt(month),
        parseInt(year)
      );
    } else {
      activityData = getActivityData(user.dailyActivity, parseInt(days));
    }

    res.status(200).json({
      success: true,
      data: {
        activity: activityData,
        currentStreak: user.stats.currentStreak || 0,
        longestStreak: user.stats.longestStreak || 0,
        totalLessons: user.stats.challengesCompleted || 0,
      },
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user activity',
      error: error.message,
    });
  }
};

/**
 * Get user statistics including weekly XP and skill proficiency
 * GET /api/lessons/user-stats
 */
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const User = (await import('../models/User.js')).default;
    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate daily XP for the current week (Sun - Sat)
    const dailyXP = [];
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate the start of the current week (Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - dayOfWeek);
    weekStart.setHours(0, 0, 0, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      const dayEnd = new Date(dayDate);
      dayEnd.setHours(23, 59, 59, 999);

      let dayXP = 0;

      // Get XP from lesson completions
      const completions = await LessonCompletion.find({
        userId,
        lastCompletionDate: { $gte: dayDate, $lte: dayEnd },
      });

      completions.forEach((completion) => {
        completion.completions.forEach((comp) => {
          const compDate = new Date(comp.completedAt);
          // Check if completion falls on this specific day
          if (
            compDate.getFullYear() === dayDate.getFullYear() &&
            compDate.getMonth() === dayDate.getMonth() &&
            compDate.getDate() === dayDate.getDate()
          ) {
            dayXP += comp.xpEarned || 0;
          }
        });
      });

      // Get XP from XP history (tests, challenges, badges)
      if (user.xpHistory && Array.isArray(user.xpHistory)) {
        user.xpHistory.forEach((xpEntry) => {
          const entryDate = new Date(xpEntry.timestamp);
          // Check if XP entry falls on this specific day
          if (
            entryDate >= dayDate &&
            entryDate <= dayEnd &&
            entryDate.getFullYear() === dayDate.getFullYear() &&
            entryDate.getMonth() === dayDate.getMonth() &&
            entryDate.getDate() === dayDate.getDate()
          ) {
            dayXP += xpEntry.amount || 0;
          }
        });
      }

      console.log(
        `Total XP for ${dayNames[i]} (${
          dayDate.toISOString().split('T')[0]
        }): ${dayXP}`
      );

      dailyXP.push({
        day: dayNames[i],
        xp: dayXP,
        date: dayDate.toISOString().split('T')[0],
      });
    }

    console.log('Final dailyXP array:', dailyXP);

    // Calculate skill proficiency based on completed lessons by category
    const completions = await LessonCompletion.find({ userId })
      .populate('lessonId')
      .lean();

    const categoryStats = new Map();

    for (const completion of completions) {
      if (completion.lessonId && completion.lessonId.category) {
        const category = completion.lessonId.category;

        if (!categoryStats.has(category)) {
          categoryStats.set(category, {
            count: 0,
            totalAccuracy: 0,
          });
        }

        const stats = categoryStats.get(category);
        stats.count += 1;
        stats.totalAccuracy += completion.bestScore.accuracy || 0;
      }
    }

    // Convert to skill proficiency (0-100 scale)
    const skillData = [];
    const mainCategories = [
      'Business',
      'Marketing',
      'Development',
      'Design',
      'Data',
    ];

    mainCategories.forEach((category) => {
      const stats = categoryStats.get(category);
      let proficiency = 0;

      if (stats) {
        // Proficiency based on: (average accuracy * 0.7) + (lesson count * 3)
        // Max proficiency is 100
        const avgAccuracy = stats.totalAccuracy / stats.count;
        proficiency = Math.min(
          100,
          Math.round(avgAccuracy * 0.7 + stats.count * 3)
        );
      }

      skillData.push({
        skill: category,
        proficiency,
      });
    });

    res.status(200).json({
      success: true,
      data: {
        weeklyXP: dailyXP,
        skillData,
        totalXP: user.stats.xpPoints || 0,
        completedLessons: completions.length,
      },
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message,
    });
  }
};

/**
 * Get AI-powered lesson recommendation for today
 * GET /api/lessons/ai-recommendation
 */
const getAIRecommendation = async (req, res) => {
  try {
    const userId = req.user.id;
    const User = (await import('../models/User.js')).default;
    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;

    // Get user stats
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's completed lessons with details
    const completions = await LessonCompletion.find({ userId })
      .populate('lessonId')
      .sort({ lastCompletionDate: -1 })
      .limit(10);

    const completedLessons = completions
      .filter((c) => c.lessonId) // Filter out null references
      .map((completion) => ({
        skillName: completion.lessonId.skillName,
        category: completion.lessonId.category,
        difficulty: completion.lessonId.difficulty,
        completionCount: completion.completionCount,
        bestAccuracy: completion.bestScore.accuracy,
      }));

    // Get available lessons (not completed or completed but can be retaken)
    // Include both user-specific and global default lessons
    const [userLessons, globalLessons] = await Promise.all([
      Lesson.find({
        userId,
        isFullyGenerated: true,
      }).select('_id skillName category difficulty duration'),
      Lesson.find({
        userId: null,
        isDefault: true,
        isFullyGenerated: true,
      }).select('_id skillName category difficulty duration'),
    ]);

    const allLessons = [...userLessons, ...globalLessons];

    // Get completed lesson IDs
    const completedLessonIds = completions.map((c) =>
      c.lessonId?._id?.toString()
    );

    // Filter for incomplete lessons, or if all completed, use all lessons
    let availableLessons = allLessons.filter(
      (lesson) => !completedLessonIds.includes(lesson._id.toString())
    );

    // If all lessons completed, use all lessons for recommendation
    if (availableLessons.length === 0) {
      availableLessons = allLessons;
    }

    if (availableLessons.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          recommendation: null,
          message:
            'No lessons available yet. Generate some lessons to get started!',
        },
      });
    }

    // Get AI recommendation
    const userStats = {
      xp: user.stats.xpPoints,
      level: user.stats.level,
      league: user.stats.league,
    };

    const recommendation = await recommendTodaysLesson(
      completedLessons,
      availableLessons,
      userStats
    );

    res.status(200).json({
      success: true,
      data: {
        recommendation,
      },
    });
  } catch (error) {
    console.error('Error getting AI recommendation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI recommendation',
      error: error.message,
    });
  }
};

/**
 * Get the next lesson to continue based on last completed lesson
 * GET /api/lessons/continue-journey
 */
const getContinueJourney = async (req, res) => {
  try {
    const userId = req.user.id;
    const LessonCompletion = (await import('../models/LessonCompletion.js'))
      .default;

    // Get user's most recently completed lesson
    const lastCompletion = await LessonCompletion.findOne({ userId })
      .populate('lessonId')
      .sort({ lastCompletionDate: -1 })
      .limit(1);

    if (!lastCompletion || !lastCompletion.lessonId) {
      // No completed lessons, get the first available lesson (user-specific or global)
      let firstLesson = await Lesson.findOne({
        userId,
        isFullyGenerated: true,
      }).sort({ createdAt: 1 });

      if (!firstLesson) {
        // Try global default lessons
        firstLesson = await Lesson.findOne({
          userId: null,
          isDefault: true,
          isFullyGenerated: true,
        }).sort({ createdAt: 1 });
      }

      if (!firstLesson) {
        return res.status(200).json({
          success: true,
          data: {
            nextLesson: null,
            message: 'No lessons available. Generate some lessons to start!',
          },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          nextLesson: {
            lessonId: firstLesson._id,
            title: firstLesson.skillName,
            topic: firstLesson.topic,
            category: firstLesson.category,
            difficulty: firstLesson.difficulty,
            progress: 0,
            isFirst: true,
          },
        },
      });
    }

    const lastLesson = lastCompletion.lessonId;

    // Find the next lesson in the same topic (from user lessons or global lessons)
    let nextLessonInTopic = await Lesson.findOne({
      userId,
      topic: lastLesson.topic,
      isFullyGenerated: true,
      createdAt: { $gt: lastLesson.createdAt }, // Get lessons created after the last one
    }).sort({ createdAt: 1 });

    if (!nextLessonInTopic) {
      // Check global default lessons
      nextLessonInTopic = await Lesson.findOne({
        userId: null,
        isDefault: true,
        topic: lastLesson.topic,
        isFullyGenerated: true,
        createdAt: { $gt: lastLesson.createdAt },
      }).sort({ createdAt: 1 });
    }

    // Get all lessons in this topic to calculate progress (both user and global)
    const [userTopicLessons, globalTopicLessons] = await Promise.all([
      Lesson.find({
        userId,
        topic: lastLesson.topic,
      }).sort({ createdAt: 1 }),
      Lesson.find({
        userId: null,
        isDefault: true,
        topic: lastLesson.topic,
      }).sort({ createdAt: 1 }),
    ]);

    const allTopicLessons = [...userTopicLessons, ...globalTopicLessons];

    // Get completed lessons in this topic
    const completedInTopic = await LessonCompletion.find({
      userId,
      lessonId: { $in: allTopicLessons.map((l) => l._id) },
    });

    const progress = Math.round(
      (completedInTopic.length / allTopicLessons.length) * 100
    );

    if (nextLessonInTopic) {
      return res.status(200).json({
        success: true,
        data: {
          nextLesson: {
            lessonId: nextLessonInTopic._id,
            title: nextLessonInTopic.skillName,
            topic: nextLessonInTopic.topic,
            category: nextLessonInTopic.category,
            difficulty: nextLessonInTopic.difficulty,
            progress,
            isFirst: false,
            isCompleted: false,
          },
        },
      });
    }

    // No next lesson in current topic
    // Look for any incomplete lesson from other topics (user or global)
    const allCompletedIds = (await LessonCompletion.find({ userId })).map(
      (c) => c.lessonId
    );

    let firstIncompleteLesson = await Lesson.findOne({
      userId,
      isFullyGenerated: true,
      _id: { $nin: allCompletedIds },
    }).sort({ createdAt: 1 });

    if (!firstIncompleteLesson) {
      // Check global default lessons
      firstIncompleteLesson = await Lesson.findOne({
        userId: null,
        isDefault: true,
        isFullyGenerated: true,
        _id: { $nin: allCompletedIds },
      }).sort({ createdAt: 1 });
    }

    if (firstIncompleteLesson) {
      // Found an incomplete lesson in another topic
      return res.status(200).json({
        success: true,
        data: {
          nextLesson: {
            lessonId: firstIncompleteLesson._id,
            title: firstIncompleteLesson.skillName,
            topic: firstIncompleteLesson.topic,
            category: firstIncompleteLesson.category,
            difficulty: firstIncompleteLesson.difficulty,
            progress: 0,
            isFirst: false,
            isCompleted: false,
            message: `Great job completing ${lastLesson.topic}! Ready to start a new topic?`,
          },
        },
      });
    }

    // All lessons completed! Show message to generate more
    return res.status(200).json({
      success: true,
      data: {
        nextLesson: {
          lessonId: lastLesson._id,
          title: lastLesson.skillName,
          topic: lastLesson.topic,
          category: lastLesson.category,
          difficulty: lastLesson.difficulty,
          progress: 100,
          isCompleted: true,
          message:
            '🎉 Amazing! You completed all lessons! Generate more to continue learning.',
        },
      },
    });
  } catch (error) {
    console.error('Error getting continue journey:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get continue journey',
      error: error.message,
    });
  }
};

/**
 * Generate a test for a specific lesson topic
 * If test exists and forceNew=false, return existing test
 * If test exists and forceNew=true, generate new test
 * POST /api/lessons/:lessonId/generate-test
 */
const generateLessonTest = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { questionCount = 20, forceNew = false } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found',
      });
    }

    // Get user to check generation limits
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user has an existing active test for this lesson
    let existingTest = await Test.findOne({
      userId,
      lessonId,
      isActive: true,
    }).sort({ createdAt: -1 });

    // If forceNew is false and test exists, return existing test
    if (!forceNew && existingTest) {
      return res.status(200).json({
        success: true,
        data: {
          testId: existingTest._id,
          testName: existingTest.testName,
          topic: existingTest.topic,
          difficulty: existingTest.difficulty,
          timeLimit: existingTest.timeLimit,
          passingScore: existingTest.passingScore,
          totalXP: existingTest.totalXP,
          questions: existingTest.questions,
          isNewTest: false,
          totalAttempts: existingTest.totalAttempts,
          bestScore: existingTest.bestScore,
        },
      });
    }

    // Check if this is a regeneration (forceNew=true or firstTestGenerated=true)
    const isRegeneration = forceNew || lesson.firstTestGenerated;

    // If regenerating test, check credits (costs 0.5 credit)
    if (isRegeneration && user.role !== 'recruiter') {
      const totalCredits =
        user.generationLimits.aiLessonsPerMonth +
        user.generationLimits.addonGenerations;
      const usedCredits = user.generationLimits.currentMonthGenerations;
      const availableCredits = totalCredits - usedCredits;

      if (availableCredits < 0.5) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient AI credits for test regeneration',
          data: {
            required: 0.5,
            available: availableCredits,
            total: totalCredits,
            used: usedCredits,
            subscriptionType: user.subscriptionType,
            upgradeMessage:
              user.subscriptionType === 'free'
                ? 'Upgrade to Pro Learner for 5 credits per month'
                : 'Purchase addon package for 3 more credits',
          },
        });
      }
    }

    // If forceNew is true and test exists, deactivate old test
    if (forceNew && existingTest) {
      existingTest.isActive = false;
      await existingTest.save();
    }

    // Generate new test using Gemini AI
    const testData = await generateTest(
      lesson.topic || lesson.skillName,
      lesson.difficulty,
      questionCount
    );

    // Save test to database
    const newTest = new Test({
      userId,
      lessonId,
      testName: testData.testName,
      topic: testData.topic,
      difficulty: testData.difficulty,
      timeLimit: testData.timeLimit,
      passingScore: testData.passingScore,
      totalXP: testData.totalXP,
      questions: testData.questions,
      attempts: [],
      totalAttempts: 0,
    });

    await newTest.save();

    // Deduct 0.5 credit if this is a regeneration (only for non-recruiters)
    let creditsUsed = 0;
    if (isRegeneration && user.role !== 'recruiter') {
      user.generationLimits.currentMonthGenerations += 0.5;
      await user.save();
      creditsUsed = 0.5;
    }

    // Mark lesson as having first test generated
    if (!lesson.firstTestGenerated) {
      lesson.firstTestGenerated = true;
      await lesson.save();
    }

    // Calculate remaining credits
    const totalCredits =
      user.generationLimits.aiLessonsPerMonth +
      user.generationLimits.addonGenerations;
    const usedCredits = user.generationLimits.currentMonthGenerations;
    const remainingCredits = totalCredits - usedCredits;

    return res.status(200).json({
      success: true,
      data: {
        testId: newTest._id,
        testName: newTest.testName,
        topic: newTest.topic,
        difficulty: newTest.difficulty,
        timeLimit: newTest.timeLimit,
        passingScore: newTest.passingScore,
        totalXP: newTest.totalXP,
        questions: newTest.questions,
        isNewTest: true,
        totalAttempts: 0,
        bestScore: null,
      },
      creditsUsed: creditsUsed,
      creditsRemaining:
        user.role === 'recruiter' ? 'unlimited' : remainingCredits,
      isFirstTest: !isRegeneration,
    });
  } catch (error) {
    console.error('Error generating test:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate test',
      error: error.message,
    });
  }
};

/**
 * Submit test attempt and calculate XP
 * First time pass: full XP (400-600)
 * Retake same test (passed before): 20 XP
 * New test (generated new questions): 100 XP if pass
 * Retake old test: 10 XP if pass
 * POST /api/lessons/tests/:testId/submit
 */
const submitTest = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers, timeTaken } = req.body;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    // Find the test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({
        success: false,
        message: 'Test not found',
      });
    }

    // Verify ownership
    if (test.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Calculate score
    let correctAnswers = 0;
    const processedAnswers = answers.map((answer, index) => {
      const question = test.questions[index];
      const isCorrect = answer === question.correctAnswer;
      if (isCorrect) correctAnswers++;

      return {
        questionId: question.id,
        selectedAnswer: answer,
        isCorrect,
      };
    });

    const totalQuestions = test.questions.length;
    const accuracy = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = accuracy >= test.passingScore;

    // Calculate XP based on attempt type
    let xpEarned = 0;
    const isFirstAttempt = test.totalAttempts === 0;
    const hasPassedBefore = test.attempts.some((attempt) => attempt.passed);

    if (passed) {
      if (isFirstAttempt) {
        // First time pass: full XP
        xpEarned = test.totalXP;
      } else if (hasPassedBefore) {
        // Retake (already passed before): 20 XP
        xpEarned = 20;
      } else {
        // First pass after failing: full XP
        xpEarned = test.totalXP;
      }
    } else {
      // Failed: no XP
      xpEarned = 0;
    }

    // Create attempt record
    const attemptNumber = test.totalAttempts + 1;
    const attempt = {
      attemptNumber,
      score: accuracy,
      correctAnswers,
      totalQuestions,
      accuracy,
      xpEarned,
      timeTaken,
      passed,
      answers: processedAnswers,
      completedAt: new Date(),
    };

    // Update test
    test.attempts.push(attempt);
    test.totalAttempts += 1;
    test.lastAttemptAt = new Date();

    if (!test.firstCompletedAt) {
      test.firstCompletedAt = new Date();
    }

    // Update best score if this is better
    if (
      !test.bestScore ||
      accuracy > test.bestScore.accuracy ||
      (accuracy === test.bestScore.accuracy &&
        xpEarned > test.bestScore.xpEarned)
    ) {
      test.bestScore = {
        accuracy,
        correctAnswers,
        totalQuestions,
        xpEarned,
        attemptNumber,
      };
    }

    await test.save();

    // Update user XP and streak if passed
    if (passed && xpEarned > 0) {
      const user = await User.findById(userId);
      if (user) {
        user.stats.xpPoints += xpEarned;

        // Log XP transaction in history
        if (!user.xpHistory) {
          user.xpHistory = [];
        }
        user.xpHistory.push({
          amount: xpEarned,
          source: 'test',
          description: `Test ${
            isFirstAttempt ? 'passed' : hasPassedBefore ? 'retaken' : 'passed'
          }`,
          timestamp: new Date(),
        });

        // Update streak
        const streakData = updateStreak(user);
        user.stats.currentStreak = streakData.currentStreak;
        user.stats.longestStreak = streakData.longestStreak;

        await user.save();
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        attempt: {
          attemptNumber,
          score: accuracy,
          correctAnswers,
          totalQuestions,
          accuracy,
          xpEarned,
          passed,
          timeTaken,
        },
        bestScore: test.bestScore,
        totalAttempts: test.totalAttempts,
        message: passed
          ? isFirstAttempt || !hasPassedBefore
            ? `Congratulations! You earned ${xpEarned} XP!`
            : `Great job! You earned ${xpEarned} XP for retaking.`
          : 'Keep trying! You can retake the test.',
      },
    });
  } catch (error) {
    console.error('Error submitting test:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit test',
      error: error.message,
    });
  }
};

/**
 * Get test status for a lesson
 * GET /api/lessons/:lessonId/test-status
 */
const getTestStatus = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user?.id || '507f1f77bcf86cd799439011';

    const test = await Test.findOne({
      userId,
      lessonId,
      isActive: true,
    }).sort({ createdAt: -1 });

    if (!test) {
      return res.status(200).json({
        success: true,
        data: {
          hasTest: false,
          testId: null,
          totalAttempts: 0,
          bestScore: null,
          hasPassed: false,
        },
      });
    }

    const hasPassed = test.attempts.some((attempt) => attempt.passed);

    return res.status(200).json({
      success: true,
      data: {
        hasTest: true,
        testId: test._id,
        totalAttempts: test.totalAttempts,
        bestScore: test.bestScore,
        hasPassed,
        lastAttemptAt: test.lastAttemptAt,
      },
    });
  } catch (error) {
    console.error('Error getting test status:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get test status',
      error: error.message,
    });
  }
};

export {
  generateLessonStructure,
  generatePlaceholderContent,
  getUserLessons,
  getLessonById,
  deleteLesson,
  getLessonStats,
  completeLesson,
  getLessonCompletionStatus,
  getUserActivity,
  getUserStats,
  getAIRecommendation,
  getContinueJourney,
  generateLessonTest,
  submitTest,
  getTestStatus,
};
