import { Button } from '@/components/ui/button';
import { Check, Pencil, Star, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const pricingTiers = [
  {
    name: 'Learner',
    icon: <Pencil className="w-6 h-6" />,
    price: 0,
    description: 'Perfect for skill seekers',
    features: [
      'Access to 20+ Challenges',
      'Basic Leaderboard Access',
      'Earn Digital Badges',
      'Community Forum',
    ],
    color: 'amber',
    cta: 'Start Free',
  },
  {
    name: 'Recruiter',
    icon: <Star className="w-6 h-6" />,
    price: 99,
    description: 'For serious talent hunters',
    features: [
      'Full Talent Database Access',
      'Advanced Filtering',
      'Direct Candidate Contact',
      'Performance Analytics',
    ],
    popular: true,
    color: 'blue',
    cta: 'Start Hiring',
  },
  {
    name: 'Enterprise',
    icon: <Sparkles className="w-6 h-6" />,
    price: 299,
    description: 'For teams & organizations',
    features: [
      'Custom Skill Challenges',
      'White-label Platform',
      'Dedicated Support',
      'API Integration',
    ],
    color: 'primary',
    cta: 'Contact Sales',
  },
];

export default function Pricing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePricingClick = (tierName: string) => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-sm font-bold">
            💰 Simple Pricing
          </div>
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground rotate-playful-2">
              Choose Your Path
              <div className="absolute -right-12 top-0 text-4xl rotate-12">
                ✨
              </div>
              <div className="absolute -left-8 bottom-0 text-4xl -rotate-12">
                ⭐
              </div>
            </h2>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-44 h-3 bg-primary opacity-20 rotate-playful-1 rounded-full blur-sm" />
          </div>
          <p className="text-xl text-muted-foreground rotate-playful-1">
            Start learning for free or unlock talent discovery
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
                  ? 'rotate-playful-2'
                  : 'rotate-playful-3'
              }`}
            >
              <div className="absolute inset-0 bg-card border-[3px] border-border rounded-xl brutal-shadow group-hover:brutal-shadow-lg transition-all group-hover:-translate-x-1 group-hover:-translate-y-1" />

              <div className="relative p-8">
                {tier.popular && (
                  <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground px-4 py-1 rounded-full rotate-12 text-sm brutal-border font-bold">
                    Popular!
                  </div>
                )}

                {/* Icon */}
                <div className="w-14 h-14 rounded-full mb-6 flex items-center justify-center border-[3px] border-border bg-background text-primary">
                  {tier.icon}
                </div>

                {/* Tier Info */}
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="text-muted-foreground mb-6">{tier.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    ${tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border-[2px] border-border flex items-center justify-center mt-0.5 flex-shrink-0 bg-background">
                        <Check className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Button
                  variant={tier.popular ? 'hero' : 'outline-brutal'}
                  className="w-full"
                  onClick={() => handlePricingClick(tier.name)}
                >
                  {tier.cta}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
