import { Button } from '@/components/ui/button';
import { Sparkles, Trophy, Target } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import logo from '@/assets/logo.png';
import logoJp from '@/assets/logo-jp.png';

export default function Hero() {
  const { isAuthenticated, user } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      navigate('/auth');
    }
  };

  const handleForRecruiters = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter/dashboard');
          break;
        default:
          // For learners, show pricing to upgrade to recruiter
          const pricingSection = document.getElementById('pricing');
          if (pricingSection) {
            pricingSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            navigate('/#pricing');
          }
      }
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-4 sm:left-10 text-3xl sm:text-6xl rotate-12 opacity-30">
          ✏️
        </div>
        <div className="absolute top-40 right-4 sm:right-20 text-2xl sm:text-5xl -rotate-12 opacity-30">
          📚
        </div>
        <div className="absolute bottom-40 left-4 sm:left-20 text-2xl sm:text-5xl rotate-6 opacity-30">
          🎯
        </div>
        <div className="absolute bottom-20 right-4 sm:right-10 text-3xl sm:text-6xl -rotate-6 opacity-30">
          🏆
        </div>
      </div>

      <div className="max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 pt-12 sm:pt-0 mt-12">
        {/* Tag */}
        <div className="inline-block">
          <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-full brutal-border brutal-shadow rotate-playful-1 inline-block text-xs sm:text-sm font-bold">
            {t('hero.badge')}
          </span>
        </div>

        {/* Main Heading */}
        <div className="relative px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-foreground rotate-playful-1 leading-tight">
            {t('hero.title')}
            <br />
            <span className="relative inline-block">
              <span className="relative z-10">
                {t('hero.subtitle_before')}
                <span className="relative inline-block">
                  <span className="relative z-10">
                    {t('hero.subtitle_highlight')}
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-4 bg-accent -rotate-1 -z-0"></div>
                </span>
              </span>
            </span>
          </h1>
          <div className="absolute -right-4 sm:-right-8 top-0 text-2xl sm:text-5xl rotate-12 animate-bounce-slow">
            ⭐
          </div>
          <div className="absolute -left-4 sm:-left-8 bottom-0 text-2xl sm:text-5xl -rotate-12 animate-bounce-slow animation-delay-300">
            ✨
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto rotate-playful-2 font-normal px-2 sm:px-4">
          {t('hero.description')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-2 sm:px-0">
          {!isAuthenticated || user?.role === 'user' ? (
            <>
              <Button
                variant="hero"
                size="lg"
                className="group w-full sm:w-auto text-sm sm:text-base"
                onClick={handleStartLearning}
              >
                <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
                {t('hero.start_learning')}
              </Button>
              <Button
                variant="outline-brutal"
                size="lg"
                className="group w-full sm:w-auto text-sm sm:text-base"
                onClick={handleForRecruiters}
              >
                <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                {t('hero.for_recruiters')}
              </Button>
            </>
          ) : user?.role === 'recruiter' ? (
            <>
              <Button
                variant="hero"
                size="lg"
                className="group w-full sm:w-auto text-sm sm:text-base"
                onClick={handleForRecruiters}
              >
                <Trophy className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform" />
                {t('hero.go_to_dashboard')}
              </Button>
            </>
          ) : (
            <Button
              variant="hero"
              size="lg"
              className="group w-full sm:w-auto text-sm sm:text-base"
              onClick={handleStartLearning}
            >
              <Target className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform" />
              {t('hero.go_to_dashboard')}
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 max-w-4xl mx-auto px-2 sm:px-0">
          {[
            { icon: '🎮', label: t('hero.challenges'), value: '50+' },
            { icon: '👨‍💻', label: t('hero.learners'), value: '10K+' },
            { icon: '🏢', label: t('hero.partners'), value: '200+' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`bg-card brutal-border brutal-shadow rounded-xl p-4 sm:p-6 hover:brutal-shadow-lg hover:-translate-y-1 transition-all ${
                i === 0
                  ? 'rotate-playful-1'
                  : i === 1
                  ? 'rotate-playful-2'
                  : 'rotate-playful-3'
              }`}
            >
              <div className="text-3xl sm:text-4xl mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
