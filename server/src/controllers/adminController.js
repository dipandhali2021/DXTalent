import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import LessonCompletion from '../models/LessonCompletion.js';
import Activity from '../models/Activity.js';

// Get dashboard overview statistics
export const getDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Total Users
        const totalUsers = await User.countDocuments();

        // Active Users Today (users who logged in or completed a lesson today)
        const activeUsersToday = await Activity.distinct('userId', {
            timestamp: { $gte: today },
            activityType: { $in: ['login', 'lesson_complete'] },
        });

        // Total Lessons
        const totalLessons = await Lesson.countDocuments({ isFullyGenerated: true });

        // Total Completions (for revenue calculation - assuming $1 per completion as mock)
        const totalCompletions = await LessonCompletion.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$completionCount' },
                },
            },
        ]);
        const totalRevenue = totalCompletions.length > 0 ? totalCompletions[0].total * 1 : 0;

        // User Retention (users active this month who were also active last month)
        const usersThisMonth = await Activity.distinct('userId', {
            timestamp: { $gte: thisMonth },
        });
        const usersLastMonth = await Activity.distinct('userId', {
            timestamp: { $gte: lastMonth, $lt: thisMonth },
        });
        const retainedUsers = usersThisMonth.filter((id) =>
            usersLastMonth.some((lastId) => lastId.equals(id))
        );
        const retention = usersLastMonth.length > 0
            ? Math.round((retainedUsers.length / usersLastMonth.length) * 100)
            : 0;

        // User Satisfaction (average completion accuracy)
        const satisfactionData = await LessonCompletion.aggregate([
            {
                $group: {
                    _id: null,
                    avgAccuracy: { $avg: '$bestScore.accuracy' },
                },
            },
        ]);
        const satisfaction = satisfactionData.length > 0
            ? Math.round(satisfactionData[0].avgAccuracy)
            : 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                activeUsers: activeUsersToday.length,
                totalLessons,
                totalRevenue: Math.round(totalRevenue),
                retention,
                satisfaction,
            },
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message,
        });
    }
};

// Get user growth data (monthly)
export const getUserGrowth = async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    users: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [
                                    '',
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                ],
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id.month'],
                            },
                        },
                    },
                    users: 1,
                },
            },
        ]);

        // Calculate cumulative users
        let cumulative = 0;
        const cumulativeGrowth = userGrowth.map((item) => {
            cumulative += item.users;
            return {
                month: item.month,
                users: cumulative,
            };
        });

        res.json({
            success: true,
            data: cumulativeGrowth,
        });
    } catch (error) {
        console.error('Error fetching user growth:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user growth data',
            error: error.message,
        });
    }
};

// Get revenue data (monthly) - based on lesson completions
export const getRevenueData = async (req, res) => {
    try {
        const { months = 6 } = req.query;
        const monthsAgo = new Date();
        monthsAgo.setMonth(monthsAgo.getMonth() - parseInt(months));

        const revenueData = await LessonCompletion.aggregate([
            {
                $match: {
                    createdAt: { $gte: monthsAgo },
                },
            },
            {
                $unwind: '$completions',
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$completions.completedAt' },
                        month: { $month: '$completions.completedAt' },
                    },
                    completions: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $let: {
                            vars: {
                                monthsInString: [
                                    '',
                                    'Jan',
                                    'Feb',
                                    'Mar',
                                    'Apr',
                                    'May',
                                    'Jun',
                                    'Jul',
                                    'Aug',
                                    'Sep',
                                    'Oct',
                                    'Nov',
                                    'Dec',
                                ],
                            },
                            in: {
                                $arrayElemAt: ['$$monthsInString', '$_id.month'],
                            },
                        },
                    },
                    revenue: { $multiply: ['$completions', 10] }, // $10 per completion (mock pricing)
                },
            },
        ]);

        res.json({
            success: true,
            data: revenueData,
        });
    } catch (error) {
        console.error('Error fetching revenue data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue data',
            error: error.message,
        });
    }
};

// Get recent users
export const getRecentUsers = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('username email role createdAt profilePicture')
            .lean();

        const formattedUsers = recentUsers.map((user) => {
            const timeDiff = Date.now() - new Date(user.createdAt).getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const days = Math.floor(hours / 24);

            let timeAgo;
            if (days > 0) {
                timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
            } else if (hours > 0) {
                timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
            } else {
                timeAgo = 'Just now';
            }

            return {
                id: user._id,
                name: user.username,
                email: user.email,
                role: user.role === 'user' ? 'Learner' : user.role.charAt(0).toUpperCase() + user.role.slice(1),
                time: timeAgo,
                profilePicture: user.profilePicture,
            };
        });

        res.json({
            success: true,
            data: formattedUsers,
        });
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent users',
            error: error.message,
        });
    }
};

