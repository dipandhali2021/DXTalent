import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        activityType: {
            type: String,
            enum: ['login', 'lesson_start', 'lesson_complete', 'test_complete', 'logout'],
            required: true,
        },
        metadata: {
            lessonId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
            },
            xpEarned: Number,
            score: Number,
            duration: Number,
        },
        ipAddress: String,
        userAgent: String,
        timestamp: {
            type: Date,
            default: Date.now,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound indexes for better query performance
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ activityType: 1, timestamp: -1 });

// TTL index to automatically delete old activities after 90 days
activitySchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;