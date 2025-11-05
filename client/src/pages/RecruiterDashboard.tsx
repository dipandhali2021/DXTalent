import { useState, useEffect } from 'react';
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
import { recruiterAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [leagueFilter, setLeagueFilter] = useState('all');

  // State for real data
  const [candidates, setCandidates] = useState<any[]>([]);
  const [trendingSkills, setTrendingSkills] = useState<any[]>([]);
  const [weeklyActivity, setWeeklyActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all data in parallel
        const [candidatesRes, skillsRes, activityRes] = await Promise.all([
          recruiterAPI.getTopCandidates({ limit: 50 }), // Fetch more for filtering
          recruiterAPI.getTrendingSkills({ limit: 5, days: 30 }),
          recruiterAPI.getActiveLearners({ weeks: 4 }),
        ]);

        if (candidatesRes.success) {
          setCandidates(candidatesRes.data.candidates || []);
        }

        if (skillsRes.success) {
          setTrendingSkills(skillsRes.data.trendingSkills || []);
        }

        if (activityRes.success) {
          setWeeklyActivity(activityRes.data.weeklyActivity || []);
        }
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: '❌ Error',
          description: 'Failed to load dashboard data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Apply filters and search
  const applyFilters = () => {
    let filtered = [...candidates];

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((candidate) => {
        const nameMatch = candidate.name?.toLowerCase().includes(query);
        const usernameMatch = candidate.username?.toLowerCase().includes(query);
        const skillsMatch = candidate.topSkills?.some((skill: string) =>
          skill.toLowerCase().includes(query)
        );
        return nameMatch || usernameMatch || skillsMatch;
      });
    }

    // Apply skill/category filter
    if (skillFilter !== 'all') {
      filtered = filtered.filter((candidate) =>
        candidate.topSkills?.some(
          (skill: string) => skill.toLowerCase() === skillFilter.toLowerCase()
        )
      );
    }

    // Apply league filter
    if (leagueFilter !== 'all') {
      filtered = filtered.filter(
        (candidate) =>
          candidate.league?.toLowerCase() === leagueFilter.toLowerCase()
      );
    }

    return filtered;
  };

  // Get filtered candidates
  const filteredCandidates = applyFilters();

  // Display top 3 filtered candidates
  const displayedCandidates = filteredCandidates.slice(0, 3);

  // Mock data for interviews (this can be replaced with real data later)
  const mockData = {
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
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Talent Search
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by username or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="brutal-border"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        // Trigger re-render by updating state
                        setSearchQuery(e.currentTarget.value);
                      }
                    }}
                  />
                </div>
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger className="w-full md:w-[180px] brutal-border">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
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
                    <SelectItem value="bronze">Bronze</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="hero"
                  className="gap-2"
                  onClick={() => {
                    // Reset all filters
                    setSearchQuery('');
                    setSkillFilter('all');
                    setLeagueFilter('all');
                  }}
                >
                  Reset
                </Button>
              </div>
              {(searchQuery ||
                skillFilter !== 'all' ||
                leagueFilter !== 'all') && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    Showing {filteredCandidates.length} result
                    {filteredCandidates.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content: Full Width for Candidates & Charts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              {/* Top Candidates Header */}
              <div className="space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold">
                  {searchQuery ||
                  skillFilter !== 'all' ||
                  leagueFilter !== 'all'
                    ? 'Search Results'
                    : 'Top Candidates'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ||
                  skillFilter !== 'all' ||
                  leagueFilter !== 'all'
                    ? `Found ${filteredCandidates.length} matching candidate${
                        filteredCandidates.length !== 1 ? 's' : ''
                      }`
                    : 'Based on recent activity & performance'}
                </p>
              </div>
              {/* View All Link */}
              <div className="flex justify-center">
                <Button
                  variant="outline-brutal"
                  className="gap-2"
                  onClick={() => navigate('/leaderboard')}
                >
                  Leaderboard
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Candidate Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Loading candidates...</p>
                </div>
              ) : displayedCandidates.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ||
                    skillFilter !== 'all' ||
                    leagueFilter !== 'all'
                      ? 'No candidates found matching your search criteria. Try adjusting your filters.'
                      : 'No candidates found'}
                  </p>
                  {(searchQuery ||
                    skillFilter !== 'all' ||
                    leagueFilter !== 'all') && (
                    <Button
                      variant="outline-brutal"
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery('');
                        setSkillFilter('all');
                        setLeagueFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                displayedCandidates.map((candidate) => (
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
                          {candidate.topSkills &&
                          candidate.topSkills.length > 0 ? (
                            candidate.topSkills.map((skill, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="brutal-border text-xs py-0 bg-yellow-300 text-black hover:bg-yellow-400"
                              >
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              No skills yet
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="hero"
                          className="flex-1 gap-1 text-sm"
                          size="sm"
                          onClick={() => {
                            const subject = encodeURIComponent(
                              'Interview Invitation - DXTalent'
                            );
                            const body = encodeURIComponent(
                              `Hi ${candidate.name},\n\nWe're impressed by your performance on DXTalent and would like to invite you for an interview.\n\nBest regards`
                            );
                            window.open(
                              `https://mail.google.com/mail/?view=cm&fs=1&to=${candidate.email}&su=${subject}&body=${body}`,
                              '_blank'
                            );
                          }}
                        >
                          <Mail className="w-3.5 h-3.5" />
                          Invite
                        </Button>
                        <Button
                          variant="outline-brutal"
                          size="sm"
                          onClick={() => navigate(`/profile/${candidate.id}`)}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
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
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">
                        Loading...
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={trendingSkills}>
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
                  )}
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
                  {loading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">
                        Loading...
                      </p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={weeklyActivity}>
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
                  )}
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
