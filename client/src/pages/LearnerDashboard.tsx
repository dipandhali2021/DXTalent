import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { SkillChart } from '@/components/dashboard/SkillChart';
import { StreakHeatmap } from '@/components/dashboard/StreakHeatmap';
import { ChallengeCard } from '@/components/dashboard/ChallengeCard';
import { LeaderboardCard } from '@/components/dashboard/LeaderboardCard';
import { AILessonSuggestions } from '@/components/dashboard/AILessonSuggestions';
import { motion } from 'framer-motion';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Award, Calendar, Trophy, Zap } from 'lucide-react';

const LearnerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - Replace with real data from API
  const mockData = {
    overview: {
      xp: 12450,
      league: 'Gold',
      streak: 15,
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
    activityData: [
      { date: '2025-10-15', count: 5 },
      { date: '2025-10-16', count: 3 },
      { date: '2025-10-17', count: 8 },
      { date: '2025-10-18', count: 0 },
      { date: '2025-10-19', count: 6 },
      { date: '2025-10-20', count: 10 },
      { date: '2025-10-21', count: 4 },
      // Add more dates...
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
            Welcome back, Learner! 🎓
          </h1>
          <p className="text-lg text-muted-foreground">
            Keep crushing those goals!
          </p>
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
                <p className="font-handwritten text-3xl font-bold">
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
                  {mockData.overview.badges}
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

            <div className="space-y-3">
              <h3 className="text-xl font-bold">
                React Fundamentals: Lesson 5
              </h3>
              <div className="relative">
                <div className="h-3 bg-blue-300 rounded-full overflow-hidden brutal-border border-white">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-blue-100">75% Complete</p>
            </div>

            <Button
              variant="outline"
              className="bg-white text-primary hover:bg-blue-50 brutal-border border-white px-8"
              size="lg"
            >
              Continue →
            </Button>
          </div>

          {/* AI Suggests */}
          <div className="bg-yellow-300 brutal-border brutal-shadow rounded-xl p-6 space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>🧠</span> AI Suggests
            </h2>
            <p className="text-sm">
              Based on your progress, try learning TypeScript Advanced Patterns!
            </p>
            <Button
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 brutal-border border-black"
              size="lg"
            >
              Start Lesson
            </Button>
          </div>
        </motion.div>

        {/* Skill Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SkillChart
            skillData={mockData.skillData}
            weeklyXP={mockData.weeklyXP}
          />
        </motion.div>

        {/* Streak Heatmap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StreakHeatmap activityData={mockData.activityData} />
        </motion.div>

        {/* Challenges and Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ChallengeCard challenges={mockData.challenges} />
          <LeaderboardCard
            users={mockData.leaderboard}
            currentUserId={user?.id}
            onViewFull={() => navigate('/leaderboard')}
          />
        </motion.div>

        {/* Additional AI Lesson Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <AILessonSuggestions
            suggestions={mockData.aiSuggestions}
            onStartLesson={(id) => console.log('Start lesson:', id)}
          />
        </motion.div>
      </main>
    </div>
  );
};

export default LearnerDashboard;
