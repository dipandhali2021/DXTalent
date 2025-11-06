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
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

interface DashboardHeaderProps {
  role?: 'user' | 'recruiter' | 'admin';
}

const DashboardHeader = ({ role = 'user' }: DashboardHeaderProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Define navigation items based on role
  const getNavigationItems = () => {
    switch (role) {
      case 'admin':
        return [
          { to: '/admin/dashboard', icon: Trophy, label: 'Dashboard' },
          { to: '/admin/users', icon: User, label: 'Users' },
          { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter/dashboard', icon: Trophy, label: 'Dashboard' },
          { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
          { to: '/profile', icon: User, label: 'Profile' },
        ];
      default:
        return [
          { to: '/dashboard', icon: Trophy, label: 'Dashboard' },
          { to: '/lessons', icon: BookOpen, label: 'Lessons' },
          { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
          { to: '/profile', icon: User, label: 'Profile' },
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
              src={logo}
              alt="DXTalent"
              className="h-12 md:h-16 ml-2 md:ml-4 object-contain"
            />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant="ghost"
                  className="brutal-border brutal-shadow bg-card rounded-lg px-2 py-1 flex items-center transform rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-100 hover:-translate-y-1 hover:rotate-0 cursor-pointer gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
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
                      <span>Lvl {(user as any)?.stats?.level ?? 1}</span>
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
                    <div className="text-[10px] text-muted-foreground">XP</div>
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
                      Streak
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
                    className="gap-2 bg-primary/10 hover:bg-primary/20 border-primary"
                    title="Manage Subscription"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="hidden lg:inline">Subscription</span>
                  </Button>
                </Link>
                <Separator orientation="vertical" className="h-6 mx-2" />
              </>
            )}

            <Button
              variant="outline-brutal"
              className="gap-2 group hover:bg-red-600 hover:border-red-700 hover:text-white transition-colors"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              Logout
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
                  Lvl {(user as any)?.stats?.level ?? 1}
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
                <div className="text-[10px] text-muted-foreground">XP</div>
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
                <div className="text-[10px] text-muted-foreground">Streak</div>
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
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Subscription Button - Mobile */}
            {role !== 'admin' && (
              <Link to="/subscription">
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <CreditCard className="w-4 h-4" />
                  Subscription
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
              Logout
            </Button>
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
