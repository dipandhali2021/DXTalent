import User from '../models/User.js';
import Lesson from '../models/Lesson.js';
import LessonCompletion from '../models/LessonCompletion.js';
import Payment from '../models/Payment.js';
import mongoose from 'mongoose';

/**
 * Get comprehensive admin dashboard statistics
 */
export const getDashboardStats = async (req, res) => {
  try {
    // Total Users
    const totalUsers = await User.countDocuments();

    // Active Users (logged in within last 24 hours)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: oneDayAgo },
    });

    // Total Lessons
    const totalLessons = await Lesson.countDocuments();

    // Calculate Revenue from Payment model (actual payments tracked)
    // Keep the raw numeric revenue on the server and let the frontend
    // handle display formatting to avoid double-formatting / NaN issues.
    const revenueData = await Payment.calculateTotalRevenue();
    const netRevenue = Number(revenueData?.netRevenue) || 0;
    const totalRevenue = netRevenue; // numeric dollars

    // Retention Rate (users who completed lessons in last 30 days vs total users)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeLearnersCount = await LessonCompletion.distinct('userId', {
      lastCompletionDate: { $gte: thirtyDaysAgo },
    });
    const retention =
      totalUsers > 0
        ? Math.round((activeLearnersCount.length / totalUsers) * 100)
        : 0;

    // Satisfaction Rate (based on lesson completions with high scores)
    const completionStats = await LessonCompletion.aggregate([
      {
        $group: {
          _id: null,
          totalCompletions: { $sum: 1 },
          highScoreCompletions: {
            $sum: {
              $cond: [{ $gte: ['$bestScore.accuracy', 80] }, 1, 0],
            },
          },
        },
      },
    ]);

    const satisfaction =
      completionStats.length > 0 && completionStats[0].totalCompletions > 0
        ? Math.round(
            (completionStats[0].highScoreCompletions /
              completionStats[0].totalCompletions) *
              100
          )
        : 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalLessons,
        totalRevenue,
        retention,
        satisfaction,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message,
    });
  }
};

/**
 * Get user growth data over time
 */
export const getUserGrowth = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const monthsNum = parseInt(months);

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsNum);

    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Format the data
    const monthNames = [
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
    ];

    let cumulativeUsers = 0;
    const formattedGrowth = [];

    // Get users before the start date
    const usersBeforeStart = await User.countDocuments({
      createdAt: { $lt: startDate },
    });
    cumulativeUsers = usersBeforeStart;

    // Generate data for each month
    for (let i = 0; i < monthsNum; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - (monthsNum - 1 - i));

      const matchingMonth = userGrowth.find(
        (item) =>
          item._id.year === date.getFullYear() &&
          item._id.month === date.getMonth() + 1
      );

      if (matchingMonth) {
        cumulativeUsers += matchingMonth.count;
      }

      formattedGrowth.push({
        month: monthNames[date.getMonth()],
        users: cumulativeUsers,
        newUsers: matchingMonth ? matchingMonth.count : 0,
      });
    }

    res.json({
      success: true,
      userGrowth: formattedGrowth,
    });
  } catch (error) {
    console.error('Error fetching user growth:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user growth data',
      error: error.message,
    });
  }
};

/**
 * Get revenue data over time
 */
export const getRevenueData = async (req, res) => {
  try {
    const { months = 6 } = req.query;
    const monthsNum = parseInt(months);

    // Use Payment model to get accurate revenue data
    const revenueData = await Payment.getRevenueByPeriod(monthsNum);

    res.json({
      success: true,
      revenueData,
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue data',
      error: error.message,
    });
  }
};

/**
 * Get recent users
 */
export const getRecentUsers = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const recentUsers = await User.find()
      .select('username email role subscriptionType createdAt')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

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
        time: timeAgo,
        role: user.role === 'recruiter' ? 'Recruiter' : 'Learner',
        subscriptionType: user.subscriptionType,
      };
    });

    res.json({
      success: true,
      recentUsers: formattedUsers,
    });
  } catch (error) {
    console.error('Error fetching recent users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent users',
      error: error.message,
    });
  }
};

/**
 * Get top performing lessons
 */
export const getTopLessons = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const topLessons = await LessonCompletion.aggregate([
      {
        $group: {
          _id: '$lessonId',
          completions: { $sum: '$completionCount' },
          uniqueUsers: { $addToSet: '$userId' },
          avgAccuracy: { $avg: '$bestScore.accuracy' },
        },
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
          lessonId: '$_id',
          title: '$lesson.skillName',
          category: '$lesson.category',
          difficulty: '$lesson.difficulty',
          completions: 1,
          uniqueUsers: { $size: '$uniqueUsers' },
          avgRating: {
            $divide: [{ $round: [{ $multiply: ['$avgAccuracy', 5] }, 1] }, 100],
          },
        },
      },
      {
        $sort: { completions: -1 },
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    res.json({
      success: true,
      topLessons,
    });
  } catch (error) {
    console.error('Error fetching top lessons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching top lessons',
      error: error.message,
    });
  }
};

