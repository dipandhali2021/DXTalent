import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Check,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
  Crown,
  Star,
  ArrowRight,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { subscriptionAPI } from '@/lib/api';
import DashboardHeader from '@/components/DashboardHeader';

interface SubscriptionStatus {
  subscriptionType: string;
  subscriptionStatus: string;
  tierName: string;
  price: number;
  generationLimits: {
    total: number;
    used: number;
    remaining: number;
    addonGenerations: number;
  };
  role: string;
}

const pricingTiers = [
  {
    name: 'Learner',
    subscriptionType: 'free',
    icon: <Sparkles className="w-6 h-6" />,
    price: 0,
    description: 'Start your learning journey',
    features: [
      'Access to 50+ Pre-built Lessons',
      'Basic Leaderboard Access',
      'Earn Digital Badges',
      '1 AI Credit per month',
      '1 Topic (10 lessons) OR 2 individual lessons',
      'Community Forum Access',
    ],
    color: 'amber',
    cta: 'Current Plan',
  },
  {
    name: 'Pro Learner',
    subscriptionType: 'pro',
    icon: <Crown className="w-6 h-6" />,
    price: 20,
    description: 'Unlock advanced features',
    features: [
      'Everything in Learner',
      '5 AI Credits per month',
      '5 Topics OR 10 individual lessons (or mix)',
      'Advanced Analytics Dashboard',
      'Priority Support',
      'Custom Learning Paths',
      'Add-on: +3 credits for $10',
    ],
    popular: true,
    color: 'blue',
    cta: 'Upgrade to Pro',
    addonAvailable: true,
  },
  {
    name: 'Recruiter',
    subscriptionType: 'recruiter',
    icon: <Star className="w-6 h-6" />,
    price: 50,
    description: 'Find and hire top talent',
    features: [
      'Full Talent Database Access',
      'Advanced Candidate Filtering',
      'Direct Candidate Contact',
      'Performance Analytics',
      'Unlimited Searches',
    ],
    color: 'primary',
    cta: 'Upgrade to Recruiter',
  },
];

