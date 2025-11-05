import mongoose from 'mongoose';

const lessonCompletionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
      index: true,
    },
    completionCount: {
      type: Number,
      default: 1,
    },
    firstCompletionDate: {
      type: Date,
      default: Date.now,
    },
    lastCompletionDate: {
      type: Date,
      default: Date.now,
    },
    bestScore: {
      correctAnswers: {
        type: Number,
        default: 0,
      },
      totalQuestions: {
        type: Number,
        default: 0,
      },
      accuracy: {
        type: Number,
        default: 0,
      },
    },
    totalXPEarned: {
      type: Number,
      default: 0,
    },
    completions: [
      {
        completedAt: {
          type: Date,
          default: Date.now,
        },
        correctAnswers: Number,
        totalQuestions: Number,
        accuracy: Number,
        xpEarned: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique user-lesson pairs
lessonCompletionSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

const LessonCompletion = mongoose.model(
  'LessonCompletion',
  lessonCompletionSchema
);

export default LessonCompletion;
