import mongoose from 'mongoose';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/dxtalent';

const seedPayments = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all users
    const users = await User.find();

    if (users.length === 0) {
      console.log('No users found. Please seed users first.');
      process.exit(1);
    }

    // Clear existing payments
    await Payment.deleteMany({});
    console.log('Cleared existing payments');

    const payments = [];
    const plans = ['basic', 'pro', 'enterprise'];
    const paymentTypes = ['subscription', 'role_upgrade', 'renewal'];
    const statuses = [
      'completed',
      'completed',
      'completed',
      'completed',
      'pending',
      'failed',
    ];

    // Generate payments for the last 6 months
    const months = 6;
    const now = new Date();

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const numPayments = Math.floor(Math.random() * 5) + 1; // 1-5 payments per user

      for (let j = 0; j < numPayments; j++) {
        // Random date in the last 6 months
        const monthsAgo = Math.floor(Math.random() * months);
        const daysAgo = Math.floor(Math.random() * 30);
        const paymentDate = new Date(now);
        paymentDate.setMonth(paymentDate.getMonth() - monthsAgo);
        paymentDate.setDate(paymentDate.getDate() - daysAgo);

        const plan =
          user.subscriptionType === 'recruiter'
            ? 'recruiter'
            : user.subscriptionType === 'pro'
            ? 'pro'
            : 'basic';

        const amount = plan === 'recruiter' ? 50 : plan === 'pro' ? 20 : 0;

        // Skip free plans
        if (amount === 0) continue;

        const paymentType =
          j === 0
            ? 'subscription'
            : j === 1 && user.role === 'recruiter'
            ? 'role_upgrade'
            : 'renewal';

        const status = statuses[Math.floor(Math.random() * statuses.length)];

        payments.push({
          user: user._id,
          amount: amount,
          currency: 'USD',
          paymentType: paymentType,
          plan: plan,
          role: user.role,
          status: status,
          paymentMethod: 'stripe',
          transactionId: `txn_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          description: `${
            paymentType === 'role_upgrade' ? 'Upgrade to' : 'Subscription:'
          } ${plan}`,
          metadata: {
            generatedBySeed: true,
          },
          createdAt: paymentDate,
          updatedAt: paymentDate,
        });
      }
    }

    // Add some refunded payments
    const refundCount = Math.floor(payments.length * 0.05); // 5% refunds
    for (let i = 0; i < refundCount; i++) {
      const randomIndex = Math.floor(Math.random() * payments.length);
      if (payments[randomIndex].status === 'completed') {
        payments[randomIndex].status = 'refunded';
        payments[randomIndex].refundAmount = payments[randomIndex].amount;
        payments[randomIndex].refundReason = 'Customer request';
        payments[randomIndex].refundedAt = new Date();
      }
    }

    // Insert payments
    await Payment.insertMany(payments);
    console.log(`✅ Created ${payments.length} payment records`);

    // Calculate and display statistics
    const totalRevenue = await Payment.calculateTotalRevenue();
    console.log('\n📊 Payment Statistics:');
    console.log(`Total Revenue: $${totalRevenue.totalRevenue}`);
    console.log(`Total Refunds: $${totalRevenue.totalRefunds}`);
    console.log(`Net Revenue: $${totalRevenue.netRevenue}`);

    const paymentStats = await Payment.getPaymentStats();
    console.log('\n💳 Payments by Type:');
    paymentStats.forEach((stat) => {
      console.log(
        `${stat._id}: ${stat.count} transactions, $${stat.totalAmount.toFixed(
          2
        )}`
      );
    });

    console.log('\n✅ Payment seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding payments:', error);
    process.exit(1);
  }
};

seedPayments();
