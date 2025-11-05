import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Medal,
  Award,
  Flame,
  Zap,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Crown,
  Loader2,
  Info,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import LeagueProgressDialog from '@/components/LeagueProgressDialog';
import { leaderboardAPI } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  email?: string;
  avatar: string;
  xp: number;
  streak: number;
  accuracy: number;
  league: string;
  skills: string[];
  verified: boolean;
  promotion?: 'up' | 'down' | null;
  recruiterBadge?: boolean;
  region?: string;
  xpGain?: number;
  previousRank?: number;
}

interface AIInsight {
  type: 'performers' | 'prediction' | 'trending' | 'recommendation';
  title: string;
  description: string;
  icon: string;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [timeframe, setTimeframe] = useState('all-time');
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [showInsights, setShowInsights] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [aiInsights, setAIInsights] = useState<AIInsight[]>([]);
  const [showLeagueDialog, setShowLeagueDialog] = useState(false);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await leaderboardAPI.getLeaderboard({
          league: selectedLeague,
          skill: selectedSkill,
          timeframe,
          limit: 50,
        });

        if (response.success) {
          setLeaderboardData(response.data.leaderboard);
        } else {
          setError(response.message || 'Failed to fetch leaderboard');
        }
      } catch (err: any) {
        console.error('Error fetching leaderboard:', err);
        setError(err.response?.data?.message || 'Failed to fetch leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [selectedLeague, selectedSkill, timeframe]);

  // Fetch AI insights
  useEffect(() => {
    const fetchInsights = async () => {
      if (!showInsights) return;

      try {
        const response = await leaderboardAPI.getInsights();
        if (response.success) {
          setAIInsights(response.data);
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
      }
    };

    fetchInsights();
  }, [showInsights]);

  // Map icon names to components
  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      TrendingUp,
      Target,
      Sparkles,
      Crown,
    };
    return iconMap[iconName] || Sparkles;
  };

  // Avatar helpers
  const isValidImageUrl = (val?: string) => {
    if (!val) return false;
    return /^(https?:)?\/\//i.test(val) || /^data:image\//i.test(val);
  };

  const renderAvatar = (
    avatar: string | undefined,
    username: string,
    sizeClass = 'h-10 w-10'
  ) => {
    if (isValidImageUrl(avatar)) {
      return (
        <Avatar
          className={`${sizeClass} border-[4px] border-border rounded-full bg-background`}
        >
          <AvatarImage src={avatar} alt={username} />
          <AvatarFallback>
            {username?.charAt(0)?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      );
    }

    // If avatar is a short emoji or character, show it in fallback
    return (
      <Avatar
        className={`${sizeClass} border-[4px] border-border rounded-full bg-background flex items-center justify-center text-4xl`}
      >
        <AvatarFallback className="text-3xl">
          {avatar || username?.charAt(0)?.toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    );
  };

  const getLeagueBadgeColor = (league: string) => {
    const colors: { [key: string]: string } = {
      master: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
      diamond: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600',
      platinum: 'bg-blue-400 hover:bg-blue-500 text-white border-blue-500',
      gold: 'bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-600',
      silver: 'bg-gray-400 hover:bg-gray-500 text-black border-gray-500',
      bronze: 'bg-amber-700 hover:bg-amber-800 text-white border-amber-800',
    };
    return colors[league] || 'bg-gray-500';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-300 via-yellow-400 to-yellow-500';
    if (rank === 2) return 'from-gray-300 via-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 via-amber-700 to-amber-800';
    return 'from-background to-muted';
  };

  const getLeagueGradient = (league: string) => {
    const gradients: { [key: string]: string } = {
      master: 'from-purple-900 via-purple-800 to-indigo-900',
      diamond: 'from-cyan-900 via-blue-900 to-indigo-900',
      platinum: 'from-blue-900 via-slate-800 to-gray-900',
      gold: 'from-yellow-900 via-amber-900 to-orange-900',
      silver: 'from-gray-800 via-slate-800 to-zinc-900',
      bronze: 'from-amber-900 via-orange-900 to-red-900',
    };
    return gradients[league] || 'from-background to-muted';
  };

  // Apply all filters to leaderboard data
  const filteredData = leaderboardData.filter((user) => {
    const matchesSearch = user.username
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesLeague =
      selectedLeague === 'all' || user.league === selectedLeague;
    const matchesSkill =
      selectedSkill === 'all' || user.skills.includes(selectedSkill);
    return matchesSearch && matchesLeague && matchesSkill;
  });

  const topThree = filteredData.slice(0, 3);
  const restOfLeaderboard = filteredData.slice(3);

  return (
    <div className="min-h-screen bg-background transition-all duration-1000">
      {/* Dashboard Header */}
      <DashboardHeader
        role={(user?.role as 'user' | 'recruiter' | 'admin') || 'user'}
      />

      {/* Leaderboard Heading */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-handwritten mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
            Leaderboard
            <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-500" />
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Compete with learners worldwide and climb to the top!
          </p>
        </motion.div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full lg:w-64 flex-shrink-0"
          >
            <Card className="brutal-border brutal-shadow sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="w-5 h-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* League Info Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline-brutal"
                    size="sm"
                    onClick={() => setShowLeagueDialog(true)}
                    className="w-full gap-2"
                  >
                    <Info className="w-4 h-4" />
                    My League Info
                  </Button>
                </div>
                {/* Search */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search players..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 brutal-border"
                    />
                  </div>
                </div>

                {/* League Filter */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    League
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'all', label: 'All Leagues' },
                      { value: 'master', label: 'Master' },
                      { value: 'diamond', label: 'Diamond' },
                      { value: 'platinum', label: 'Platinum' },
                      { value: 'gold', label: 'Gold' },
                      { value: 'silver', label: 'Silver' },
                      { value: 'bronze', label: 'Bronze' },
                    ].map((league) => (
                      <Button
                        key={league.value}
                        variant={
                          selectedLeague === league.value
                            ? 'default'
                            : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedLeague(league.value)}
                        className="w-full justify-start capitalize"
                      >
                        {league.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Skill Filter */}
                <div>
                  <label className="text-sm font-semibold mb-2 block">
                    Skills
                  </label>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'all', label: 'All Skills' },
                      { value: 'Marketing', label: 'Marketing' },
                      { value: 'Development', label: 'Development' },
                      { value: 'Data', label: 'Data' },
                      { value: 'Business', label: 'Business' },
                      { value: 'Design', label: 'Design' },
                      { value: 'Other', label: 'Other' },
                    ].map((skill) => (
                      <Button
                        key={skill.value}
                        variant={
                          selectedSkill === skill.value ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => setSelectedSkill(skill.value)}
                        className="w-full justify-start"
                      >
                        {skill.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Filter Results Info */}
                {(searchQuery ||
                  selectedLeague !== 'all' ||
                  selectedSkill !== 'all') && (
                  <div className="pt-4 border-t border-border space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Showing </span>
                      <span className="font-bold text-foreground">
                        {filteredData.length}
                      </span>
                      <span className="text-muted-foreground">
                        {' '}
                        {filteredData.length === 1 ? 'player' : 'players'}
                      </span>
                    </div>
                    <Button
                      variant="outline-brutal"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedLeague('all');
                        setSelectedSkill('all');
                      }}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Content - Leaderboard */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading leaderboard...</p>
              </div>
            ) : error ? (
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-8 text-center">
                  <p className="text-destructive mb-4">{error}</p>
                  <Button
                    onClick={() => window.location.reload()}
                    variant="outline-brutal"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : leaderboardData.length === 0 ? (
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No leaderboard data available yet. Complete some lessons to
                    appear on the leaderboard!
                  </p>
                </CardContent>
              </Card>
            ) : filteredData.length === 0 ? (
              <Card className="brutal-border brutal-shadow">
                <CardContent className="p-8 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold mb-2">No Results Found</h3>
                  <p className="text-muted-foreground mb-4">
                    No players match your current filters. Try adjusting your
                    search criteria.
                  </p>
                  <Button
                    variant="outline-brutal"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLeague('all');
                      setSelectedSkill('all');
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Top 3 Podium */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mb-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {/* 2nd Place */}
                    {topThree[1] && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="md:order-1 md:mt-12"
                      >
                        <Card
                          className={`brutal-border brutal-shadow-lg rotate-[-2deg] hover:rotate-0 transition-transform bg-gradient-to-br ${getRankColor(
                            2
                          )}`}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="mb-4">
                              <div className="mx-auto mb-3 flex items-center justify-center">
                                {renderAvatar(
                                  topThree[1].avatar,
                                  topThree[1].username,
                                  'w-20 h-20'
                                )}
                              </div>
                              <Medal className="w-12 h-12 mx-auto text-[hsl(0,0%,75%)] mb-2" />
                              <div className="text-6xl font-bold mb-2">2</div>
                            </div>
                            <h3 className="font-handwritten text-xl font-bold mb-1">
                              {topThree[1].username}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                              <Badge
                                className={getLeagueBadgeColor(
                                  topThree[1].league
                                )}
                              >
                                {topThree[1].league}
                              </Badge>
                              {topThree[1].verified && (
                                <Award className="w-4 h-4 text-primary" />
                              )}
                              {topThree[1].promotion === 'up' && (
                                <Badge
                                  variant="secondary"
                                  className="text-green-500 border-green-500 text-xs"
                                >
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                  Promoted
                                </Badge>
                              )}
                              {topThree[1].promotion === 'down' && (
                                <Badge
                                  variant="secondary"
                                  className="text-red-500 border-red-500 text-xs"
                                >
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                  At Risk
                                </Badge>
                              )}
                            </div>
                            <p className="font-handwritten text-2xl font-bold mb-2">
                              {topThree[1].xp.toLocaleString()} XP
                            </p>
                            <div className="flex justify-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Flame className="w-4 h-4 text-destructive" />
                                <span>{topThree[1].streak}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-accent" />
                                <span>{topThree[1].accuracy}%</span>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1 justify-center">
                              {topThree[1].skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              {(user?.role === 'recruiter' ||
                                user?.role === 'admin') && (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  className="flex-1 gap-1"
                                  onClick={() => {
                                    const subject = encodeURIComponent(
                                      'Interview Invitation - DXTalent'
                                    );
                                    const body = encodeURIComponent(
                                      `Hi ${topThree[1].username},\n\nWe're impressed by your performance on DXTalent and would like to invite you for an interview.\n\nBest regards`
                                    );
                                    window.open(
                                      `https://mail.google.com/mail/?view=cm&fs=1&to=${topThree[1].email}&su=${subject}&body=${body}`,
                                      '_blank'
                                    );
                                  }}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Invite
                                </Button>
                              )}
                              <Button
                                variant="outline-brutal"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  navigate(`/profile/${topThree[1].id}`)
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* 1st Place */}
                    {topThree[0] && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="md:order-2"
                      >
                        <Card
                          className={`brutal-border brutal-shadow-xl scale-105 bg-gradient-to-br ${getRankColor(
                            1
                          )} relative overflow-hidden`}
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 animate-pulse" />
                          <Crown className="absolute top-4 right-4 w-8 h-8 text-yellow-500 animate-bounce" />
                          <CardContent className="p-8 text-center">
                            <div className="mb-4">
                              <div className="mx-auto mb-3 flex items-center justify-center">
                                {renderAvatar(
                                  topThree[0].avatar,
                                  topThree[0].username,
                                  'w-24 h-24'
                                )}
                              </div>
                              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-2" />
                              <div className="text-7xl font-bold mb-2">1</div>
                            </div>
                            <h3 className="font-handwritten text-2xl font-bold mb-1">
                              {topThree[0].username}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                              <Badge
                                className={getLeagueBadgeColor(
                                  topThree[0].league
                                )}
                              >
                                {topThree[0].league}
                              </Badge>
                              {topThree[0].verified && (
                                <Award className="w-5 h-5 text-primary" />
                              )}
                              {topThree[0].promotion === 'up' && (
                                <Badge
                                  variant="secondary"
                                  className="text-green-500 border-green-500"
                                >
                                  <ArrowUp className="w-4 h-4 mr-1" />
                                  Promoted
                                </Badge>
                              )}
                              {topThree[0].promotion === 'down' && (
                                <Badge
                                  variant="secondary"
                                  className="text-red-500 border-red-500"
                                >
                                  <ArrowDown className="w-4 h-4 mr-1" />
                                  At Risk
                                </Badge>
                              )}
                            </div>
                            <p className="font-handwritten text-3xl font-bold mb-3">
                              {topThree[0].xp.toLocaleString()} XP
                            </p>
                            <div className="flex justify-center gap-6 text-lg mb-4">
                              <div className="flex items-center gap-2">
                                <Flame className="w-5 h-5 text-destructive" />
                                <span className="font-bold">
                                  {topThree[0].streak}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-accent" />
                                <span className="font-bold">
                                  {topThree[0].accuracy}%
                                </span>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                              {topThree[0].skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              {(user?.role === 'recruiter' ||
                                user?.role === 'admin') && (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  className="flex-1 gap-1"
                                  onClick={() => {
                                    const subject = encodeURIComponent(
                                      'Interview Invitation - DXTalent'
                                    );
                                    const body = encodeURIComponent(
                                      `Hi ${topThree[0].username},\n\nWe're impressed by your performance on DXTalent and would like to invite you for an interview.\n\nBest regards`
                                    );
                                    window.open(
                                      `https://mail.google.com/mail/?view=cm&fs=1&to=${topThree[0].email}&su=${subject}&body=${body}`,
                                      '_blank'
                                    );
                                  }}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Invite
                                </Button>
                              )}
                              <Button
                                variant="default"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  navigate(`/profile/${topThree[0].id}`)
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}

                    {/* 3rd Place */}
                    {topThree[2] && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="md:order-3 md:mt-12"
                      >
                        <Card
                          className={`brutal-border brutal-shadow-lg rotate-[2deg] hover:rotate-0 transition-transform bg-gradient-to-br ${getRankColor(
                            3
                          )}`}
                        >
                          <CardContent className="p-6 text-center">
                            <div className="mb-4">
                              <div className="mx-auto mb-3 flex items-center justify-center">
                                {renderAvatar(
                                  topThree[2].avatar,
                                  topThree[2].username,
                                  'w-20 h-20'
                                )}
                              </div>
                              <Award className="w-12 h-12 mx-auto text-amber-700 mb-2" />
                              <div className="text-6xl font-bold mb-2">3</div>
                            </div>
                            <h3 className="font-handwritten text-xl font-bold mb-1">
                              {topThree[2].username}
                            </h3>
                            <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                              <Badge
                                className={getLeagueBadgeColor(
                                  topThree[2].league
                                )}
                              >
                                {topThree[2].league}
                              </Badge>
                              {topThree[2].verified && (
                                <Award className="w-4 h-4 text-primary" />
                              )}
                              {topThree[2].promotion === 'up' && (
                                <Badge
                                  variant="secondary"
                                  className="text-green-500 border-green-500 text-xs"
                                >
                                  <ArrowUp className="w-3 h-3 mr-1" />
                                  Promoted
                                </Badge>
                              )}
                              {topThree[2].promotion === 'down' && (
                                <Badge
                                  variant="secondary"
                                  className="text-red-500 border-red-500 text-xs"
                                >
                                  <ArrowDown className="w-3 h-3 mr-1" />
                                  At Risk
                                </Badge>
                              )}
                            </div>
                            <p className="font-handwritten text-2xl font-bold mb-2">
                              {topThree[2].xp.toLocaleString()} XP
                            </p>
                            <div className="flex justify-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Flame className="w-4 h-4 text-destructive" />
                                <span>{topThree[2].streak}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-accent" />
                                <span>{topThree[2].accuracy}%</span>
                              </div>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-1 justify-center">
                              {topThree[2].skills.slice(0, 3).map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              {(user?.role === 'recruiter' ||
                                user?.role === 'admin') && (
                                <Button
                                  variant="hero"
                                  size="sm"
                                  className="flex-1 gap-1"
                                  onClick={() => {
                                    const subject = encodeURIComponent(
                                      'Interview Invitation - DXTalent'
                                    );
                                    const body = encodeURIComponent(
                                      `Hi ${topThree[2].username},\n\nWe're impressed by your performance on DXTalent and would like to invite you for an interview.\n\nBest regards`
                                    );
                                    window.open(
                                      `https://mail.google.com/mail/?view=cm&fs=1&to=${topThree[2].email}&su=${subject}&body=${body}`,
                                      '_blank'
                                    );
                                  }}
                                >
                                  <Mail className="w-3.5 h-3.5" />
                                  Invite
                                </Button>
                              )}
                              <Button
                                variant="outline-brutal"
                                size="sm"
                                className="flex-1"
                                onClick={() =>
                                  navigate(`/profile/${topThree[2].id}`)
                                }
                              >
                                View Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Rest of Leaderboard */}
                <Card className="brutal-border brutal-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>All Rankings</span>
                      <Badge variant="secondary">
                        {filteredData.length} Players
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Grid Container - 4 per row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      <AnimatePresence>
                        {restOfLeaderboard.map((leaderboardUser, index) => {
                          // Alternate tilt angles for visual interest
                          const tiltAngle =
                            index % 2 === 0
                              ? 'rotate-[2deg]'
                              : 'rotate-[-2deg]';

                          return (
                            <motion.div
                              key={leaderboardUser.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`w-full p-4 rounded-lg brutal-border brutal-shadow-lg bg-card hover:bg-accent/5 transition-all duration-300 group ${tiltAngle} hover:rotate-0 hover:scale-105`}
                            >
                              {/* Rank Badge - Top Corner */}
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="text-3xl font-bold text-primary">
                                    #{leaderboardUser.rank}
                                  </div>
                                  {leaderboardUser.previousRank &&
                                    leaderboardUser.previousRank !==
                                      leaderboardUser.rank && (
                                      <div className="flex items-center">
                                        {leaderboardUser.previousRank >
                                        leaderboardUser.rank ? (
                                          <ArrowUp className="w-4 h-4 text-green-500" />
                                        ) : (
                                          <ArrowDown className="w-4 h-4 text-red-500" />
                                        )}
                                      </div>
                                    )}
                                </div>

                                {/* XP Display */}
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-primary">
                                    {leaderboardUser.xp.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    XP
                                  </div>
                                  {leaderboardUser.xpGain && (
                                    <div className="text-xs text-green-500 flex items-center justify-end">
                                      <Sparkles className="w-3 h-3 mr-1" />+
                                      {leaderboardUser.xpGain}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Avatar & Username */}
                              <div className="flex items-center gap-3 mb-3">
                                {renderAvatar(
                                  leaderboardUser.avatar,
                                  leaderboardUser.username,
                                  'w-16 h-16'
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-lg truncate font-handwritten">
                                      {leaderboardUser.username}
                                    </h4>
                                    {leaderboardUser.verified && (
                                      <Award className="w-4 h-4 text-primary flex-shrink-0" />
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* League & Promotion Status */}
                              <div className="flex items-center gap-2 flex-wrap mb-3">
                                <Badge
                                  className={`${getLeagueBadgeColor(
                                    leaderboardUser.league
                                  )} text-xs`}
                                >
                                  {leaderboardUser.league}
                                </Badge>
                                {leaderboardUser.promotion === 'up' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-green-500 border-green-500 text-xs"
                                  >
                                    <ArrowUp className="w-3 h-3 mr-1" />
                                    Promoted
                                  </Badge>
                                )}
                                {leaderboardUser.promotion === 'down' && (
                                  <Badge
                                    variant="secondary"
                                    className="text-red-500 border-red-500 text-xs"
                                  >
                                    <ArrowDown className="w-3 h-3 mr-1" />
                                    At Risk
                                  </Badge>
                                )}
                              </div>

                              {/* Skills */}
                              <div className="flex gap-2 mb-3 flex-wrap">
                                {leaderboardUser.skills
                                  .slice(0, 3)
                                  .map((skill) => (
                                    <Badge
                                      key={skill}
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {skill}
                                    </Badge>
                                  ))}
                              </div>

                              {/* Stats Row */}
                              <div className="flex justify-between items-center mb-3 p-2 bg-muted/30 rounded-lg">
                                <div className="flex items-center gap-1">
                                  <Flame className="w-4 h-4 text-destructive" />
                                  <span className="font-bold">
                                    {leaderboardUser.streak}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    days
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="w-4 h-4 text-accent" />
                                  <span className="font-bold">
                                    {leaderboardUser.accuracy}%
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    acc
                                  </span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mb-3">
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="text-muted-foreground">
                                    Progress to next league
                                  </span>
                                  <span className="font-bold">
                                    {Math.floor(
                                      (leaderboardUser.xp % 5000) / 50
                                    )}
                                    %
                                  </span>
                                </div>
                                <Progress
                                  value={(leaderboardUser.xp % 5000) / 50}
                                  className="h-2"
                                />
                              </div>

                              {/* Action Buttons */}
                              <div className="space-y-2">
                                {(user?.role === 'recruiter' ||
                                  user?.role === 'admin') && (
                                  <Button
                                    variant="hero"
                                    size="sm"
                                    onClick={() => {
                                      const subject = encodeURIComponent(
                                        'Interview Invitation - DXTalent'
                                      );
                                      const body = encodeURIComponent(
                                        `Hi ${leaderboardUser.username},\n\nWe're impressed by your performance on DXTalent and would like to invite you for an interview.\n\nBest regards`
                                      );
                                      window.open(
                                        `https://mail.google.com/mail/?view=cm&fs=1&to=${leaderboardUser.email}&su=${subject}&body=${body}`,
                                        '_blank'
                                      );
                                    }}
                                    className="w-full transition-opacity gap-1"
                                  >
                                    <Mail className="w-3.5 h-3.5" />
                                    Invite
                                  </Button>
                                )}
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/profile/${leaderboardUser.id}`)
                                  }
                                  className="w-full transition-opacity"
                                >
                                  View Profile
                                </Button>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>

      {/* League Progress Dialog */}
      <LeagueProgressDialog
        open={showLeagueDialog}
        onOpenChange={setShowLeagueDialog}
      />
    </div>
  );
};

export default Leaderboard;
