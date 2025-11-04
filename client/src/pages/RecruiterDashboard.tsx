import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  Search,
  TrendingUp,
  Mail,
  ExternalLink,
  Filter,
  Users,
  Calendar,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
import DashboardHeader from '@/components/DashboardHeader';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <DashboardHeader role="recruiter" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Dashboard Content */}
        <main className="container mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
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

          {/* Main Content Grid: Left (Candidates & Charts) + Right (Invites & Actions) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Side: Candidate Cards & Charts (3/4 width) */}
            <div className="lg:col-span-3 space-y-4">
              {/* Top Candidates Header */}
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Top Candidates
                </h2>
                <p className="text-sm text-muted-foreground">
                  Based on recent activity & performance
                </p>
              </div>

              {/* Candidate Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {mockData.candidates.map((candidate) => (
                  <Card
                    key={candidate.id}
                    className="brutal-border brutal-shadow hover:scale-[1.02] transition-transform"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="brutal-border h-12 w-12">
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback className="text-sm">
                            {candidate.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-bold text-base">
                            {candidate.name}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            @{candidate.username}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="default"
                          className="brutal-border text-xs"
                        >
                          {candidate.league}
                        </Badge>
                        <div className="text-right">
                          <div className="font-bold text-primary text-sm">
                            {candidate.xp.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            XP
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Accuracy
                          </div>
                          <div className="font-bold text-sm">
                            {candidate.accuracy}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">
                            Streak
                          </div>
                          <div className="font-bold text-sm">
                            {candidate.streak} days
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground mb-1.5">
                          Top Skills
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {candidate.topSkills.map((skill, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="brutal-border text-xs py-0"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="hero"
                          className="flex-1 gap-1 text-sm"
                          size="sm"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Invite
                        </Button>
                        <Button variant="outline-brutal" size="sm">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Analytics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skill Demand Chart */}
                <Card className="brutal-border brutal-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="w-4 h-4" />
                      Trending Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={mockData.skillDemand}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="skill" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '3px solid hsl(var(--border))',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
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
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Users className="w-4 h-4" />
                      Active Learners
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={mockData.weeklyActivity}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                        <XAxis dataKey="week" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '3px solid hsl(var(--border))',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="learners"
                          stroke="hsl(var(--accent))"
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--accent))', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Side: Recent Invites & Quick Actions (1/4 width) */}
            <div className="space-y-4">
              {/* Recent Invites (Interview Management) */}
              <Card className="brutal-border brutal-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="w-4 h-4" />
                    Recent Invites
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockData.interviews.map((interview) => (
                    <div
                      key={interview.id}
                      className="p-3 bg-muted/50 brutal-border rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">
                          {interview.candidate}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {interview.date}
                        </p>
                      </div>
                      <Badge
                        className={`brutal-border text-xs ${getStatusColor(
                          interview.status
                        )}`}
                      >
                        {interview.status}
                      </Badge>
                    </div>
                  ))}
                  <Button
                    variant="outline-brutal"
                    className="w-full text-sm"
                    size="sm"
                  >
                    View All Invites
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="brutal-border brutal-shadow bg-yellow-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 brutal-border border-black text-sm py-4"
                    size="sm"
                  >
                    Generate Interview Link
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 brutal-border border-black text-sm py-4"
                    size="sm"
                  >
                    Export Candidates
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
