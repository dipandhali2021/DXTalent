import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password not required for Google OAuth users
      },
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'recruiter', 'admin'],
      default: 'user',
    },
    accountStatus: {
      type: String,
      enum: ['active', 'suspended', 'pending'],
      default: 'active',
    },
    // Subscription fields
    subscriptionType: {
      type: String,
      enum: ['free', 'pro', 'recruiter'],
      default: 'free',
    },
    stripeCustomerId: {
      type: String,
      sparse: true,
    },
    stripeSubscriptionId: {
      type: String,
      sparse: true,
    },
    subscriptionStatus: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'trialing', 'unpaid'],
      default: 'active',
    },
    subscriptionStartDate: {
      type: Date,
    },
    subscriptionEndDate: {
      type: Date,
    },
    // Generation limits
    generationLimits: {
      aiLessonsPerMonth: {
        type: Number,
        default: 1, // Free tier gets 1
      },
      currentMonthGenerations: {
        type: Number,
        default: 0,
      },
      lastResetDate: {
        type: Date,
        default: Date.now,
      },
      addonGenerations: {
        type: Number,
        default: 0, // Additional purchased generations
      },
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: '',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    stats: {
      skillsMastered: {
        type: Number,
        default: 0,
      },
      challengesCompleted: {
        type: Number,
        default: 0,
      },
      xpPoints: {
        type: Number,
        default: 0,
      },
      level: {
        type: Number,
        default: 1,
      },
      levelName: {
        type: String,
        default: 'Novice Explorer',
      },
      league: {
        type: String,
        enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master'],
        default: 'bronze',
      },
      xpIntoLevel: {
        type: Number,
        default: 0,
      },
      xpForNextLevel: {
        type: Number,
        default: 100,
      },
      xpProgress: {
        type: Number,
        default: 0,
      },
      currentStreak: {
        type: Number,
        default: 0,
      },
      longestStreak: {
        type: Number,
        default: 0,
      },
      lastLessonDate: {
        type: Date,
        default: null,
      },
    },
    // Daily activity tracking: { "2025-11-05": 3, "2025-11-04": 5 } = lessons completed per day
    dailyActivity: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    // Challenges tracking
    challenges: {
      dailyChallenges: [
        {
          type: String,
        },
      ],
      completedChallenges: [
        {
          type: String,
        },
      ],
      lastReset: {
        type: Date,
        default: null,
      },
    },
    // Badges tracking
    badges: [
      {
        badgeId: {
          type: String,
          required: true,
        },
        earnedAt: {
          type: Date,
          default: Date.now,
        },
        claimed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    // Badge statistics for tracking progress
    badgeStats: {
      lessonsCompletedTotal: {
        type: Number,
        default: 0,
      },
      lessonsCompletedToday: {
        type: Number,
        default: 0,
      },
      lastLessonCompletionDate: {
        type: Date,
        default: null,
      },
      perfectTestsCount: {
        type: Number,
        default: 0,
      },
      categoriesExplored: {
        type: [String],
        default: [],
      },
      streakRestored: {
        type: Boolean,
        default: false,
      },
      highestLeaderboardRank: {
        type: Number,
        default: null,
      },
    },
    // XP History for tracking all XP transactions
    xpHistory: [
      {
        amount: {
          type: Number,
          required: true,
        },
        source: {
          type: String,
          enum: ['lesson', 'test', 'challenge', 'badge', 'streak', 'other'],
          required: true,
        },
        description: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Increment login attempts
userSchema.methods.incLoginAttempts = async function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 10 * 60 * 1000; // 10 minutes

  // Lock the account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return await this.updateOne(updates);
};

// Reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
  return await this.updateOne({
    $set: { loginAttempts: 0 },
    $unset: { lockUntil: 1 },
  });
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.loginAttempts;
  delete user.lockUntil;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
