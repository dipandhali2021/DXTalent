import { Brain, Trophy, Users, Target, Zap, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Features() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('features.skill.title'),
      description: t('features.skill.desc'),
      color: 'text-primary',
      rotation: 'rotate-playful-1',
    },
    {
      icon: Trophy,
      title: t('features.leaderboard.title'),
      description: t('features.leaderboard.desc'),
      color: 'text-accent',
      rotation: 'rotate-playful-2',
    },
    {
      icon: Users,
      title: t('features.talent.title'),
      description: t('features.talent.desc'),
      color: 'text-primary',
      rotation: 'rotate-playful-3',
    },
    {
      icon: Target,
      title: t('features.assessment.title'),
      description: t('features.assessment.desc'),
      color: 'text-accent',
      rotation: 'rotate-playful-1',
    },
    {
      icon: Zap,
      title: t('features.feedback.title'),
      description: t('features.feedback.desc'),
      color: 'text-primary',
      rotation: 'rotate-playful-2',
    },
    {
      icon: Award,
      title: t('features.badges.title'),
      description: t('features.badges.desc'),
      color: 'text-accent',
      rotation: 'rotate-playful-3',
    },
  ];
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-3 sm:space-y-4 mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-accent text-accent-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-xs sm:text-sm font-bold">
            {t('features.badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground rotate-playful-2 px-2">
            {t('features.title')}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">{t('features.work')}</span>
              <div className="absolute -bottom-2 left-0 right-0 h-3 sm:h-4 bg-primary -rotate-1 opacity-30 -z-0"></div>
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-card brutal-border brutal-shadow rounded-xl p-5 sm:p-6 md:p-8 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${feature.rotation}`}
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full border-2 sm:border-[3px] border-border flex items-center justify-center mb-4 sm:mb-5 md:mb-6 bg-background ${feature.color}`}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
