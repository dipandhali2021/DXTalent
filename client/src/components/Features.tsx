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
    <section className="py-20 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-sm font-bold">
            {t('features.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground rotate-playful-2">
            {t('features.title')}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">{t('features.work')}</span>
              <div className="absolute -bottom-2 left-0 right-0 h-4 bg-primary -rotate-1 opacity-30 -z-0"></div>
            </span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-card brutal-border brutal-shadow rounded-xl p-8 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${feature.rotation}`}
              >
                <div
                  className={`w-16 h-16 rounded-full border-[3px] border-border flex items-center justify-center mb-6 bg-background ${feature.color}`}
                >
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-lg">
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
