import { Button } from '@/components/ui/button';
import {
  Check,
  Pencil,
  Star,
  Sparkles,
  Zap,
  Crown,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { subscriptionAPI } from '@/lib/api';
import { useState } from 'react';

const pricingTiers = [
  {
    name: 'Learner',
    role: 'user',
    subscriptionType: 'free',
    icon: <Pencil className="w-6 h-6" />,
    price: 0,
    description: 'Start your learning journey',
    features: [
      'Access to 50+ Pre-built Lessons',
      'Basic Leaderboard Access',
      'Earn Digital Badges',
      '1 AI Lesson Generation per month',
      'Community Forum Access',
      'Basic Progress Tracking',
    ],
    limits: {
      aiGenerations: 1,
    },
    color: 'amber',
    cta: 'Start Free',
  },
  {
    name: 'Pro Learner',
    role: 'user',
    subscriptionType: 'pro',
    icon: <Crown className="w-6 h-6" />,
    price: 20,
    description: 'Unlock advanced learning features',
    features: [
      'Everything in Learner',
      '5 AI Lesson Generations per month',
      'Advanced Analytics Dashboard',
      'Priority Support',
      'Custom Learning Paths',
      'Offline Access',
      'Add-on: +3 generations for $10',
    ],
    limits: {
      aiGenerations: 5,
      addonPrice: 10,
      addonGenerations: 3,
    },
    popular: true,
    color: 'blue',
    cta: 'Upgrade to Pro',
    stripeProductId: 'price_pro_learner', // Will be replaced with actual Stripe price ID
  },
  {
    name: 'Recruiter',
    role: 'recruiter',
    subscriptionType: 'recruiter',
    icon: <Star className="w-6 h-6" />,
    price: 50,
    description: 'Find and hire top talent',
    features: [
      'Full Talent Database Access',
      'Advanced Candidate Filtering',
      'Direct Candidate Contact',
      'Performance Analytics',
      'Skill Assessment Tools',
      'Unlimited Searches',
      'Priority Candidate Recommendations',
    ],
    color: 'primary',
    cta: 'Start Hiring',
    stripeProductId: 'price_recruiter', // Will be replaced with actual Stripe price ID
  },
];

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePricingClick = async (tier: (typeof pricingTiers)[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // If free tier, just update user profile
    if (tier.subscriptionType === 'free') {
      toast({
        title: 'Already on Free Plan',
        description: 'You are already on the free Learner plan!',
      });
      navigate('/dashboard');
      return;
    }

    // Check if user already has this subscription
    if ((user as any)?.subscriptionType === tier.subscriptionType) {
      toast({
        title: 'Already Subscribed',
        description: `You are already on the ${tier.name} plan!`,
      });
      navigate('/profile');
      return;
    }

    setLoading(tier.subscriptionType);

    try {
      // Create Stripe checkout session
      const response = await subscriptionAPI.createCheckoutSession(
        tier.subscriptionType,
        false
      );

      if (response.success && response.url) {
        // Redirect to Stripe checkout
        window.location.href = response.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error: any) {
      console.error('Error creating checkout:', error);
      toast({
        title: 'Checkout Failed',
        description: error.response?.data?.message || 'Please try again later.',
        variant: 'destructive',
      });
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-20 px-4 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-sm font-bold">
            💰 Transparent Pricing
          </div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground rotate-playful-2">
              Choose Your Plan
              <div className="absolute -right-12 top-0 text-4xl rotate-12">
                ✨
              </div>
              <div className="absolute -left-8 bottom-0 text-4xl -rotate-12">
                💎
              </div>
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-primary opacity-20 rotate-playful-1 rounded-full blur-sm" />
          </div>
          <p className="text-xl text-muted-foreground rotate-playful-1 max-w-2xl mx-auto">
            Start for free as a learner, upgrade for pro features, or hire top
            talent as a recruiter
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier, index) => (
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
                  tier.popular ? 'border-primary' : 'border-border'
                } rounded-xl brutal-shadow group-hover:brutal-shadow-lg transition-all group-hover:-translate-x-1 group-hover:-translate-y-1`}
              />

              <div className="relative p-8">
                {tier.popular && (
                  <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full rotate-12 text-sm brutal-border font-bold shadow-lg">
                    🔥 Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full mb-6 flex items-center justify-center border-[3px] ${
                    tier.popular
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background'
                  } text-primary`}
                >
                  {tier.icon}
                </div>

                {/* Tier Info */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-5xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground text-lg">/month</span>
                  {tier.price === 0 && (
                    <div className="inline-block ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-xs font-bold">
                      FREE FOREVER
                    </div>
                  )}
                </div>

                {/* Add-on pricing */}
                {tier.limits?.addonPrice && (
                  <div className="mb-4 p-3 bg-accent/10 brutal-border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <Zap className="w-4 h-4 inline mr-1" />
                      Add-on: +{tier.limits.addonGenerations} generations for $
                      {tier.limits.addonPrice}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-[2px] ${
                          tier.popular
                            ? 'border-primary bg-primary/10'
                            : 'border-border'
                        } flex items-center justify-center mt-0.5 flex-shrink-0 bg-background`}
                      >
                        <Check
                          className={`w-4 h-4 ${
                            tier.popular
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant={tier.popular ? 'hero' : 'outline-brutal'}
                  className="w-full"
                  onClick={() => handlePricingClick(tier)}
                  disabled={loading === tier.subscriptionType}
                >
                  {loading === tier.subscriptionType ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    tier.cta
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
