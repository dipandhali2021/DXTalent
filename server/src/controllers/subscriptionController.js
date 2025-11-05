import Stripe from 'stripe';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Subscription tier configurations
const SUBSCRIPTION_TIERS = {
  free: {
    name: 'Learner',
    price: 0,
    aiGenerations: 1,
    role: 'user',
  },
  pro: {
    name: 'Pro Learner',
    price: 20,
    aiGenerations: 5,
    role: 'user',
    stripePriceId: process.env.STRIPE_PRICE_PRO_LEARNER,
  },
  recruiter: {
    name: 'Recruiter',
    price: 50,
    aiGenerations: 0, // Recruiters don't generate lessons
    role: 'recruiter',
    stripePriceId: process.env.STRIPE_PRICE_RECRUITER,
  },
};

// Addon configuration
const ADDON_CONFIG = {
  price: 10,
  generations: 3,
  stripePriceId: process.env.STRIPE_PRICE_ADDON,
};

// Create Stripe checkout session
export const createCheckoutSession = async (req, res) => {
  try {
    const { subscriptionType, isAddon } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Validate subscription type
    if (!isAddon && !SUBSCRIPTION_TIERS[subscriptionType]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid subscription type',
      });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString(),
        },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Determine the price ID
    let priceId;
    let mode = 'subscription';
    let successUrl = `${process.env.CLIENT_URL}/subscription?session_id={CHECKOUT_SESSION_ID}`;

    if (isAddon) {
      priceId = ADDON_CONFIG.stripePriceId;
      mode = 'payment'; // One-time payment for addon
      // Also use session_id for addons to verify the purchase
      successUrl = `${process.env.CLIENT_URL}/subscription?session_id={CHECKOUT_SESSION_ID}&addon=true`;
    } else {
      priceId = SUBSCRIPTION_TIERS[subscriptionType].stripePriceId;
    }

    if (!priceId) {
      return res.status(400).json({
        success: false,
        message: 'Price ID not configured. Please contact support.',
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: `${process.env.CLIENT_URL}/subscription?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        subscriptionType: isAddon ? 'addon' : subscriptionType,
        isAddon: isAddon ? 'true' : 'false',
      },
    });

    res.status(200).json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create checkout session',
      error: error.message,
    });
  }
};

// Stripe webhook handler
export const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'customer.created':
        // Customer created - this is informational, no action needed
        console.log(`Customer created: ${event.data.object.id}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

// Helper: Handle successful checkout
async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;
  const subscriptionType = session.metadata.subscriptionType;
  const isAddon = session.metadata.isAddon === 'true';

  const user = await User.findById(userId);
  if (!user) {
    console.error('User not found:', userId);
    return;
  }

  // Determine payment amount
  let amount = 0;
  let paymentType = '';
  let plan = 'basic';

  if (isAddon) {
    amount = ADDON_CONFIG.price;
    paymentType = 'subscription';
    plan = user.subscriptionType || 'basic';

    // Add addon generations
    user.generationLimits.addonGenerations += ADDON_CONFIG.generations;
    console.log(
      `Added ${ADDON_CONFIG.generations} addon generations to user ${userId}`
    );
  } else {
    // Update subscription
    const tier = SUBSCRIPTION_TIERS[subscriptionType];
    amount = tier.price;
    paymentType =
      user.subscriptionType && user.subscriptionType !== 'free'
        ? 'role_upgrade'
        : 'subscription';
    plan = subscriptionType;

    user.subscriptionType = subscriptionType;
    user.role = tier.role;
    user.subscriptionStatus = 'active';
    user.subscriptionStartDate = new Date();
    user.generationLimits.aiLessonsPerMonth = tier.aiGenerations;

    if (session.subscription) {
      user.stripeSubscriptionId = session.subscription;
    }

    console.log(`Updated user ${userId} to ${subscriptionType} subscription`);
  }

  await user.save();

  // Create payment record
  try {
    // Check if payment already exists for this transaction
    const existingPayment = await Payment.findOne({
      transactionId: session.id,
    });

    if (!existingPayment) {
      await Payment.create({
        user: userId,
        amount: amount,
        currency: 'USD',
        paymentType: paymentType,
        plan: plan,
        role: user.role,
        status: 'completed',
        paymentMethod: 'stripe',
        transactionId: session.id,
        description: isAddon
          ? `Addon: ${ADDON_CONFIG.generations} AI lesson generations`
          : `Subscription: ${SUBSCRIPTION_TIERS[subscriptionType].name}`,
        metadata: {
          stripeSessionId: session.id,
          stripeSubscriptionId: session.subscription || null,
          isAddon: isAddon,
        },
      });
      console.log(
        `Payment record created for user ${userId}, amount: $${amount}`
      );
    } else {
      console.log(
        `Payment record already exists for transaction ${session.id}, skipping creation`
      );
    }
  } catch (error) {
    console.error('Error creating payment record:', error);
  }
}

// Helper: Handle subscription update
async function handleSubscriptionUpdated(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  user.subscriptionStatus = subscription.status;
  await user.save();
  console.log(
    `Updated subscription status for user ${user._id} to ${subscription.status}`
  );
}

// Helper: Handle subscription deletion
async function handleSubscriptionDeleted(subscription) {
  const user = await User.findOne({ stripeSubscriptionId: subscription.id });
  if (!user) {
    console.error('User not found for subscription:', subscription.id);
    return;
  }

  // Downgrade to free tier
  user.subscriptionType = 'free';
  user.subscriptionStatus = 'canceled';
  user.role = 'user';
  user.generationLimits.aiLessonsPerMonth = 1;
  user.subscriptionEndDate = new Date();

  await user.save();
  console.log(`Downgraded user ${user._id} to free tier`);
}

// Helper: Handle payment failure
async function handlePaymentFailed(invoice) {
  const user = await User.findOne({ stripeCustomerId: invoice.customer });
  if (!user) {
    console.error('User not found for customer:', invoice.customer);
    return;
  }

  user.subscriptionStatus = 'past_due';
  await user.save();
  console.log(`Marked subscription as past_due for user ${user._id}`);

  // TODO: Send email notification to user
}

// Get current subscription status
export const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select(
      'subscriptionType subscriptionStatus generationLimits role'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const tier = SUBSCRIPTION_TIERS[user.subscriptionType];

    res.status(200).json({
      success: true,
      data: {
        subscriptionType: user.subscriptionType,
        subscriptionStatus: user.subscriptionStatus,
        tierName: tier.name,
        price: tier.price,
        generationLimits: {
          total:
            user.generationLimits.aiLessonsPerMonth +
            user.generationLimits.addonGenerations,
          used: user.generationLimits.currentMonthGenerations,
          remaining:
            user.generationLimits.aiLessonsPerMonth +
            user.generationLimits.addonGenerations -
            user.generationLimits.currentMonthGenerations,
          addonGenerations: user.generationLimits.addonGenerations,
        },
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get subscription status',
      error: error.message,
    });
  }
};

// Cancel subscription
export const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!user.stripeSubscriptionId) {
      return res.status(400).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    // Cancel at period end (don't immediately revoke access)
    await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    res.status(200).json({
      success: true,
      message: 'Subscription will be canceled at the end of the billing period',
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message,
    });
  }
};

