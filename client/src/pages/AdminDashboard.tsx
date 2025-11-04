import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Award,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import DashboardHeader from '@/components/DashboardHeader';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Mock data
  const mockData = {
    stats: {
      totalUsers: 5234,
      activeUsers: 1234,
      totalRevenue: 45700,
      totalLessons: 156,
      retention: 78,
      satisfaction: 92,
    },
    userGrowth: [
      { month: 'Jan', users: 1200 },
      { month: 'Feb', users: 1800 },
      { month: 'Mar', users: 2400 },
      { month: 'Apr', users: 3200 },
      { month: 'May', users: 4100 },
      { month: 'Jun', users: 5300 },
    ],
    revenue: [
      { month: 'Jan', revenue: 12000 },
      { month: 'Feb', revenue: 15000 },
      { month: 'Mar', revenue: 18000 },
      { month: 'Apr', revenue: 22000 },
      { month: 'May', revenue: 28000 },
      { month: 'Jun', revenue: 35000 },
    ],
    recentUsers: [
      {
        id: '1',
        name: 'Sarah Chen',
        time: '2 hours ago',
        role: 'Learner',
      },
      {
        id: '2',
        name: 'TechCorp',
        time: '5 hours ago',
        role: 'Recruiter',
      },
      {
        id: '3',
        name: 'Mike Ross',
        time: '1 day ago',
        role: 'Learner',
      },
    ],
    topLessons: [
      {
        id: '1',
        title: 'React Fundamentals',
        completions: 456,
        avgRating: 4.8,
      },
      {
        id: '2',
        title: 'TypeScript Mastery',
        completions: 389,
        avgRating: 4.9,
      },
      {
        id: '3',
        title: 'Node.js Backend',
        completions: 267,
        avgRating: 4.7,
      },
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Lessons', path: '/admin/lessons' },
    { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <DashboardHeader role="admin" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
          {/* Title Section */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">
              Admin Control Center 🎮
            </h1>
            <p className="text-lg text-muted-foreground">
              Manage your platform like a boss
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rotate-[-1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {mockData.stats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </CardContent>
              </Card>
            </div>

            <div className="rotate-[1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {mockData.stats.activeUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Active Today</p>
                </CardContent>
              </Card>
            </div>

            <div className="rotate-[-1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-secondary border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {mockData.stats.totalLessons}
                  </p>
                  <p className="text-sm text-muted-foreground">Lessons</p>
                </CardContent>
              </Card>
            </div>

            <div className="rotate-[1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    ${(mockData.stats.totalRevenue / 1000).toFixed(1)}K
                  </p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </CardContent>
              </Card>
            </div>

            <div className="rotate-[-1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {mockData.stats.retention}%
                  </p>
                  <p className="text-sm text-muted-foreground">Retention</p>
                </CardContent>
              </Card>
            </div>

            <div className="rotate-[1deg]">
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                    <Award className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <p className="text-2xl font-bold">
                    {mockData.stats.satisfaction}%
                  </p>
                  <p className="text-sm text-muted-foreground">Satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Growth Chart */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  User Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '3px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Chart */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.revenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '3px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="hsl(var(--accent))"
                      stroke="hsl(var(--border))"
                      strokeWidth={2}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Users & Top Lessons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Latest registrations
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockData.recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-muted/50 brutal-border rounded-lg"
                  >
                    <div>
                      <h4 className="font-bold">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {user.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        user.role === 'Recruiter' ? 'default' : 'secondary'
                      }
                      className="brutal-border"
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full brutal-border"
                  onClick={() => navigate('/admin/users')}
                >
                  Manage Users
                </Button>
              </CardContent>
            </Card>

            {/* Top Performing Lessons */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Top Performing Lessons
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Most completed this month
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockData.topLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-4 bg-muted/50 brutal-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold">{lesson.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {lesson.completions} completions
                      </p>
                    </div>
                    <div className="flex items-center gap-1 font-bold">
                      <span className="text-yellow-500">⭐</span>
                      <span>{lesson.avgRating}</span>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full brutal-border"
                  onClick={() => navigate('/admin/lessons')}
                >
                  Manage Lessons
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="hero"
              size="lg"
              className="h-24 flex flex-col gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => navigate('/admin/users')}
            >
              <Users className="w-6 h-6" />
              <span className="text-base font-bold">User Management</span>
            </Button>

            <Button
              variant="hero"
              size="lg"
              className="h-24 flex flex-col gap-2 bg-yellow-400 hover:bg-yellow-500 text-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => navigate('/admin/lessons')}
            >
              <BookOpen className="w-6 h-6" />
              <span className="text-base font-bold">Lesson Editor</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-24 flex flex-col gap-2 bg-white hover:bg-gray-50 text-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => navigate('/admin/payments')}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-base font-bold">Payments</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="h-24 flex flex-col gap-2 bg-white hover:bg-gray-50 text-black border-4 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => navigate('/admin/analytics')}
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-base font-bold">Analytics</span>
            </Button>
          </div> */}

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="rotate-[-1deg]">
              <Button
                variant="hero"
                className="w-full h-24 text-lg flex flex-col gap-2"
              >
                <Users className="w-8 h-8" />
                User Management
              </Button>
            </div>
            <div className="rotate-[1deg]">
              <Button
                variant="accent"
                className="w-full h-24 text-lg flex flex-col gap-2"
              >
                <BookOpen className="w-8 h-8" />
                Lesson Editor
              </Button>
            </div>
            <div className="rotate-[-1deg]">
              <Button
                variant="outline-brutal"
                className="w-full h-24 text-lg flex flex-col gap-2"
              >
                <DollarSign className="w-8 h-8" />
                Payments
              </Button>
            </div>
            <div className="rotate-[1deg]">
              <Button
                variant="outline-brutal"
                className="w-full h-24 text-lg flex flex-col gap-2"
              >
                <TrendingUp className="w-8 h-8" />
                Analytics
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