/**
 * Get all users with pagination and filters
 */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      role,
      status,
      subscriptionType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    const query = {};

    // Apply filters
    if (role) query.role = role;
    if (status) query.accountStatus = status;
    if (subscriptionType) query.subscriptionType = subscriptionType;
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -passwordResetToken -emailVerificationToken')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    // Format users for frontend
    const formattedUsers = users.map((user) => {
      const timeDiff = user.lastLogin
        ? Date.now() - new Date(user.lastLogin).getTime()
        : null;
      let lastActive = 'Never';

      if (timeDiff) {
        const minutes = Math.floor(timeDiff / (1000 * 60));
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);

        if (minutes < 60) {
          lastActive = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
        } else if (hours < 24) {
          lastActive = `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        } else if (days < 7) {
          lastActive = `${days} day${days !== 1 ? 's' : ''} ago`;
        } else {
          lastActive = `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
        }
      }

      return {
        id: user._id.toString(),
        name: user.username,
        email: user.email,
        role: user.role,
        status: user.accountStatus || 'active',
        joinedDate: user.createdAt.toISOString().split('T')[0],
        lastActive,
        xp: user.stats?.xpPoints || 0,
        avatar:
          user.profilePicture ||
          `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
        subscriptionType: user.subscriptionType,
      };
    });

    res.json({
      success: true,
      users: formattedUsers,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * Update user details (admin only)
 */
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Prevent updating sensitive fields directly
    delete updates.password;
    delete updates.passwordResetToken;
    delete updates.emailVerificationToken;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
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
      user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['user', 'recruiter', 'admin'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: user, recruiter, admin',
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { role } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role',
      error: error.message,
    });
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Also delete user's lesson completions
    await LessonCompletion.deleteMany({ userId });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

/**
 * Suspend user account (admin only)
 */
export const suspendUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: 'suspended' } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User suspended successfully',
      user,
    });
  } catch (error) {
    console.error('Error suspending user:', error);
    res.status(500).json({
      success: false,
      message: 'Error suspending user',
      error: error.message,
    });
  }
};

/**
 * Activate user account (admin only)
 */
export const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { accountStatus: 'active' } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      message: 'User activated successfully',
      user,
    });
  } catch (error) {
    console.error('Error activating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error activating user',
      error: error.message,
    });
  }
};

/**
 * Get platform analytics
 */
export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // User registration trends
    const userTrends = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Lesson completion trends
    const completionTrends = await LessonCompletion.aggregate([
      { $match: { lastCompletionDate: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$lastCompletionDate',
            },
          },
          count: { $sum: '$completionCount' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Category popularity
    const categoryStats = await Lesson.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Subscription distribution
    const subscriptionStats = await User.aggregate([
      {
        $group: {
          _id: '$subscriptionType',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      analytics: {
        userTrends,
        completionTrends,
        categoryStats,
        subscriptionStats,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};

/**
 * Get user details with full stats
 */
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Get user's lesson completions
    const completions = await LessonCompletion.find({ userId })
      .populate('lessonId', 'skillName category difficulty totalXP')
      .sort({ lastCompletionDate: -1 });

    // Calculate stats
    const totalLessonsCompleted = completions.length;
    const totalXP = user.totalXP || 0;
    const currentStreak = user.streakDays || 0;
    const longestStreak = user.longestStreak || 0;

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        stats: {
          totalLessonsCompleted,
          totalXP,
          currentStreak,
          longestStreak,
        },
        recentCompletions: completions.slice(0, 10),
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user details',
      error: error.message,
    });
  }
};

/**
 * Get all payments with filtering and pagination
 */
export const getAllPayments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 5,
      status,
      paymentType,
      plan,
      search,
      startDate,
      endDate,
      userId,
    } = req.query;

    // Build query
    const query = {};

    if (status) query.status = status;
    if (paymentType) query.paymentType = paymentType;
    if (plan) query.plan = plan;
    if (userId) query.user = userId;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // First, get all payments with populated user data
    let paymentsQuery = Payment.find(query)
      .populate('user', 'username email role')
      .sort({ createdAt: -1 });

    // If search is provided, we need to filter after population
    let payments;
    if (search) {
      // Get all matching payments first
      const allPayments = await paymentsQuery;

      // Filter by username or email
      const searchLower = search.toLowerCase();
      payments = allPayments.filter(
        (payment) =>
          payment.user &&
          (payment.user.username?.toLowerCase().includes(searchLower) ||
            payment.user.email?.toLowerCase().includes(searchLower))
      );

      // Apply pagination to filtered results
      const total = payments.length;
      payments = payments.slice(skip, skip + parseInt(limit));

      // Calculate stats for filtered results
      const filteredIds = payments.map((p) => p._id);
      const revenueStats = await Payment.aggregate([
        { $match: { _id: { $in: filteredIds } } },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'completed'] },
                  {
                    $cond: [
                      { $eq: ['$paymentType', 'refund'] },
                      0, // Don't count refund transactions as revenue
                      '$amount',
                    ],
                  },
                  0,
                ],
              },
            },
            // Sum refundAmount from refunded payments + amount from refund-type payments
            totalRefunds: {
              $sum: {
                $cond: [
                  { $eq: ['$paymentType', 'refund'] },
                  '$amount', // Refund transaction amount
                  '$refundAmount', // Refunded amount from original payment
                ],
              },
            },
            count: { $sum: 1 },
          },
        },
      ]);

      const stats =
        revenueStats.length > 0
          ? revenueStats[0]
          : {
              totalRevenue: 0,
              totalRefunds: 0,
              count: 0,
            };

      return res.json({
        success: true,
        payments,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalPayments: total,
          limit: parseInt(limit),
        },
        stats: {
          totalRevenue: stats.totalRevenue,
          totalRefunds: stats.totalRefunds,
          netRevenue: stats.totalRevenue - stats.totalRefunds,
          transactionCount: stats.count,
        },
      });
    }

    // No search - use normal pagination
    const [paymentsData, total] = await Promise.all([
      paymentsQuery.skip(skip).limit(parseInt(limit)),
      Payment.countDocuments(query),
    ]);

    payments = paymentsData;

    // Calculate total revenue from filtered results
    // Count 'completed' payments for revenue, handle both refund types:
    // 1. Payments with status='refunded' (original payment that was refunded)
    // 2. Payments with paymentType='refund' (refund transaction itself)
    const revenueStats = await Payment.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                {
                  $cond: [
                    { $eq: ['$paymentType', 'refund'] },
                    0, // Don't count refund transactions as revenue
                    '$amount',
                  ],
                },
                0,
              ],
            },
          },
          // Sum refundAmount from refunded payments + amount from refund-type payments
          totalRefunds: {
            $sum: {
              $cond: [
                { $eq: ['$paymentType', 'refund'] },
                '$amount', // Refund transaction amount
                '$refundAmount', // Refunded amount from original payment
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const stats =
      revenueStats.length > 0
        ? revenueStats[0]
        : {
            totalRevenue: 0,
            totalRefunds: 0,
            count: 0,
          };

    res.json({
      success: true,
      payments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPayments: total,
        limit: parseInt(limit),
      },
      stats: {
        totalRevenue: stats.totalRevenue,
        totalRefunds: stats.totalRefunds,
        netRevenue: stats.totalRevenue - stats.totalRefunds,
        transactionCount: stats.count,
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payments',
      error: error.message,
    });
  }
};

/**
 * Get payment statistics
 */
export const getPaymentStats = async (req, res) => {
  try {
    const { months = 6 } = req.query;

    // Get total revenue
    const totalRevenueData = await Payment.calculateTotalRevenue();

    // Get payment statistics by type
    const paymentTypeStats = await Payment.getPaymentStats();

    // Get recent payments
    const recentPayments = await Payment.find({ status: 'completed' })
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get monthly revenue trend
    const monthlyTrend = await Payment.getRevenueByPeriod(parseInt(months));

    // Get payment method distribution
    const paymentMethodStats = await Payment.aggregate([
      {
        $match: { status: { $in: ['completed', 'refunded'] } },
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0],
            },
          },
          refundedAmount: { $sum: '$refundAmount' },
        },
      },
    ]);

    // Get average transaction value
    const avgTransaction = await Payment.aggregate([
      {
        $match: { status: 'completed' },
      },
      {
        $group: {
          _id: null,
          avgAmount: { $avg: '$amount' },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        totalRevenue: totalRevenueData.totalRevenue,
        totalRefunds: totalRevenueData.totalRefunds,
        netRevenue: totalRevenueData.netRevenue,
        paymentsByType: paymentTypeStats,
        paymentMethods: paymentMethodStats,
        averageTransaction:
          avgTransaction.length > 0 ? avgTransaction[0].avgAmount : 0,
        monthlyTrend,
        recentPayments,
      },
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics',
      error: error.message,
    });
  }
};

/**
 * Get payment details by ID
 */
export const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId).populate(
      'user',
      'username email role subscriptionType'
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details',
      error: error.message,
    });
  }
};

/**
 * Process refund
 */
export const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { refundAmount, refundReason } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({
        success: false,
        message: 'Payment already refunded',
      });
    }

    if (refundAmount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount',
      });
    }

    // Update payment
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = refundReason;
    payment.refundedAt = new Date();

    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment,
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund',
      error: error.message,
    });
  }
};
