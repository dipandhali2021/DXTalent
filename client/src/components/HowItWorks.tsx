import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      number: '1',
      emoji: '📝',
      title: t('howitworks.step1.title'),
      description: t('howitworks.step1.desc'),
    },
    {
      number: '2',
      emoji: '🎯',
      title: t('howitworks.step2.title'),
      description: t('howitworks.step2.desc'),
    },
    {
      number: '3',
      emoji: '🏆',
      title: t('howitworks.step3.title'),
      description: t('howitworks.step3.desc'),
    },
  ];
  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <div className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 text-sm font-bold">
            {t('howitworks.badge')}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground rotate-playful-2">
            {t('howitworks.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('howitworks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div
                className={`bg-card brutal-border brutal-shadow rounded-xl p-8 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${
                  index === 0
                    ? 'rotate-playful-1'
                    : index === 1
                    ? 'rotate-playful-2'
                    : 'rotate-playful-3'
                }`}
              >
                {/* Step Number Badge */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-accent text-accent-foreground brutal-border flex items-center justify-center text-2xl font-bold rotate-12">
                  {step.number}
                </div>

                {/* Emoji */}
                <div className="text-6xl mb-4 animate-bounce-slow">
                  {step.emoji}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-lg">
                  {step.description}
                </p>
              </div>

              {/* Arrow between steps (hidden on mobile and last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-8 z-10 text-primary transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
