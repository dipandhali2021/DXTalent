import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';
import SupportTicket from '@/components/SupportTicket';
import Footer from '@/components/Footer';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { t } = useLanguage();
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
      <nav className="fixed top-0 right-0 w-full flex justify-end items-center gap-2 p-4 z-50">
        {/* Navigation */}
        <LanguageSwitcher />
        <Button variant="outline-brutal" onClick={handleViewPricing}>
          {t('nav.pricing')}
        </Button>
        {isAuthenticated && user ? (
          <>
            <Button
              variant="outline"
              className="gap-2"
              onClick={handleProfileClick}
            >
              <User className="w-4 h-4" />
              {user.username}
            </Button>
            <Button variant="hero" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="hero" className="gap-2">
              <User className="w-4 h-4" />
              {t('nav.login')}
            </Button>
          </Link>
        )}
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

const IndexWithLanguage = () => {
  return (
    <LanguageProvider>
      <Index />
    </LanguageProvider>
  );
};

export default IndexWithLanguage;
