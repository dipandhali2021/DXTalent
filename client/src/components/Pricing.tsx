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
import { useLanguage } from '@/context/LanguageContext';

// pricingTiers uses t() so it must be created inside the component

export default function Pricing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState<string | null>(null);

  const pricingTiers = [
    {
      name: t('pricing.learner.title'),
      role: 'user',
      subscriptionType: 'free',
      icon: <Pencil className="w-6 h-6" />,
      price: 0,
      priceLabel: t('pricing.learner.price'),
      period: t('pricing.learner.period'),
      description: t('pricing.learner.subtitle'),
      features: [
        t('pricing.learner.feature1'),
        t('pricing.learner.feature2'),
        t('pricing.learner.feature3'),
        t('pricing.learner.feature4'),
        t('pricing.learner.feature5'),
        t('pricing.learner.feature6'),
      ],
      limits: {
        aiGenerations: 1,
      },
      color: 'amber',
      cta: t('pricing.learner.cta'),
      note: t('pricing.learner.note'),
    },
    {
      name: t('pricing.pro.title'),
      role: 'user',
      subscriptionType: 'pro',
      icon: <Crown className="w-6 h-6" />,
      price: 20,
      priceLabel: t('pricing.pro.price'),
      period: t('pricing.pro.period'),
      description: t('pricing.pro.subtitle'),
      features: [
        t('pricing.pro.feature1'),
        t('pricing.pro.feature2'),
        t('pricing.pro.feature3'),
        t('pricing.pro.feature4'),
        t('pricing.pro.addon'),
      ],
      limits: {
        aiGenerations: 5,
        addonPrice: 10,
        addonGenerations: 3,
      },
      popular: true,
      color: 'blue',
      cta: t('pricing.pro.cta'),
      stripeProductId: 'price_pro_learner', // Will be replaced with actual Stripe price ID
    },
    {
      name: t('pricing.recruiter.title'),
      role: 'recruiter',
      subscriptionType: 'recruiter',
      icon: <Star className="w-6 h-6" />,
      price: 50,
      priceLabel: t('pricing.recruiter.price'),
      period: t('pricing.recruiter.period'),
      description: t('pricing.recruiter.subtitle'),
      features: [
        t('pricing.recruiter.feature1'),
        t('pricing.recruiter.feature2'),
        t('pricing.recruiter.feature3'),
        t('pricing.recruiter.feature4'),
        t('pricing.recruiter.feature5'),
        t('pricing.recruiter.feature6'),
        t('pricing.recruiter.feature7'),
      ],
      color: 'primary',
      cta: t('pricing.recruiter.cta'),
      stripeProductId: 'price_recruiter', // Will be replaced with actual Stripe price ID
    },
  ];

  const handlePricingClick = async (tier: (typeof pricingTiers)[0]) => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    // If free tier, just update user profile
    if (tier.subscriptionType === 'free') {
      toast({
        title: t('pricing.toast.already_free.title'),
        description: t('pricing.toast.already_free.desc'),
      });
      navigate('/dashboard');
      return;
    }

    // Check if user already has this subscription
    if ((user as any)?.subscriptionType === tier.subscriptionType) {
      toast({
        title: t('pricing.toast.already_subscribed.title'),
        description: t('pricing.toast.already_subscribed.desc', {
          plan: tier.name,
        }),
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
        title: t('pricing.toast.checkout_failed.title'),
        description:
          (error as any)?.response?.data?.message ||
          t('pricing.toast.checkout_failed.desc'),
        variant: 'destructive',
      });
      setLoading(null);
    }
  };

  return (
    <section
      id="pricing"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-xs sm:text-sm font-bold">
            {t('pricing.badge')}
          </div>
          <div className="relative px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground rotate-playful-2">
              {t('pricing.title')}
              <div className="absolute -right-4 sm:-right-8 md:-right-12 top-0 text-2xl sm:text-3xl md:text-4xl rotate-12">
                ✨
              </div>
              <div className="absolute -left-4 sm:-left-8 bottom-0 text-2xl sm:text-3xl md:text-4xl -rotate-12">
                💎
              </div>
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 sm:w-44 h-2 sm:h-3 bg-primary opacity-20 rotate-playful-1 rounded-full blur-sm" />
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground rotate-playful-1 max-w-2xl mx-auto px-2">
            {t('pricing.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
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
                className={`absolute inset-0 bg-card border-2 sm:border-[3px] ${
                  tier.popular ? 'border-primary' : 'border-border'
                } rounded-xl brutal-shadow group-hover:brutal-shadow-lg transition-all group-hover:-translate-x-1 group-hover:-translate-y-1`}
              />

              <div className="relative p-5 sm:p-6 md:p-8">
                {tier.popular && (
                  <div className="absolute -top-3 sm:-top-4 -right-3 sm:-right-4 bg-primary text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2 rounded-full rotate-12 text-xs sm:text-sm brutal-border font-bold shadow-lg">
                    🔥 {t('pricing.popular')}
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full mb-4 sm:mb-5 md:mb-6 flex items-center justify-center border-2 sm:border-[3px] ${
                    tier.popular
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-background'
                  } text-primary`}
                >
                  {tier.icon}
                </div>

                {/* Tier Info */}
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                  {tier.description}
                </p>

                {/* Price */}
                <div className="mb-4 sm:mb-6">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
                    {tier.priceLabel ?? `$${tier.price}`}
                  </span>
                  <span className="text-muted-foreground text-base sm:text-lg">
                    {tier.period ?? '/month'}
                  </span>
                  {tier.price === 0 && (
                    <div className="inline-block ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md text-xs font-bold">
                      {tier.note ?? t('pricing.learner.note')}
                    </div>
                  )}
                </div>

                {/* Add-on pricing */}
                {tier.limits?.addonPrice && (
                  <div className="mb-4 p-2.5 sm:p-3 bg-accent/10 brutal-border rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
                      {t('pricing.addon', {
                        count: tier.limits.addonGenerations,
                        price: tier.limits.addonPrice,
                      })}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {tier.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-start gap-2 sm:gap-3"
                    >
                      <div
                        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 ${
                          tier.popular
                            ? 'border-primary bg-primary/10'
                            : 'border-border'
                        } flex items-center justify-center mt-0.5 flex-shrink-0 bg-background`}
                      >
                        <Check
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${
                            tier.popular
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <span className="text-foreground text-xs sm:text-sm">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant={tier.popular ? 'hero' : 'outline-brutal'}
                  className="w-full text-sm sm:text-base"
                  onClick={() => handlePricingClick(tier)}
                  disabled={loading === tier.subscriptionType}
                >
                  {loading === tier.subscriptionType ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('pricing.processing')}
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
