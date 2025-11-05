import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
  attemptNumber: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  correctAnswers: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
  xpEarned: {
    type: Number,
    required: true,
  },
  timeTaken: {
    type: Number, // in seconds
  },
  passed: {
    type: Boolean,
    required: true,
  },
  answers: [
    {
      questionId: Number,
      selectedAnswer: Number,
      isCorrect: Boolean,
    },
  ],
  completedAt: {
    type: Date,
    default: Date.now,
  },
});

const testSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      required: true,
    },
    timeLimit: {
      type: Number, // in seconds
      required: true,
    },
    passingScore: {
      type: Number, // percentage
      required: true,
    },
    totalXP: {
      type: Number, // XP for passing first time
      required: true,
    },
    questions: [
      {
        id: Number,
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
        points: Number,
      },
    ],
    attempts: [testAttemptSchema],
    bestScore: {
      accuracy: Number,
      correctAnswers: Number,
      totalQuestions: Number,
      xpEarned: Number,
      attemptNumber: Number,
    },
    totalAttempts: {
      type: Number,
      default: 0,
    },
    firstCompletedAt: {
      type: Date,
    },
    lastAttemptAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
testSchema.index({ userId: 1, lessonId: 1 });
testSchema.index({ userId: 1, isActive: 1 });

const Test = mongoose.model('Test', testSchema);

export default Test;
