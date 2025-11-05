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
} from 'lucide-react';
import { Zap, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

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
          { to: '/admin/lessons', icon: BookOpen, label: 'Lessons' },
          { to: '/admin/settings', icon: Settings, label: 'Settings' },
        ];
      case 'recruiter':
        return [
          { to: '/recruiter/dashboard', icon: Trophy, label: 'Dashboard' },
          { to: '/recruiter/candidates', icon: User, label: 'Candidates' },
          { to: '/recruiter/jobs', icon: BookOpen, label: 'Jobs' },
          { to: '/recruiter/settings', icon: Settings, label: 'Settings' },
        ];
      default:
        return [
          { to: '/lessons', icon: BookOpen, label: 'Lessons' },
          { to: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
          { to: '/profile', icon: User, label: 'Profile' },
          { to: '/#', icon: Settings, label: 'Settings' },
          { to: '/dashboard', icon: Trophy, label: 'Dashboard' },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <header className="sticky top-0 z-50 bg-card brutal-border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Title */}
          <Link to="/" aria-label="Home" className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">DXTalent</h2>
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
            {/* Compact XP & Streak - restyled */}
            <div className="hidden md:flex items-center gap-3 ml-3">
              <div
                className="brutal-border brutal-shadow bg-card rounded-lg px-2 py-1 flex items-center gap-2 transform -rotate-[1deg] transition-transform duration-200 ease-in-out hover:scale-105 hover:-translate-y-1 hover:rotate-0 cursor-pointer"
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
                title={`Streak: ${(user as any)?.streak ?? 0} days`}
                aria-label="Streak"
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                <div className="leading-none">
                  <div className="text-sm font-bold">
                    {(user as any)?.streak ?? 0}d
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    Streak
                  </div>
                </div>
              </div>
            </div>
            <Separator orientation="vertical" className="h-6 mx-2" />
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
