import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SkillChart } from '@/components/dashboard/SkillChart';
import { StreakHeatmap } from '@/components/dashboard/StreakHeatmap';
import { ChallengeCard } from '@/components/dashboard/ChallengeCard';
import { LeaderboardCard } from '@/components/dashboard/LeaderboardCard';
import { AILessonSuggestions } from '@/components/dashboard/AILessonSuggestions';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Brain, Calendar, Trophy, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import api, { badgeAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useBadgeNotifications } from '@/hooks/use-badge-notifications';
import BadgeGrid from '@/components/BadgeGrid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const LearnerDashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { checkForNewBadges } = useBadgeNotifications();
  const [activityData, setActivityData] = useState<
    { date: string; count: number }[]
  >([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [weeklyXP, setWeeklyXP] = useState<{ day: string; xp: number }[]>([]);
  const [skillData, setSkillData] = useState<
    { skill: string; proficiency: number }[]
  >([]);
  const [leaderboardData, setLeaderboardData] = useState<
    Array<{
      id: string;
      username: string;
      xp: number;
      league: string;
      rank: number;
    }>
  >([]);
  const [challenges, setChallenges] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      progress: number;
      total: number;
      xpReward: number;
      type: 'daily' | 'weekly';
      completed: boolean;
      claimed?: boolean;
    }>
  >([]);
  const [aiRecommendation, setAiRecommendation] = useState<{
    lessonId: string;
    title: string;
    category: string;
    difficulty: string;
    estimatedTime: string;
    xpReward: number;
    reason: string;
  } | null>(null);
  const [loadingRecommendation, setLoadingRecommendation] = useState(true);
  const [lastLesson, setLastLesson] = useState<{
    lessonId: string;
    title: string;
    topic?: string;
    progress: number;
    isFirst?: boolean;
    isCompleted?: boolean;
    message?: string;
  } | null>(null);
  const [loadingContinueJourney, setLoadingContinueJourney] = useState(true);
  const [badges, setBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [badgeDialogOpen, setBadgeDialogOpen] = useState(false);

  // Fetch user activity data for selected month
  useEffect(() => {
    const fetchActivityData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/lessons/activity?month=${selectedMonth}&year=${selectedYear}`
        );
        if (response.data.success) {
          setActivityData(response.data.data.activity);
          setCurrentStreak(response.data.data.currentStreak);
          setLongestStreak(response.data.data.longestStreak);
        }
      } catch (error) {
        console.error('Error fetching activity data:', error);
        // Set empty activity data on error
        setActivityData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityData();
  }, [selectedMonth, selectedYear]);

  // Fetch user statistics (weekly XP and skill proficiency)
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.get('/lessons/user-stats');
        if (response.data.success) {
          setWeeklyXP(response.data.data.weeklyXP);
          setSkillData(response.data.data.skillData);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Set default data on error
        setWeeklyXP([
          { day: 'Sun', xp: 0 },
          { day: 'Mon', xp: 0 },
          { day: 'Tue', xp: 0 },
          { day: 'Wed', xp: 0 },
          { day: 'Thu', xp: 0 },
          { day: 'Fri', xp: 0 },
          { day: 'Sat', xp: 0 },
        ]);
        setSkillData([
          { skill: 'Business', proficiency: 0 },
          { skill: 'Marketing', proficiency: 0 },
          { skill: 'Development', proficiency: 0 },
          { skill: 'Design', proficiency: 0 },
          { skill: 'Data', proficiency: 0 },
        ]);
      }
    };

    fetchUserStats();
  }, []);

  // Fetch leaderboard data (top 5 users)
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard?limit=5');
        if (response.data.success) {
          const topUsers = response.data.data.leaderboard.map((user: any) => ({
            id: user.id,
            username: user.username,
            xp: user.xp,
            league: user.league,
            rank: user.rank,
          }));
          setLeaderboardData(topUsers);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Set empty leaderboard on error
        setLeaderboardData([]);
      }
    };

    fetchLeaderboard();
  }, []);

  // Fetch challenges
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await api.get('/challenges/daily');
        if (response.data.success) {
          setChallenges(response.data.data.challenges);
        }
      } catch (error) {
        console.error('Error fetching challenges:', error);
        // Set empty challenges on error
        setChallenges([]);
      }
    };

    fetchChallenges();
  }, []);

  // Fetch AI recommendation
  useEffect(() => {
    const fetchAIRecommendation = async () => {
      try {
        setLoadingRecommendation(true);
        const response = await api.get('/lessons/ai-recommendation');
        if (response.data.success && response.data.data.recommendation) {
          setAiRecommendation(response.data.data.recommendation);
        }
      } catch (error) {
        console.error('Error fetching AI recommendation:', error);
        setAiRecommendation(null);
      } finally {
        setLoadingRecommendation(false);
      }
    };

    fetchAIRecommendation();
  }, []);

  // Fetch last lesson progress
  useEffect(() => {
    const fetchLastLesson = async () => {
      try {
        setLoadingContinueJourney(true);
        const response = await api.get('/lessons/continue-journey');
        if (response.data.success && response.data.data.nextLesson) {
          const lesson = response.data.data.nextLesson;
          setLastLesson({
            lessonId: lesson.lessonId,
            title: lesson.title,
            topic: lesson.topic,
            progress: lesson.progress,
            isFirst: lesson.isFirst,
            isCompleted: lesson.isCompleted,
            message: lesson.message,
          });
        }
      } catch (error) {
        console.error('Error fetching continue journey:', error);
        setLastLesson(null);
      } finally {
        setLoadingContinueJourney(false);
      }
    };

    fetchLastLesson();
  }, []);

  // Fetch badges
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoadingBadges(true);
        const response = await badgeAPI.getAllBadges();
        if (response.success) {
          setBadges(response.data.badges);
        }
      } catch (error) {
        console.error('Error fetching badges:', error);
        setBadges([]);
      } finally {
        setLoadingBadges(false);
      }
    };

    fetchBadges();

    // Check for new badge notifications
    checkForNewBadges();
  }, []);

  // Claim challenge reward
  const handleClaimChallenge = async (challengeId: string) => {
    try {
      const response = await api.post(`/challenges/${challengeId}/claim`);
      if (response.data.success) {
        // Update the local challenge state to show it as claimed
        setChallenges((prevChallenges) =>
          prevChallenges.map((challenge) =>
            challenge.id === challengeId
              ? { ...challenge, claimed: true }
              : challenge
          )
        );

        // Refresh user data to update XP in header
        await refreshUser();

        // Refresh challenges from server
        const challengesResponse = await api.get('/challenges/daily');
        if (challengesResponse.data.success) {
          setChallenges(challengesResponse.data.data.challenges);
        }

        // Show success toast
        toast({
          title: '🎉 Challenge Completed!',
          description: `You earned +${response.data.data.xpEarned} XP! Total: ${response.data.data.totalXP} XP`,
        });
      }
    } catch (error: any) {
      console.error('Error claiming challenge:', error);
      toast({
        title: '❌ Error',
        description:
          error.response?.data?.message || 'Failed to claim challenge reward',
        variant: 'destructive',
      });
    }
  };

  // Mock data - Replace with real data from API
  const mockData = {
    overview: {
      xp: (user as any)?.stats?.xpPoints || 0,
      league: (user as any)?.stats?.league || 'bronze',
      streak: currentStreak,
      badges: 8,
    },
    skillData: [
      { skill: 'Business', proficiency: 75 },
      { skill: 'Marketing', proficiency: 60 },
      { skill: 'Development', proficiency: 85 },
      { skill: 'Design', proficiency: 50 },
      { skill: 'Analytics', proficiency: 70 },
    ],
    weeklyXP: [
      { week: 'Week 1', xp: 1200 },
      { week: 'Week 2', xp: 1500 },
      { week: 'Week 3', xp: 1800 },
      { week: 'Week 4', xp: 2100 },
    ],
    challenges: [
      {
        id: '1',
        title: 'Complete 3 Lessons',
        description: 'Finish three lessons today to earn bonus XP',
        progress: 2,
        total: 3,
        xpReward: 100,
        type: 'daily' as const,
        completed: false,
      },
      {
        id: '2',
        title: 'Score 80%+ on Test',
        description: 'Pass any test with 80% or higher accuracy',
        progress: 0,
        total: 1,
        xpReward: 250,
        type: 'daily' as const,
        completed: false,
      },
      {
        id: '3',
        title: 'Weekly Warrior',
        description: 'Maintain a 7-day learning streak',
        progress: 5,
        total: 7,
        xpReward: 500,
        type: 'weekly' as const,
        completed: false,
      },
    ],
    leaderboard: [
      {
        id: '1',
        username: 'CodeMaster',
        xp: 15000,
        league: 'Platinum',
        rank: 1,
      },
      { id: '2', username: 'DevQueen', xp: 13500, league: 'Gold', rank: 2 },
      { id: '3', username: 'TechNinja', xp: 12800, league: 'Gold', rank: 3 },
      {
        id: user?.id || '4',
        username: user?.username || 'You',
        xp: 12450,
        league: 'Gold',
        rank: 4,
      },
      { id: '5', username: 'SkillSeeker', xp: 11900, league: 'Gold', rank: 5 },
    ],
    aiSuggestions: [
      {
        id: '1',
        title: 'Advanced React Patterns',
        category: 'Development',
        difficulty: 'advanced' as const,
        estimatedTime: '45 min',
        xpReward: 500,
        reason:
          'Based on your strong development skills, this will help you master advanced concepts',
      },
      {
        id: '2',
        title: 'UI/UX Design Fundamentals',
        category: 'Design',
        difficulty: 'beginner' as const,
        estimatedTime: '30 min',
        xpReward: 200,
        reason:
          'Improve your design skills to complement your development expertise',
      },
    ],
    profile: {
      badges: 8,
      level: 24,
      totalHours: 156,
      accuracy: 87,
      topSkills: ['React', 'TypeScript', 'Node.js', 'Python'],
    },
  };

  // Real badge count (fallback to mock while loading)
  const badgesEarned = loadingBadges
    ? mockData.overview.badges
    : badges.filter((b) => b.earned).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <DashboardHeader role="user" />

      {/* Main Content */}
      <main className="container mx-auto px-6 md:px-8 lg:px-12 py-8 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Welcome back, {user?.username || 'Learner'}! 🎓
          </h1>
          <p className="text-lg text-muted-foreground">
            Keep crushing those goals!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/lessons">
              <Button variant="accent" size="lg" className="gap-2">
                <Brain className="w-5 h-5" />
                Browse Lessons
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rotate-[-1deg]">
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="font-handwritten text-3xl font-bold">
                  {mockData.overview.xp}
                </p>
                <p className="font-handwritten text-muted-foreground">
                  Total XP
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rotate-[1deg]">
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="font-handwritten text-3xl font-bold capitalize">
                  {mockData.overview.league}
                </p>
                <p className="font-handwritten text-muted-foreground">League</p>
              </CardContent>
            </Card>
          </div>

          <div className="rotate-[-1deg]">
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-secondary border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-secondary-foreground" />
                </div>
                <p className="font-handwritten text-3xl font-bold">
                  {mockData.overview.streak}
                </p>
                <p className="font-handwritten text-muted-foreground">
                  Day Streak
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="rotate-[1deg]">
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-accent border-[3px] border-border rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Award className="w-6 h-6 text-accent-foreground" />
                </div>
                <p className="font-handwritten text-3xl font-bold">
                  {badgesEarned}
                </p>
                <p className="font-handwritten text-muted-foreground">Badges</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Continue Journey and AI Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Continue Your Journey */}
          <div className="lg:col-span-2 bg-primary brutal-border brutal-shadow rounded-xl p-8 text-white space-y-4">
            <h2 className="text-3xl font-bold">Continue Your Journey</h2>
            <p className="text-blue-100">Pick up where you left off</p>

            {loadingContinueJourney ? (
              <div className="space-y-3">
                <p className="text-blue-100">Loading your progress...</p>
              </div>
            ) : lastLesson ? (
              <div className="space-y-3">
                {lastLesson.topic && (
                  <div className="flex items-center gap-2 text-sm text-blue-200 font-semibold">
                    <span className="text-lg">📚</span>
                    <span>{lastLesson.topic}</span>
                  </div>
                )}
                <div className="space-y-1">
                  {lastLesson.isCompleted ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">✅</span>
                        <h3 className="text-xl font-bold">
                          Completed: {lastLesson.title}
                        </h3>
                      </div>
                    </>
                  ) : lastLesson.isFirst ? (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <h3 className="text-xl font-bold">
                          {lastLesson.title}
                        </h3>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold">{lastLesson.title}</h3>
                    </>
                  )}
                </div>
                {lastLesson.message && (
                  <p className="text-sm text-blue-100 italic">
                    {lastLesson.message}
                  </p>
                )}
                {!lastLesson.isCompleted &&
                  lastLesson.progress !== undefined && (
                    <>
                      <div className="relative">
                        <div className="h-3 bg-blue-300 rounded-full overflow-hidden brutal-border border-white">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${lastLesson.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      <p className="text-sm text-blue-100">
                        {lastLesson.progress}% of topic complete
                      </p>
                    </>
                  )}
                <Button
                  variant="outline"
                  className="bg-white text-primary hover:bg-blue-50 brutal-border border-white px-8"
                  size="lg"
                  onClick={() => {
                    if (lastLesson.isCompleted) {
                      navigate('/lessons');
                    } else {
                      navigate(`/lesson/${lastLesson.lessonId}`);
                    }
                  }}
                >
                  {lastLesson.isFirst
                    ? 'Start Learning →'
                    : lastLesson.isCompleted
                    ? 'Generate More Lessons →'
                    : 'Continue →'}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-blue-100">
                  Start your learning journey today!
                </p>
                <Link to="/lessons">
                  <Button
                    variant="outline"
                    className="bg-white text-primary hover:bg-blue-50 brutal-border border-white px-8"
                    size="lg"
                  >
                    Browse Lessons →
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* AI Suggests */}
          <div className="bg-yellow-300 brutal-border brutal-shadow rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🧠</span> AI Suggests
            </h2>
            {loadingRecommendation ? (
              <p className="text-sm">Analyzing your progress...</p>
            ) : aiRecommendation ? (
              <>
                <div className="space-y-2">
                  <p className="text-sm">
                    Based on your progress, try learning
                  </p>
                  <div className="bg-white brutal-border rounded-lg p-3 space-y-2">
                    <div className="font-bold text-lg text-gray-900">
                      {aiRecommendation.title}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-semibold brutal-border border-purple-300">
                        📚 {aiRecommendation.category}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-bold brutal-border border-green-300">
                        ⚡ +{aiRecommendation.xpReward} XP
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-700 bg-yellow-100 brutal-border rounded-lg p-3">
                  <p className="leading-relaxed">
                    ✨ {aiRecommendation.reason}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-white hover:bg-gray-50 brutal-border border-black font-bold"
                  size="lg"
                  onClick={() =>
                    navigate(`/lesson/${aiRecommendation.lessonId}`)
                  }
                >
                  Start Lesson
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm">
                  Generate lessons to get personalized recommendations!
                </p>
                <Link to="/lessons">
                  <Button
                    variant="outline"
                    className="w-full bg-white hover:bg-gray-50 brutal-border border-black"
                    size="lg"
                  >
                    Browse Lessons
                  </Button>
                </Link>
              </>
            )}
          </div>
        </motion.div>

        {/* Skill Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SkillChart skillData={skillData} weeklyXP={weeklyXP} />
        </motion.div>

        {/* Streak Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <Card className="brutal-border brutal-shadow">
              <CardContent className="p-6 text-center">
                <p>Loading activity data...</p>
              </CardContent>
            </Card>
          ) : (
            <StreakHeatmap
              activityData={activityData}
              initialMonth={selectedMonth}
              initialYear={selectedYear}
              onMonthChange={(month, year) => {
                setSelectedMonth(month);
                setSelectedYear(year);
              }}
            />
          )}
        </motion.div>

        {/* Challenges and Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ChallengeCard
            challenges={
              challenges.length > 0 ? challenges : mockData.challenges
            }
            onClaimReward={handleClaimChallenge}
          />
          <LeaderboardCard
            users={
              leaderboardData.length > 0
                ? leaderboardData
                : mockData.leaderboard
            }
            currentUserId={user?.id}
            onViewFull={() => navigate('/leaderboard')}
          />
        </motion.div>

        {/* Recent Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="brutal-border brutal-shadow rotate-[-0.5deg]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold font-handwritten flex items-center gap-2">
                    🏆 Recent Badges
                  </h2>
                  <p className="text-muted-foreground font-handwritten">
                    Keep earning badges to unlock rewards!
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  className="brutal-border"
                >
                  View All →
                </Button>
              </div>

              {loadingBadges ? (
                <div className="text-center py-8">
                  <p className="font-handwritten">Loading badges...</p>
                </div>
              ) : badges.length === 0 ? (
                <div className="text-center py-8">
                  <p className="font-handwritten text-muted-foreground">
                    Complete lessons to start earning badges!
                  </p>
                </div>
              ) : (
                <BadgeGrid
                  badges={badges.filter((b) => b.earned).slice(0, 6)}
                  compact
                  onBadgeClick={(badge) => {
                    setSelectedBadge(badge);
                    setBadgeDialogOpen(true);
                  }}
                />
              )}

              {/* Show next badges to earn if fewer than 3 earned */}
              {badges.filter((b) => b.earned).length < 3 && (
                <div className="mt-8 pt-8 border-t-[3px] border-border">
                  <h3 className="text-xl font-bold font-handwritten mb-4">
                    🎯 Next Badges to Earn
                  </h3>
                  <BadgeGrid
                    badges={badges
                      .filter((b) => !b.earned)
                      .sort((a, b) => b.progress - a.progress)
                      .slice(0, 3)}
                    compact
                    onBadgeClick={(badge) => {
                      setSelectedBadge(badge);
                      setBadgeDialogOpen(true);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Badge Detail Dialog */}
        <Dialog open={badgeDialogOpen} onOpenChange={setBadgeDialogOpen}>
          <DialogContent className="border-[3px] border-border">
            {selectedBadge && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-accent border-[3px] border-border rounded-2xl flex items-center justify-center text-4xl">
                      {selectedBadge.emoji}
                    </div>
                    <div>
                      <DialogTitle className="font-handwritten text-2xl">
                        {selectedBadge.name}
                      </DialogTitle>
                      <DialogDescription className="font-handwritten">
                        {selectedBadge.rarity.toUpperCase()} Badge •{' '}
                        {selectedBadge.xpReward} XP
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="font-handwritten text-lg">
                    {selectedBadge.description}
                  </p>

                  {selectedBadge.earned ? (
                    <div className="bg-green-100 border-[3px] border-green-500 rounded-lg p-4">
                      <p className="font-handwritten text-green-800 font-bold">
                        ✅ Badge Earned!
                      </p>
                      <p className="font-handwritten text-sm text-green-700">
                        Earned on{' '}
                        {new Date(selectedBadge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-100 border-[3px] border-yellow-500 rounded-lg p-4 space-y-3">
                      <p className="font-handwritten text-yellow-800 font-bold">
                        🎯 In Progress
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-handwritten text-sm text-yellow-700">
                            {selectedBadge.current} / {selectedBadge.target}
                          </span>
                          <span className="font-handwritten text-sm font-bold text-yellow-800">
                            {selectedBadge.progress}%
                          </span>
                        </div>
                        <div className="h-3 bg-yellow-200 border-[2px] border-yellow-500 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 transition-all"
                            style={{ width: `${selectedBadge.progress}%` }}
                          />
                        </div>
                      </div>
                      <p className="font-handwritten text-sm text-yellow-700 italic">
                        💡 Keep going! You're{' '}
                        {selectedBadge.target - selectedBadge.current} away from
                        earning this badge!
                      </p>
                    </div>
                  )}

                  <Button
                    variant="hero"
                    className="w-full"
                    onClick={() => setBadgeDialogOpen(false)}
                  >
                    {selectedBadge.earned ? 'Awesome!' : 'Got It!'}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default LearnerDashboard;
