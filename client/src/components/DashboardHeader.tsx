import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BookOpen,
  Trophy,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Award,
  CreditCard,
} from 'lucide-react';
import { Zap, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';
import logoJp from '@/assets/logo-jp.png';

interface DashboardHeaderProps {
  role?: 'user' | 'recruiter' | 'admin';
}

const DashboardHeader = ({ role = 'user' }: DashboardHeaderProps) => {
  const { logout, user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'jp' : 'en');
  };

  // Define navigation items based on role
  const getNavigationItems = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: Trophy, label: 'nav.dashboard' },
          { to: '/admin/users', icon: User, label: 'nav.users' },
          { to: '/admin/payments', icon: CreditCard, label: 'nav.payments' },
          { to: '/profile', icon: User, label: 'nav.profile' },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter/dashboard', icon: Trophy, label: 'nav.dashboard' },
          { to: '/leaderboard', icon: Trophy, label: 'nav.leaderboard' },
          { to: '/profile', icon: User, label: 'nav.profile' },
        ];
      default:
        return [
          { to: '/dashboard', icon: Trophy, label: 'nav.dashboard' },
          { to: '/lessons', icon: BookOpen, label: 'nav.lessons' },
          { to: '/leaderboard', icon: Trophy, label: 'nav.leaderboard' },
          { to: '/profile', icon: User, label: 'nav.profile' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 bg-card brutal-border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="Home" className="flex items-center">
            <img
              src={language === 'jp' ? logoJp : logo}
              alt="DXTalent"
              className="h-12 md:h-16 ml-2 md:ml-4 object-contain"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2 flex-wrap ml-3">
            {navigationItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  className="min-w-0 brutal-border brutal-shadow bg-card rounded-lg px-2 py-1 flex items-center transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-100 hover:-translate-y-1 hover:rotate-0 cursor-pointer gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="truncate max-w-[120px] block">
                    {t(item.label)}
                  </span>
                </Button>
              </Link>
            ))}
            {/* Compact Level, XP & Streak - only show for regular users */}
            {role === 'user' && (
              <div className="hidden md:flex items-center gap-3 ml-3">
                {/* Level Display with Progress Bar */}
                <div
                  className="brutal-border brutal-shadow bg-card rounded-lg px-3 py-1.5 flex items-center gap-2 transform -rotate-[0.5deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer min-w-[120px]"
                  title={`${
                    (user as any)?.stats?.levelName ?? 'Novice Explorer'
                  } - ${(user as any)?.stats?.xpProgress ?? 0}% to next level`}
                  aria-label="Level"
                >
                  <Award className="w-4 h-4 text-purple-500" />
                  <div className="leading-none flex-1">
                    <div className="text-sm font-bold flex items-center gap-1">
                      <span>
                        {t('stats.lvl')} {(user as any)?.stats?.level ?? 1}
                      </span>
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                      {(user as any)?.stats?.levelName ?? 'Novice Explorer'}
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div
                        className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                        style={{
                          width: `${(user as any)?.stats?.xpProgress ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="brutal-border brutal-shadow bg-card rounded-lg px-2 py-1 flex items-center gap-2 transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer"
                  title={`${(user as any)?.stats?.xpPoints ?? 0} XP`}
                  aria-label="XP"
                >
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <div className="leading-none">
                    <div className="text-sm font-bold">
                      {(user as any)?.stats?.xpPoints ?? 0}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t('stats.xp')}
                    </div>
                  </div>
                </div>

                <div
                  className="brutal-border brutal-shadow bg-card rounded-lg px-2 py-1 flex items-center gap-2 transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer"
                  title={`Streak: ${
                    (user as any)?.stats?.currentStreak ?? 0
                  } days`}
                  aria-label="Streak"
                >
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <div className="leading-none">
                    <div className="text-sm font-bold">
                      {(user as any)?.stats?.currentStreak ?? 0}d
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {t('stats.streak')}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <Separator orientation="vertical" className="h-6 mx-2" />

            {/* Subscription Button - Show for users and recruiters */}
            {role !== 'admin' && (
              <>
                <Link to="/subscription">
                  <Button
                    variant="outline-brutal"
                    className="min-w-0 gap-2 bg-primary/10 hover:bg-primary/20 border-primary"
                    title="Manage Subscription"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden lg:inline truncate max-w-[140px]">
                      {t('nav.subscription')}
                    </span>
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-6 mx-2" />
              </>
            )}
            {/* Language Switcher - Circular Button */}
            <Button
              variant="outline-brutal"
              size="icon"
              className="w-10 h-10 rounded-full p-0 flex items-center justify-center font-bold text-xs hover:scale-110 transition-transform"
              onClick={toggleLanguage}
              title={`Switch to ${language === 'en' ? 'Japanese' : 'English'}`}
            >
              {language === 'en' ? 'JP' : 'EN'}
            </Button>

            <div></div>

            <Button
              variant="outline-brutal"
              className="min-w-0 gap-2 group hover:bg-red-600 hover:border-red-700 hover:text-white transition-colors"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="truncate max-w-[120px] block">
                {t('nav.logout')}
              </span>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Stats Bar - only show for regular users */}
        {role === 'user' && (
          <div className="md:hidden flex items-center justify-center gap-2 mt-3 pb-2">
            {/* Level Display - Mobile */}
            <div
              className="brutal-border brutal-shadow bg-card rounded-lg px-3 py-2 flex items-center gap-2 transform -rotate-[0.5deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer flex-1 max-w-[140px]"
              title={`${
                (user as any)?.stats?.levelName ?? 'Novice Explorer'
              } - ${(user as any)?.stats?.xpProgress ?? 0}% to next level`}
              aria-label="Level"
            >
              <Award className="w-4 h-4 text-purple-500 flex-shrink-0" />
              <div className="leading-none flex-1 min-w-0">
                <div className="text-sm font-bold">
                  {t('stats.lvl')} {(user as any)?.stats?.level ?? 1}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div
                    className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                    style={{
                      width: `${(user as any)?.stats?.xpProgress ?? 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* XP - Mobile */}
            <div
              className="brutal-border brutal-shadow bg-card rounded-lg px-3 py-2 flex items-center gap-2 transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer"
              title={`${(user as any)?.stats?.xpPoints ?? 0} XP`}
              aria-label="XP"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <div className="leading-none">
                <div className="text-sm font-bold">
                  {(user as any)?.stats?.xpPoints ?? 0}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {t('stats.xp')}
                </div>
              </div>
            </div>

            {/* Streak - Mobile */}
            <div
              className="brutal-border brutal-shadow bg-card rounded-lg px-3 py-2 flex items-center gap-2 transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer"
              title={`Streak: ${(user as any)?.stats?.currentStreak ?? 0} days`}
              aria-label="Streak"
            >
              <Calendar className="w-4 h-4 text-blue-500" />
              <div className="leading-none">
                <div className="text-sm font-bold">
                  {(user as any)?.stats?.currentStreak ?? 0}d
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {t('stats.streak')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {sidebarOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="md:hidden mt-4 space-y-2 pb-4"
          >
            {navigationItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <item.icon className="w-4 h-4" />
                  {t(item.label)}
                </Button>
              </Link>
            ))}

            {/* Subscription Button - Mobile */}
            {role !== 'admin' && (
              <Link to="/subscription">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <CreditCard className="w-4 h-4" />
                  {t('nav.subscription')}
                </Button>
              </Link>
            )}

            <Button
              variant="outline-brutal"
              className="w-full justify-start gap-2 group hover:bg-red-600 hover:border-red-700 hover:text-white transition-colors"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </Button>

            {/* Language Switcher - Mobile */}
            <Button
              variant="outline-brutal"
              className="w-full justify-start gap-2"
              onClick={toggleLanguage}
              title={`Switch to ${language === 'en' ? 'Japanese' : 'English'}`}
            >
              <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {language === 'en' ? 'JP' : 'EN'}
              </span>
              {language === 'en' ? 'Switch to Japanese' : 'Switch to English'}
            </Button>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