// Reset monthly generation limits (run via cron job)
export const resetMonthlyLimits = async () => {
  try {
    const now = new Date();
    const users = await User.find({
      'generationLimits.lastResetDate': {
        $lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    });

    for (const user of users) {
      user.generationLimits.currentMonthGenerations = 0;
      user.generationLimits.lastResetDate = now;
      // Don't reset addon generations - they carry over
      await user.save();
    }

    console.log(`Reset generation limits for ${users.length} users`);
  } catch (error) {
    console.error('Error resetting monthly limits:', error);
  }
};

// Verify session and update user (fallback if webhook fails)
export const verifySession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user.id;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required',
      });
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }

    // Verify this session belongs to the user
    if (session.metadata.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const subscriptionType = session.metadata.subscriptionType;
    const isAddon = session.metadata.isAddon === 'true';

    // Determine payment amount
    let amount = 0;
    let paymentType = '';
    let plan = 'basic';

    // Update user based on session
    if (isAddon) {
      amount = ADDON_CONFIG.price;
      paymentType = 'subscription';
      plan = user.subscriptionType || 'basic';

      user.generationLimits.addonGenerations += ADDON_CONFIG.generations;
      console.log(
        `Added ${ADDON_CONFIG.generations} addon generations to user ${userId} via session verification`
      );
    } else {
      const tier = SUBSCRIPTION_TIERS[subscriptionType];
      amount = tier.price;
      paymentType =
        user.subscriptionType && user.subscriptionType !== 'free'
          ? 'role_upgrade'
          : 'subscription';
      plan = subscriptionType;

      user.subscriptionType = subscriptionType;
      user.role = tier.role;
      user.subscriptionStatus = 'active';
      user.subscriptionStartDate = new Date();
      user.generationLimits.aiLessonsPerMonth = tier.aiGenerations;

      if (session.subscription) {
        user.stripeSubscriptionId = session.subscription;
      }

      console.log(
        `Updated user ${userId} to ${subscriptionType} subscription via session verification`
      );
    }

    await user.save();

    // Create payment record
    try {
      // Check if payment already exists for this transaction
      const existingPayment = await Payment.findOne({
        transactionId: session.id,
      });

      if (!existingPayment) {
        const payment = await Payment.create({
          user: userId,
          amount: amount,
          currency: 'USD',
          paymentType: paymentType,
          plan: plan,
          role: user.role,
          status: 'completed',
          paymentMethod: 'stripe',
          transactionId: session.id,
          description: isAddon
            ? `Addon: ${ADDON_CONFIG.generations} AI lesson generations`
            : `Subscription: ${SUBSCRIPTION_TIERS[subscriptionType].name}`,
          metadata: {
            stripeSessionId: session.id,
            stripeSubscriptionId: session.subscription || null,
            isAddon: isAddon,
          },
        });
        console.log(
          `Payment record created for user ${userId}, amount: $${amount}, paymentId: ${payment._id}`
        );
      } else {
        console.log(
          `Payment record already exists for transaction ${session.id}, skipping creation`
        );
      }
    } catch (error) {
      console.error('Error creating payment record:', error);
      // Don't fail the request if payment record creation fails
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified and account updated',
      data: {
        subscriptionType: user.subscriptionType,
        role: user.role,
        subscriptionStatus: user.subscriptionStatus,
        generationLimits: {
          total:
            user.generationLimits.aiLessonsPerMonth +
            user.generationLimits.addonGenerations,
          used: user.generationLimits.currentMonthGenerations,
          remaining:
            user.generationLimits.aiLessonsPerMonth +
            user.generationLimits.addonGenerations -
            user.generationLimits.currentMonthGenerations,
          addonGenerations: user.generationLimits.addonGenerations,
        },
      },
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify session',
      error: error.message,
    });
  }
};
