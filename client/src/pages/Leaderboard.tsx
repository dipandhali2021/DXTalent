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

interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
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
  icon: any;
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [timeframe, setTimeframe] = useState('weekly');
  const [leaderboardType, setLeaderboardType] = useState('global');
  const [showInsights, setShowInsights] = useState(false);

  // Mock data - replace with actual API calls
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([
    {
      id: '1',
      rank: 1,
      username: 'CodeNinja',
      avatar: '🥷',
      xp: 15420,
      streak: 89,
      accuracy: 96,
      league: 'master',
      skills: ['React', 'TypeScript', 'Node.js'],
      verified: true,
      promotion: null,
      recruiterBadge: true,
      xpGain: 1200,
      previousRank: 1,
    },
    {
      id: '2',
      rank: 2,
      username: 'DevQueen',
      avatar: '👑',
      xp: 14850,
      streak: 75,
      accuracy: 94,
      league: 'master',
      skills: ['Vue', 'Python', 'Docker'],
      verified: true,
      promotion: null,
      recruiterBadge: true,
      xpGain: 890,
      previousRank: 2,
    },
    {
      id: '3',
      rank: 3,
      username: 'TechWizard',
      avatar: '🧙',
      xp: 14230,
      streak: 62,
      accuracy: 95,
      league: 'diamond',
      skills: ['Angular', 'Java', 'AWS'],
      verified: true,
      promotion: 'up',
      xpGain: 1500,
      previousRank: 5,
    },
    {
      id: '4',
      rank: 4,
      username: 'ByteMaster',
      avatar: '⚡',
      xp: 13560,
      streak: 58,
      accuracy: 92,
      league: 'diamond',
      skills: ['React', 'GraphQL'],
      verified: false,
      promotion: 'up',
      xpGain: 780,
      previousRank: 6,
    },
    {
      id: '5',
      rank: 5,
      username: 'PixelPro',
      avatar: '🎨',
      xp: 12890,
      streak: 45,
      accuracy: 90,
      league: 'diamond',
      skills: ['Design', 'Figma'],
      verified: true,
      promotion: 'up',
      xpGain: 650,
      previousRank: 8,
    },
    {
      id: '6',
      rank: 6,
      username: 'DataDragon',
      avatar: '🐉',
      xp: 12340,
      streak: 41,
      accuracy: 91,
      league: 'platinum',
      skills: ['Python', 'SQL'],
      verified: false,
      promotion: null,
      xpGain: 520,
      previousRank: 6,
    },
    {
      id: '7',
      rank: 7,
      username: 'CloudKing',
      avatar: '☁️',
      xp: 11780,
      streak: 38,
      accuracy: 89,
      league: 'platinum',
      skills: ['AWS', 'Azure'],
      verified: true,
      promotion: null,
      xpGain: 430,
      previousRank: 7,
    },
    {
      id: '8',
      rank: 8,
      username: 'APIAce',
      avatar: '🚀',
      xp: 11230,
      streak: 35,
      accuracy: 88,
      league: 'platinum',
      skills: ['REST', 'GraphQL'],
      verified: false,
      promotion: 'down',
      xpGain: 120,
      previousRank: 4,
    },
  ]);

  const aiInsights: AIInsight[] = [
    {
      type: 'performers',
      title: 'Top Performers',
      description:
        'Top 3 users in Marketing improved by 23% this week with React skills.',
      icon: TrendingUp,
    },
    {
      type: 'recommendation',
      title: 'Your Path to Top 10',
      description:
        'Complete 5 more lessons in TypeScript to reach top 10 in Silver League.',
      icon: Target,
    },
    {
      type: 'trending',
      title: 'Trending Skills',
      description:
        'Users focusing on Docker & Kubernetes are climbing 35% faster.',
      icon: Sparkles,
    },
    {
      type: 'prediction',
      title: 'League Prediction',
      description:
        "You're on track to be promoted to Gold League by maintaining current pace.",
      icon: Crown,
    },
  ];

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

  const topThree = leaderboardData.slice(0, 3);
  const restOfLeaderboard = leaderboardData.slice(3);

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

  return (
    <div className="min-h-screen bg-background transition-all duration-1000">
      {/* Dashboard Header */}
      <DashboardHeader role="user" />

      {/* Leaderboard Content */}
      <div className="z-40 bg-background backdrop-blur-sm brutal-border-b shadow-md">
        <div className="container mx-auto px-4 py-4">
          {/* Filters Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <Card className="brutal-border brutal-shadow rotate-[-0.5deg]">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Top Row: AI Insights & Recruiter Mode */}

                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search players..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 brutal-border font-handwritten"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      {/* AI Insights Button */}
                      <Button
                        variant={showInsights ? 'default' : 'outline-brutal'}
                        size="sm"
                        onClick={() => setShowInsights(!showInsights)}
                        className="gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI Insights
                      </Button>
                    </div>

                    {/* Skill Filter Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      {['all', 'React', 'TypeScript', 'Python', 'Node.js'].map(
                        (skill) => (
                          <Button
                            key={skill}
                            variant={
                              selectedSkill === skill ? 'default' : 'outline'
                            }
                            size="sm"
                            onClick={() => setSelectedSkill(skill)}
                            className="capitalize"
                          >
                            {skill === 'all' ? 'All Skills' : skill}
                          </Button>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* League Filter */}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        'all',
                        'master',
                        'diamond',
                        'platinum',
                        'gold',
                        'silver',
                        'bronze',
                      ].map((league) => (
                        <Button
                          key={league}
                          variant={
                            selectedLeague === league ? 'default' : 'outline'
                          }
                          size="sm"
                          onClick={() => setSelectedLeague(league)}
                          className="capitalize"
                        >
                          {league === 'all' ? 'All' : league}
                        </Button>
                      ))}
                    </div>

                    {/* Timeframe Toggle */}
                    <div className="flex gap-2">
                      {['daily', 'weekly', 'all-time'].map((tf) => (
                        <Button
                          key={tf}
                          variant={timeframe === tf ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setTimeframe(tf)}
                          className="capitalize"
                        >
                          {tf === 'all-time' ? 'All Time' : tf}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AI Insights Sidebar */}
          <AnimatePresence>
            {showInsights && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:col-span-1"
              >
                <Card className="brutal-border brutal-shadow sticky top-24">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {aiInsights.map((insight, index) => {
                      const Icon = insight.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 rounded-lg brutal-border bg-card/50 hover:bg-card transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-bold text-sm mb-1">
                                {insight.title}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {insight.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                    <div className="pt-4 border-t">
                      <Badge
                        variant="secondary"
                        className="text-xs bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                      >
                        <Sparkles className="w-3 h-3 mr-1" />
                        Powered by AI
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Updated daily
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaderboard Content */}
          <div className={showInsights ? 'lg:col-span-3' : 'lg:col-span-4'}>
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
                          <div className="w-20 h-20 mx-auto mb-3 border-[4px] border-border rounded-full bg-background flex items-center justify-center text-4xl">
                            {topThree[1].avatar}
                          </div>
                          <Medal className="w-12 h-12 mx-auto text-[hsl(0,0%,75%)] mb-2" />
                          <div className="text-6xl font-bold mb-2">2</div>
                        </div>
                        <h3 className="font-handwritten text-xl font-bold mb-1">
                          {topThree[1].username}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                          <Badge
                            className={getLeagueBadgeColor(topThree[1].league)}
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
                        <Button
                          variant="outline-brutal"
                          size="sm"
                          className="mt-4 w-full"
                          onClick={() => navigate(`/profile/${topThree[1].id}`)}
                        >
                          View Profile
                        </Button>
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
                          <div className="w-24 h-24 mx-auto mb-3 border-[4px] border-border rounded-full bg-background flex items-center justify-center text-5xl shadow-xl">
                            {topThree[0].avatar}
                          </div>
                          <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-2" />
                          <div className="text-7xl font-bold mb-2">1</div>
                        </div>
                        <h3 className="font-handwritten text-2xl font-bold mb-1">
                          {topThree[0].username}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                          <Badge
                            className={getLeagueBadgeColor(topThree[0].league)}
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
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-4 w-full"
                          onClick={() => navigate(`/profile/${topThree[0].id}`)}
                        >
                          View Profile
                        </Button>
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
                          <div className="w-20 h-20 mx-auto mb-3 border-[4px] border-border rounded-full bg-background flex items-center justify-center text-4xl">
                            {topThree[2].avatar}
                          </div>
                          <Award className="w-12 h-12 mx-auto text-amber-700 mb-2" />
                          <div className="text-6xl font-bold mb-2">3</div>
                        </div>
                        <h3 className="font-handwritten text-xl font-bold mb-1">
                          {topThree[2].username}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                          <Badge
                            className={getLeagueBadgeColor(topThree[2].league)}
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
                        <Button
                          variant="outline-brutal"
                          size="sm"
                          className="mt-4 w-full"
                          onClick={() => navigate(`/profile/${topThree[2].id}`)}
                        >
                          View Profile
                        </Button>
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
                    {restOfLeaderboard.map((user, index) => {
                      // Alternate tilt angles for visual interest
                      const tiltAngle =
                        index % 2 === 0 ? 'rotate-[2deg]' : 'rotate-[-2deg]';

                      return (
                        <motion.div
                          key={user.id}
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
                                #{user.rank}
                              </div>
                              {user.previousRank &&
                                user.previousRank !== user.rank && (
                                  <div className="flex items-center">
                                    {user.previousRank > user.rank ? (
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
                                {user.xp.toLocaleString()}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                XP
                              </div>
                              {user.xpGain && (
                                <div className="text-xs text-green-500 flex items-center justify-end">
                                  <Sparkles className="w-3 h-3 mr-1" />+
                                  {user.xpGain}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Avatar & Username */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-16 border-[3px] border-border rounded-full bg-background flex items-center justify-center text-3xl brutal-shadow">
                              {user.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-lg truncate font-handwritten">
                                  {user.username}
                                </h4>
                                {user.verified && (
                                  <Award className="w-4 h-4 text-primary flex-shrink-0" />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* League & Promotion Status */}
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            <Badge
                              className={`${getLeagueBadgeColor(
                                user.league
                              )} text-xs`}
                            >
                              {user.league}
                            </Badge>
                            {user.promotion === 'up' && (
                              <Badge
                                variant="secondary"
                                className="text-green-500 border-green-500 text-xs"
                              >
                                <ArrowUp className="w-3 h-3 mr-1" />
                                Promoted
                              </Badge>
                            )}
                            {user.promotion === 'down' && (
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
                            {user.skills.slice(0, 3).map((skill) => (
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
                              <span className="font-bold">{user.streak}</span>
                              <span className="text-xs text-muted-foreground">
                                days
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-accent" />
                              <span className="font-bold">
                                {user.accuracy}%
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
                                {Math.floor((user.xp % 5000) / 50)}%
                              </span>
                            </div>
                            <Progress
                              value={(user.xp % 5000) / 50}
                              className="h-2"
                            />
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => navigate(`/profile/${user.id}`)}
                              className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
