import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';

export default function CTA() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  const handleBookDemo = () => {
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 px-4 bg-muted">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary text-primary-foreground brutal-border brutal-shadow-lg rounded-2xl p-12 md:p-16 text-center relative overflow-hidden rotate-playful-1">
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 text-4xl rotate-12 opacity-50">
            🚀
          </div>
          <div className="absolute bottom-4 left-4 text-4xl -rotate-12 opacity-50">
            ⚡
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">{t('cta.title')}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                variant="accent"
                size="lg"
                className="group"
                onClick={handleGetStarted}
              >
                <Rocket className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                {t('cta.button')}
              </Button>
              <Button
                variant="outline-light"
                size="lg"
                onClick={handleBookDemo}
              >
                {t('cta.demo')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
