import Lesson from '../models/Lesson.js';
import {
  generateLesson,
  generateLessonOutlines,
  categorizeTopic,
} from '../utils/gemini.js';
import { computeLevelFromXP, calculateLessonXP } from '../utils/level.js';

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

    res.status(201).json({
      success: true,
      message: 'Lesson structure generated successfully',
      data: {
        topic,
        metadata,
        fullyGenerated: generatedLessons,
        placeholders: placeholderLessons,
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

    res.status(200).json({
      success: true,
      message: 'Lesson content generated successfully',
      data: lesson,
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

    const filter = { userId };

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (isFullyGenerated !== undefined) {
      filter.isFullyGenerated = isFullyGenerated === 'true';
    }

    const lessons = await Lesson.find(filter)
      .sort({ createdAt: -1 })
      .select('-questions'); // Exclude questions for list view

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

    const lesson = await Lesson.findOne({ _id: lessonId, userId });

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

    const totalLessons = await Lesson.countDocuments({ userId });
    const fullyGenerated = await Lesson.countDocuments({
      userId,
      isFullyGenerated: true,
    });
    const placeholders = await Lesson.countDocuments({
      userId,
      placeholder: true,
    });

    const categoryBreakdown = await Lesson.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const difficultyBreakdown = await Lesson.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalLessons,
        fullyGenerated,
        placeholders,
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

    // Verify lesson exists and belongs to user
    const lesson = await Lesson.findOne({ _id: lessonId, userId });
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
      // First time completing this lesson - award difficulty-based XP
      isFirstCompletion = true;
      actualXpEarned = calculateLessonXP(lesson.difficulty, true);

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

    // Increment challenges completed only on first completion
    if (isFirstCompletion) {
      user.stats.challengesCompleted += 1;
    }

    // Calculate new level based on milestone system
    const levelInfo = computeLevelFromXP(user.stats.xpPoints);
    user.stats.level = levelInfo.level;
    user.stats.levelName = levelInfo.levelName;
    user.stats.xpIntoLevel = levelInfo.xpIntoLevel;
    user.stats.xpForNextLevel = levelInfo.xpForNextLevel;
    user.stats.xpProgress = levelInfo.xpProgress;

    await user.save();

    // Check if user leveled up
    const leveledUp = levelInfo.level > previousLevel;

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
        correctAnswers,
        totalQuestions,
        accuracy,
        isFirstCompletion,
        completionCount: lessonCompletion.completionCount,
        bestScore: lessonCompletion.bestScore,
        leveledUp,
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

export {
  generateLessonStructure,
  generatePlaceholderContent,
  getUserLessons,
  getLessonById,
  deleteLesson,
  getLessonStats,
  completeLesson,
  getLessonCompletionStatus,
};
