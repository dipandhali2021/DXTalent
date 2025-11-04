import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Home,
  Users,
  BookOpen,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Activity,
  UserCheck,
  Award,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data
  const mockData = {
    stats: {
      totalUsers: 15420,
      activeUsers: 8932,
      totalRevenue: 125000,
      totalLessons: 456,
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
    userRoles: [
      { name: 'Learners', value: 12000, color: '#3B82F6' },
      { name: 'Recruiters', value: 3000, color: '#10B981' },
      { name: 'Admins', value: 420, color: '#F59E0B' },
    ],
    recentUsers: [
      {
        id: '1',
        username: 'john_doe',
        email: 'john@example.com',
        role: 'user',
        status: 'active',
        joinDate: '2025-11-01',
      },
      {
        id: '2',
        username: 'jane_smith',
        email: 'jane@example.com',
        role: 'recruiter',
        status: 'active',
        joinDate: '2025-11-02',
      },
      {
        id: '3',
        username: 'bob_wilson',
        email: 'bob@example.com',
        role: 'user',
        status: 'pending',
        joinDate: '2025-11-03',
      },
    ],
    topLessons: [
      {
        id: '1',
        title: 'Introduction to React',
        completions: 1250,
        avgRating: 4.8,
      },
      {
        id: '2',
        title: 'Python Fundamentals',
        completions: 980,
        avgRating: 4.6,
      },
      {
        id: '3',
        title: 'Advanced TypeScript',
        completions: 750,
        avgRating: 4.9,
      },
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Lessons', path: '/admin/lessons' },
    { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen || window.innerWidth >= 1024 ? 0 : -300 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card brutal-border-r p-6 space-y-6 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">DXTalent</h2>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <Separator className="bg-border" />

        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 hover:bg-primary/10"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <Separator className="bg-border" />

        <Button
          variant="outline-brutal"
          className="w-full gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card brutal-border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard ⚙️</h1>
              <p className="text-sm text-muted-foreground">
                Platform management & analytics
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="brutal-border brutal-shadow bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <h3 className="text-3xl font-bold text-primary">
                      {mockData.stats.totalUsers.toLocaleString()}
                    </h3>
                  </div>
                  <Users className="w-12 h-12 text-primary opacity-50" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-border brutal-shadow bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Users
                    </p>
                    <h3 className="text-3xl font-bold text-green-600">
                      {mockData.stats.activeUsers.toLocaleString()}
                    </h3>
                  </div>
                  <Activity className="w-12 h-12 text-green-600 opacity-50" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-border brutal-shadow bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Revenue
                    </p>
                    <h3 className="text-3xl font-bold text-yellow-700">
                      ${mockData.stats.totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                  <DollarSign className="w-12 h-12 text-yellow-700 opacity-50" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+25% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="brutal-border brutal-shadow bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Lessons
                    </p>
                    <h3 className="text-3xl font-bold text-purple-600">
                      {mockData.stats.totalLessons}
                    </h3>
                  </div>
                  <BookOpen className="w-12 h-12 text-purple-600 opacity-50" />
                </div>
                <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>+15% from last month</span>
                </div>
              </CardContent>
            </Card>
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

          {/* User Distribution & Recent Users */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Roles Pie Chart */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={mockData.userRoles}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mockData.userRoles.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                          stroke="hsl(var(--border))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent Users */}
            <Card className="lg:col-span-2 brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Join Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockData.recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.username}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="brutal-border">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`brutal-border ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-700 border-green-500'
                                : 'bg-yellow-100 text-yellow-700 border-yellow-500'
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Top Lessons */}
          <Card className="brutal-border brutal-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Top Performing Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lesson Title</TableHead>
                    <TableHead>Completions</TableHead>
                    <TableHead>Avg Rating</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.topLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {lesson.title}
                      </TableCell>
                      <TableCell>
                        {lesson.completions.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="font-bold">{lesson.avgRating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline-brutal" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
