import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Pricing from '@/components/Pricing';
import CTA from '@/components/CTA';

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
  };

  const handleProfileClick = () => {
    if (user) {
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
      navigate('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 right-0 p-4 z-50 flex gap-2">
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
              Logout
            </Button>
          </>
        ) : (
          <Link to="/auth">
            <Button variant="hero" className="gap-2">
              <User className="w-4 h-4" />
              Login / Sign Up
            </Button>
          </Link>
        )}
      </nav>

      <Hero />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
    </div>
  );
};

export default Index;
