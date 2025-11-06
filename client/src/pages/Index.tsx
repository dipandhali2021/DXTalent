import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import SupportTicket from '@/components/SupportTicket';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logo from '@/assets/logo.png';
import logoJp from '@/assets/logo-jp.png';

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    if (!user) {
      navigate('/profile');
      return;
    }

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
  };

  const handleViewPricing = () => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 w-full flex flex-col sm:flex-row justify-between items-center gap-2 p-2 sm:p-3 z-50 bg-background/95 backdrop-blur-sm brutal-border-b">
        {/* First row on mobile: Centered Logo */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-start items-center">
          <Link to="/" aria-label="Home" className="flex items-center">
            <img
              src={language === 'jp' ? logoJp : logo}
              alt="DXTalent"
              className="h-12 sm:h-12 md:h-14 object-contain"
            />
          </Link>
        </div>

        {/* Second row on mobile / Right side on desktop: All Navigation */}
        <div className="w-full sm:w-auto flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2 flex-wrap">
          <LanguageSwitcher />

          <Button
            variant="outline-brutal"
            onClick={handleViewPricing}
            className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
          >
            <span className="hidden sm:inline">{t('nav.pricing')}</span>
            <span className="sm:hidden">💰</span>
          </Button>

          {isAuthenticated && user ? (
            <>
              <Button
                variant="outline"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
                onClick={handleProfileClick}
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="max-w-[60px] sm:max-w-[100px] truncate">
                  {user.username}
                </span>
              </Button>
              <Button
                variant="hero"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
                onClick={handleLogout}
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button
                variant="hero"
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9"
              >
                <User className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('nav.login')}
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Sections */}
      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <SupportTicket />
      <Footer />
    </div>
  );
};

export default Index;