// Get top performing lessons
export const getTopLessons = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topLessons = await LessonCompletion.aggregate([
            {
                $group: {
                    _id: '$lessonId',
                    completions: { $sum: '$completionCount' },
                    avgAccuracy: { $avg: '$bestScore.accuracy' },
                },
            },
            {
                $sort: { completions: -1 },
            },
            {
                $limit: parseInt(limit),
            },
            {
                $lookup: {
                    from: 'lessons',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'lesson',
                },
            },
            {
                $unwind: '$lesson',
            },
            {
                $project: {
                    _id: 0,
                    id: '$_id',
                    title: '$lesson.skillName',
                    category: '$lesson.category',
                    difficulty: '$lesson.difficulty',
                    completions: 1,
                    avgRating: {
                        $round: [{ $divide: ['$avgAccuracy', 20] }, 1], // Convert accuracy to 5-star rating
                    },
                },
            },
        ]);

        res.json({
            success: true,
            data: topLessons,
        });
    } catch (error) {
        console.error('Error fetching top lessons:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top lessons',
            error: error.message,
        });
    }
};

// Get all users with pagination and filters
export const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            role,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
        } = req.query;

        const query = {};

        // Filter by role
        if (role && role !== 'all') {
            query.role = role;
        }

        // Search by username or email
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

        const [users, total] = await Promise.all([
            User.find(query)
                .sort(sortOptions)
                .skip(skip)
                .limit(parseInt(limit))
                .select('-password -emailVerificationToken -passwordResetToken')
                .lean(),
            User.countDocuments(query),
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                    totalUsers: total,
                    limit: parseInt(limit),
                },
            },
        });
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message,
        });
    }
};

// Update user role or status
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role, isEmailVerified } = req.body;

        const updateData = {};
        if (role) updateData.role = role;
        if (typeof isEmailVerified !== 'undefined') updateData.isEmailVerified = isEmailVerified;

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.json({
            success: true,
            message: 'User updated successfully',
            data: { user },
        });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error.message,
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Don't allow deleting yourself
        if (userId === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account',
            });
        }

        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Clean up user's data
        await Promise.all([
            LessonCompletion.deleteMany({ userId }),
            Lesson.deleteMany({ userId, isDefault: false }),
            Activity.deleteMany({ userId }),
        ]);

        res.json({
            success: true,
            message: 'User and associated data deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error.message,
        });
    }
};

// Get platform analytics
export const getAnalytics = async (req, res) => {
    try {
        const now = new Date();
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // User growth trends
        const newUsersLast7Days = await User.countDocuments({
            createdAt: { $gte: last7Days },
        });
        const newUsersLast30Days = await User.countDocuments({
            createdAt: { $gte: last30Days },
        });

        // Lesson completion trends
        const completionsLast7Days = await LessonCompletion.countDocuments({
            createdAt: { $gte: last7Days },
        });
        const completionsLast30Days = await LessonCompletion.countDocuments({
            createdAt: { $gte: last30Days },
        });

        // Popular categories
        const popularCategories = await Lesson.aggregate([
            {
                $match: { isFullyGenerated: true },
            },
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

        // User distribution by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // League distribution
        const usersByLeague = await User.aggregate([
            {
                $group: {
                    _id: '$stats.league',
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
        ]);

        res.json({
            success: true,
            data: {
                userGrowth: {
                    last7Days: newUsersLast7Days,
                    last30Days: newUsersLast30Days,
                },
                completions: {
                    last7Days: completionsLast7Days,
                    last30Days: completionsLast30Days,
                },
                popularCategories,
                usersByRole,
                usersByLeague,
            },
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics',
            error: error.message,
        });
    }
};

// Track user activity (helper function to be called from other controllers)
export const trackActivity = async (userId, activityType, metadata = {}) => {
    try {
        await Activity.create({
            userId,
            activityType,
            metadata,
            timestamp: new Date(),
        });
    } catch (error) {
        console.error('Error tracking activity:', error);
        // Don't throw error - activity tracking shouldn't break main functionality
    }
};