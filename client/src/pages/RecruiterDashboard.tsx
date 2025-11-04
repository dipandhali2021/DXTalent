import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Home,
  Search,
  Users,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Mail,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [leagueFilter, setLeagueFilter] = useState('all');

  // Mock data
  const mockData = {
    candidates: [
      {
        id: '1',
        name: 'Sarah Johnson',
        username: 'sarahj',
        avatar: '',
        xp: 15200,
        accuracy: 92,
        league: 'Platinum',
        topSkills: ['React', 'TypeScript', 'Node.js'],
        streak: 45,
        badges: 12,
      },
      {
        id: '2',
        name: 'Michael Chen',
        username: 'mchen',
        avatar: '',
        xp: 13800,
        accuracy: 88,
        league: 'Gold',
        topSkills: ['Python', 'Django', 'PostgreSQL'],
        streak: 30,
        badges: 10,
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        username: 'emilyR',
        avatar: '',
        xp: 14500,
        accuracy: 95,
        league: 'Platinum',
        topSkills: ['Vue.js', 'JavaScript', 'CSS'],
        streak: 60,
        badges: 15,
      },
    ],
    skillDemand: [
      { skill: 'React', demand: 85 },
      { skill: 'Python', demand: 78 },
      { skill: 'Node.js', demand: 72 },
      { skill: 'TypeScript', demand: 68 },
      { skill: 'AWS', demand: 65 },
    ],
    weeklyActivity: [
      { week: 'Week 1', learners: 120 },
      { week: 'Week 2', learners: 145 },
      { week: 'Week 3', learners: 160 },
      { week: 'Week 4', learners: 180 },
    ],
    interviews: [
      {
        id: '1',
        candidate: 'Sarah Johnson',
        date: '2025-11-10',
        status: 'pending',
        skill: 'React',
      },
      {
        id: '2',
        candidate: 'Michael Chen',
        date: '2025-11-08',
        status: 'accepted',
        skill: 'Python',
      },
      {
        id: '3',
        candidate: 'Emily Rodriguez',
        date: '2025-11-05',
        status: 'completed',
        skill: 'Vue.js',
      },
    ],
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Talent Search', path: '/talent' },
    { icon: Calendar, label: 'Interviews', path: '/interviews' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-500';
      case 'accepted':
        return 'bg-green-100 text-green-700 border-green-500';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-500';
      case 'expired':
        return 'bg-red-100 text-red-700 border-red-500';
      default:
        return '';
    }
  };

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
              <h1 className="text-2xl font-bold">Recruiter Dashboard 💼</h1>
              <p className="text-sm text-muted-foreground">
                Find and connect with top talent
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Talent Search Section */}
          <Card className="brutal-border brutal-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Talent Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by username or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="brutal-border"
                  />
                </div>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-full md:w-[180px] brutal-border">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="react">React</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="node">Node.js</SelectItem>
                    <SelectItem value="typescript">TypeScript</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={leagueFilter} onValueChange={setLeagueFilter}>
                  <SelectTrigger className="w-full md:w-[180px] brutal-border">
                    <SelectValue placeholder="Filter by league" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Leagues</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="hero" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Candidate Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockData.candidates.map((candidate) => (
              <Card
                key={candidate.id}
                className="brutal-border brutal-shadow hover:scale-[1.02] transition-transform"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Avatar className="brutal-border h-16 w-16">
                      <AvatarImage src={candidate.avatar} />
                      <AvatarFallback className="text-lg">
                        {candidate.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{candidate.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{candidate.username}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="brutal-border">
                      {candidate.league}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        {candidate.xp.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Accuracy</div>
                      <div className="font-bold">{candidate.accuracy}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Streak</div>
                      <div className="font-bold">{candidate.streak} days</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Top Skills
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {candidate.topSkills.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="brutal-border text-xs"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="hero" className="flex-1 gap-2" size="sm">
                      <Mail className="w-4 h-4" />
                      Invite
                    </Button>
                    <Button variant="outline-brutal" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skill Demand Chart */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Trending Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={mockData.skillDemand}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="skill" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '3px solid hsl(var(--border))',
                        borderRadius: '0.75rem',
                      }}
                    />
                    <Bar
                      dataKey="demand"
                      fill="hsl(var(--primary))"
                      stroke="hsl(var(--border))"
                      strokeWidth={2}
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Activity Chart */}
            <Card className="brutal-border brutal-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Active Learners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={mockData.weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                    <XAxis dataKey="week" />
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
                      dataKey="learners"
                      stroke="hsl(var(--accent))"
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Interview Management */}
          <Card className="brutal-border brutal-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Interview Management
                </div>
                <Button variant="hero" size="sm" className="gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Generate Link
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.interviews.map((interview) => (
                    <TableRow key={interview.id}>
                      <TableCell className="font-medium">
                        {interview.candidate}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="brutal-border">
                          {interview.skill}
                        </Badge>
                      </TableCell>
                      <TableCell>{interview.date}</TableCell>
                      <TableCell>
                        <Badge
                          className={`brutal-border ${getStatusColor(
                            interview.status
                          )}`}
                        >
                          {interview.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline-brutal" size="sm">
                          View
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

export default RecruiterDashboard;
