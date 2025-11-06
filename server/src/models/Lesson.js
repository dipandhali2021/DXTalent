import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: Number,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
  xpReward: {
    type: Number,
    default: 15,
  },
});

const lessonSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Not required for global default lessons
      index: true,
    },
    topic: {
      type: String,
      required: false, // Optional for backward compatibility
      index: true,
    },
    skillName: {
      type: String,
      required: true,
    },
    skillIcon: {
      type: String,
      default: '📚',
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      default: '15 min',
    },
    totalXP: {
      type: Number,
      default: 0,
    },
    questions: [questionSchema],
    isFullyGenerated: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: Boolean,
      default: false,
    },
    firstTestGenerated: {
      type: Boolean,
      default: false,
    },
    isDefault: {
      type: Boolean,
      default: false,
      index: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total XP when questions are added
lessonSchema.pre('save', function (next) {
  if (this.questions && this.questions.length > 0) {
    this.totalXP = this.questions.reduce(
      (sum, q) => sum + (q.xpReward || 15),
      0
    );
  }
  next();
});

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
