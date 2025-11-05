import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    paymentType: {
      type: String,
      enum: ['subscription', 'role_upgrade', 'renewal', 'refund'],
      required: true,
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'recruiter', 'enterprise'],
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'learner', 'recruiter', 'admin'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      default: 'stripe',
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    description: {
      type: String,
    },
    metadata: {
      type: Object,
      default: {},
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentType: 1 });
paymentSchema.index({ createdAt: -1 });

// Virtual for net amount (after refunds)
paymentSchema.virtual('netAmount').get(function () {
  return this.amount - this.refundAmount;
});

// Static method to calculate total revenue
paymentSchema.statics.calculateTotalRevenue = async function () {
  const result = await this.aggregate([
    {
      $match: {
        status: { $in: ['completed', 'refunded'] },
      },
    },
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
      },
    },
  ]);

  if (result.length === 0) {
    return { totalRevenue: 0, totalRefunds: 0, netRevenue: 0 };
  }

  const { totalRevenue, totalRefunds } = result[0];
  return {
    totalRevenue,
    totalRefunds,
    netRevenue: totalRevenue - totalRefunds,
  };
};

// Static method to get revenue by period
paymentSchema.statics.getRevenueByPeriod = async function (months = 6) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const result = await this.aggregate([
    {
      $match: {
        status: { $in: ['completed', 'refunded'] },
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              {
                $cond: [{ $eq: ['$paymentType', 'refund'] }, 0, '$amount'],
              },
              0,
            ],
          },
        },
        refunds: {
          $sum: {
            $cond: [
              { $eq: ['$paymentType', 'refund'] },
              '$amount',
              '$refundAmount',
            ],
          },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ]);

  return result.map((item) => ({
    month: new Date(item._id.year, item._id.month - 1).toLocaleDateString(
      'en-US',
      { month: 'short' }
    ),
    revenue: item.revenue - item.refunds,
    grossRevenue: item.revenue,
    refunds: item.refunds,
    transactionCount: item.count,
  }));
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function () {
  const stats = await this.aggregate([
    {
      $match: {
        status: { $in: ['completed', 'refunded'] },
      },
    },
    {
      $group: {
        _id: '$paymentType',
        totalAmount: {
          $sum: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              {
                $cond: [{ $eq: ['$paymentType', 'refund'] }, 0, '$amount'],
              },
              0,
            ],
          },
        },
        count: { $sum: 1 },
        avgAmount: {
          $avg: {
            $cond: [
              { $eq: ['$status', 'completed'] },
              {
                $cond: [{ $eq: ['$paymentType', 'refund'] }, 0, '$amount'],
              },
              0,
            ],
          },
        },
        refundedAmount: {
          $sum: {
            $cond: [
              { $eq: ['$paymentType', 'refund'] },
              '$amount',
              '$refundAmount',
            ],
          },
        },
      },
    },
  ]);

  return stats;
};

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