const Subscription = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] =
    useState<SubscriptionStatus | null>(null);
  const [upgradeLoading, setUpgradeLoading] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const paymentHandledRef = useRef(false);

  // Handle payment success/failure from URL params (only once)
  useEffect(() => {
    const handlePaymentResult = async () => {
      const sessionId = searchParams.get('session_id');
      const isAddon = searchParams.get('addon') === 'true';
      const canceled = searchParams.get('canceled');

      // Check if we have payment params and haven't handled them yet
      if (paymentHandledRef.current || (!sessionId && !canceled)) {
        return;
      }

      paymentHandledRef.current = true;

      if (sessionId) {
        // Payment was successful - verify session and update user
        try {
          const response = await subscriptionAPI.verifySession(sessionId);
          if (response.success) {
            // Refresh user data to get updated role and subscription
            await refreshUser();

            if (isAddon) {
              toast({
                title: '🎉 Purchase Successful!',
                description: 'Your AI lesson generations have been added!',
              });
            } else {
              toast({
                title: '🎉 Payment Successful!',
                description:
                  'Your subscription has been updated. Welcome to your new plan!',
              });
            }

            // Fetch updated subscription status
            await fetchSubscriptionStatus();
          }
        } catch (error: any) {
          console.error('Error verifying session:', error);
          toast({
            title: '⚠️ Payment Processing',
            description:
              'Your payment was successful, but there was an issue updating your account. Please refresh the page or contact support if the issue persists.',
            variant: 'destructive',
          });
        } finally {
          // Clean up the URL
          window.history.replaceState({}, '', '/subscription');
        }
      } else if (canceled === 'true') {
        toast({
          title: '❌ Payment Canceled',
          description:
            'Your payment was canceled. No changes were made to your subscription.',
          variant: 'destructive',
        });

        // Clean up the URL
        window.history.replaceState({}, '', '/subscription');
      }
    };

    handlePaymentResult();
  }, [searchParams]);

  // Fetch subscription status on mount
  useEffect(() => {
    if (!paymentHandledRef.current) {
      fetchSubscriptionStatus();
    }
  }, []);

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await subscriptionAPI.getSubscriptionStatus();
      if (response.success) {
        setSubscriptionStatus(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching subscription:', error);
      toast({
        title: 'Failed to load subscription',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: (typeof pricingTiers)[0]) => {
    if (tier.subscriptionType === 'free') {
      return;
    }

    if (subscriptionStatus?.subscriptionType === tier.subscriptionType) {
      toast({
        title: 'Already Subscribed',
        description: `You are already on the ${tier.name} plan!`,
      });
      return;
    }

    setUpgradeLoading(tier.subscriptionType);

    try {
      const response = await subscriptionAPI.createCheckoutSession(
        tier.subscriptionType,
        false
      );

      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Checkout Failed',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
      setUpgradeLoading(null);
    }
  };

  const handleBuyAddon = async () => {
    setUpgradeLoading('addon');

    try {
      const response = await subscriptionAPI.createCheckoutSession('', true);

      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Checkout Failed',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
      setUpgradeLoading(null);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        'Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.'
      )
    ) {
      return;
    }

    setCancelLoading(true);

    try {
      const response = await subscriptionAPI.cancelSubscription();
      if (response.success) {
        toast({
          title: 'Subscription Cancelled',
          description:
            'Your subscription will be cancelled at the end of the billing period.',
        });
        fetchSubscriptionStatus();
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: 'Cancellation Failed',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader role={user?.role} />
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const currentTier = pricingTiers.find(
    (t) => t.subscriptionType === subscriptionStatus?.subscriptionType
  );

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader role={user?.role} />

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Manage Your Subscription
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose the plan that fits your needs
          </p>
        </div>

        {/* Credit System Explanation */}
        {subscriptionStatus?.role === 'user' && (
          <Card className="brutal-border brutal-shadow mb-8 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    💳 How AI Credits Work
                  </h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      • <strong>Generate Topic (10 lessons):</strong> 1 credit -
                      Creates 3 complete lessons + 7 placeholders
                    </p>
                    <p>
                      • <strong>Generate Individual Lesson:</strong> 0.5 credit
                      - Generates questions for one placeholder lesson
                    </p>
                    <p>
                      • <strong>First Test Generation:</strong> FREE - First
                      test for each lesson is included
                    </p>
                    <p>
                      • <strong>Regenerate Test (new questions):</strong> 0.5
                      credit - Get fresh questions for practice
                    </p>
                    <p>
                      • <strong>Example:</strong> With 5 credits, you can
                      generate 5 topics OR 10 individual lessons OR 10 test
                      regenerations OR any mix!
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Plan Card */}
        {subscriptionStatus && (
          <Card className="brutal-border brutal-shadow mb-12 rotate-playful-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-6 h-6" />
                Current Plan
              </CardTitle>
              <CardDescription>
                Your active subscription and usage details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan Info */}
                <div className="bg-accent/10 brutal-border p-6 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {currentTier?.icon}
                    <h3 className="text-2xl font-bold">
                      {subscriptionStatus.tierName}
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-primary">
                    ${subscriptionStatus.price}
                    <span className="text-sm text-muted-foreground">
                      /month
                    </span>
                  </p>
                  <div className="mt-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                        subscriptionStatus.subscriptionStatus === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}
                    >
                      {subscriptionStatus.subscriptionStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Usage Stats - Only for users with generation limits */}
                {subscriptionStatus.role === 'user' && (
                  <div className="bg-primary/10 brutal-border p-6 rounded-lg">
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-bold">AI Generations</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-muted-foreground">
                            Used this month
                          </span>
                          <span className="text-sm font-bold">
                            {subscriptionStatus.generationLimits.used.toFixed(
                              1
                            )}{' '}
                            /{' '}
                            {subscriptionStatus.generationLimits.total.toFixed(
                              1
                            )}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-primary h-3 rounded-full transition-all"
                            style={{
                              width: `${
                                (subscriptionStatus.generationLimits.used /
                                  subscriptionStatus.generationLimits.total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {subscriptionStatus.generationLimits.remaining.toFixed(
                          1
                        )}{' '}
                        left
                      </div>
                      {subscriptionStatus.generationLimits.addonGenerations >
                        0 && (
                        <div className="text-sm text-muted-foreground">
                          Includes{' '}
                          {subscriptionStatus.generationLimits.addonGenerations.toFixed(
                            1
                          )}{' '}
                          addon credits
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-muted/50 brutal-border p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {/* Buy Addon - Only for Pro users */}
                    {subscriptionStatus.subscriptionType === 'pro' && (
                      <Button
                        variant="outline-brutal"
                        className="w-full"
                        onClick={handleBuyAddon}
                        disabled={upgradeLoading === 'addon'}
                      >
                        {upgradeLoading === 'addon' ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 mr-2" />
                        )}
                        Buy +3 Generations ($10)
                      </Button>
                    )}

                    {/* Cancel Subscription - Only for paid plans */}
                    {subscriptionStatus.subscriptionType !== 'free' && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleCancelSubscription}
                        disabled={cancelLoading}
                      >
                        {cancelLoading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          'Cancel Subscription'
                        )}
                      </Button>
                    )}

                    {/* Browse Lessons - Only for learners, not recruiters */}
                    {subscriptionStatus.subscriptionType !== 'recruiter' && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => navigate('/lessons')}
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Browse Lessons
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing Tiers */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-center mb-8">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => {
              const isCurrent =
                tier.subscriptionType === subscriptionStatus?.subscriptionType;

              return (
                <div
                  key={tier.name}
                  className={`relative group ${
                    index === 0
                      ? 'rotate-playful-1'
                      : index === 1
                      ? 'rotate-playful-2 md:scale-105'
                      : 'rotate-playful-3'
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-card border-[3px] ${
                      tier.popular
                        ? 'border-primary'
                        : isCurrent
                        ? 'border-green-500'
                        : 'border-border'
                    } rounded-xl brutal-shadow group-hover:brutal-shadow-lg transition-all`}
                  />

                  <div className="relative p-8">
                    {tier.popular && (
                      <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full rotate-12 text-sm brutal-border font-bold shadow-lg">
                        🔥 Popular
                      </div>
                    )}

                    {isCurrent && (
                      <div className="absolute -top-4 -left-4 bg-green-500 text-white px-4 py-2 rounded-full -rotate-12 text-sm brutal-border font-bold shadow-lg">
                        ✓ Active
                      </div>
                    )}

                    <div
                      className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center border-[3px] ${
                        tier.popular
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-background'
                      } text-primary`}
                    >
                      {tier.icon}
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-muted-foreground mb-6">
                      {tier.description}
                    </p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold">${tier.price}</span>
                      <span className="text-muted-foreground text-lg">
                        /month
                      </span>
                      {tier.price === 0 && (
                        <div className="inline-block ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-xs font-bold">
                          FREE FOREVER
                        </div>
                      )}
                    </div>

                    {tier.addonAvailable && (
                      <div className="mb-4 p-3 bg-accent/10 brutal-border rounded-lg">
                        <p className="text-sm">
                          <Zap className="w-4 h-4 inline mr-1" />
                          Add-on: +3 generations for $10
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 mb-8">
                      {tier.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-[2px] ${
                              tier.popular
                                ? 'border-primary bg-primary/10'
                                : 'border-border'
                            } flex items-center justify-center flex-shrink-0 bg-background`}
                          >
                            <Check
                              className={`w-4 h-4 ${
                                tier.popular
                                  ? 'text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant={
                        isCurrent
                          ? 'outline'
                          : tier.popular
                          ? 'hero'
                          : 'outline-brutal'
                      }
                      className="w-full"
                      onClick={() => handleUpgrade(tier)}
                      disabled={
                        isCurrent || upgradeLoading === tier.subscriptionType
                      }
                    >
                      {upgradeLoading === tier.subscriptionType ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrent ? (
                        'Current Plan'
                      ) : (
                        tier.cta
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
