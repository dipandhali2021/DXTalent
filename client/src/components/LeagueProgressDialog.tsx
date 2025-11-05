import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Trophy,
  Target,
  TrendingUp,
  Sparkles,
  Crown,
  Award,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface LeagueProgressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const leagueConfig = {
  bronze: {
    name: 'Bronze',
    minXP: 0,
    maxXP: 999,
    nextXP: 1000,
    color: 'from-amber-700 to-amber-900',
    bgColor: 'bg-amber-900/20',
    borderColor: 'border-amber-700',
    textColor: 'text-amber-700',
    icon: Award,
    emoji: '🥉',
  },
  silver: {
    name: 'Silver',
    minXP: 1000,
    maxXP: 2999,
    nextXP: 3000,
    color: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-400/20',
    borderColor: 'border-gray-400',
    textColor: 'text-gray-400',
    icon: Award,
    emoji: '🥈',
  },
  gold: {
    name: 'Gold',
    minXP: 3000,
    maxXP: 5999,
    nextXP: 6000,
    color: 'from-yellow-400 to-yellow-600',
    bgColor: 'bg-yellow-400/20',
    borderColor: 'border-yellow-400',
    textColor: 'text-yellow-400',
    icon: Trophy,
    emoji: '🥇',
  },
  platinum: {
    name: 'Platinum',
    minXP: 6000,
    maxXP: 9999,
    nextXP: 10000,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-400/20',
    borderColor: 'border-blue-400',
    textColor: 'text-blue-400',
    icon: Trophy,
    emoji: '💎',
  },
  diamond: {
    name: 'Diamond',
    minXP: 10000,
    maxXP: 14999,
    nextXP: 15000,
    color: 'from-cyan-400 to-cyan-600',
    bgColor: 'bg-cyan-400/20',
    borderColor: 'border-cyan-400',
    textColor: 'text-cyan-400',
    icon: Sparkles,
    emoji: '💠',
  },
  master: {
    name: 'Master',
    minXP: 15000,
    maxXP: Infinity,
    nextXP: Infinity,
    color: 'from-purple-500 to-purple-700',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500',
    textColor: 'text-purple-500',
    icon: Crown,
    emoji: '👑',
  },
};

const LeagueProgressDialog = ({
  open,
  onOpenChange,
}: LeagueProgressDialogProps) => {
  const { user } = useAuth();

  if (!user) return null;

  const currentXP = user.stats.xpPoints || 0;
  const currentLeague = user.stats.league || 'bronze';
  const currentLeagueConfig =
    leagueConfig[currentLeague as keyof typeof leagueConfig];

  // Calculate progress within current league
  const progressInCurrentLeague =
    currentLeague === 'master'
      ? 100
      : ((currentXP - currentLeagueConfig.minXP) /
          (currentLeagueConfig.nextXP - currentLeagueConfig.minXP)) *
        100;

  const xpNeededForNext =
    currentLeague === 'master' ? 0 : currentLeagueConfig.nextXP - currentXP;

  // Get next league
  const leagueOrder = [
    'bronze',
    'silver',
    'gold',
    'platinum',
    'diamond',
    'master',
  ];
  const currentIndex = leagueOrder.indexOf(currentLeague);
  const nextLeague =
    currentIndex < leagueOrder.length - 1
      ? leagueOrder[currentIndex + 1]
      : null;
  const nextLeagueConfig = nextLeague
    ? leagueConfig[nextLeague as keyof typeof leagueConfig]
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto brutal-border brutal-shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-3xl font-handwritten flex items-center gap-3">
            <Trophy className="w-8 h-8 text-primary" />
            League Progression
          </DialogTitle>
          <DialogDescription className="font-handwritten text-lg">
            Track your journey from Bronze to Master League
          </DialogDescription>
        </DialogHeader>

        {/* Current League Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6"
        >
          <Card
            className={`brutal-border brutal-shadow rotate-[-1deg] bg-gradient-to-br ${currentLeagueConfig.color} text-white`}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-5xl">{currentLeagueConfig.emoji}</div>
                  <div>
                    <h3 className="text-2xl font-bold font-handwritten">
                      {currentLeagueConfig.name} League
                    </h3>
                    <p className="text-white/80 font-handwritten">
                      Current Level: {user.stats.level}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">
                    {currentXP.toLocaleString()}
                  </div>
                  <div className="text-white/80 font-handwritten">Total XP</div>
                </div>
              </div>

              {currentLeague !== 'master' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-handwritten">
                    <span>Progress to {nextLeagueConfig?.name}</span>
                    <span>{Math.round(progressInCurrentLeague)}%</span>
                  </div>
                  <Progress
                    value={progressInCurrentLeague}
                    className="h-4 bg-white/20"
                  />
                  <div className="flex items-center justify-between text-sm font-handwritten">
                    <span>{currentLeagueConfig.minXP.toLocaleString()} XP</span>
                    <span className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {xpNeededForNext.toLocaleString()} XP needed
                    </span>
                    <span>
                      {currentLeagueConfig.nextXP.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              )}

              {currentLeague === 'master' && (
                <div className="text-center py-4">
                  <Crown className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                  <p className="text-xl font-handwritten">
                    🎉 You've reached the highest league! 🎉
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* All Leagues Roadmap */}
        <div className="mt-8">
          <h3 className="text-xl font-handwritten mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            League Roadmap
          </h3>

          <div className="space-y-3">
            {leagueOrder.map((leagueKey, index) => {
              const league =
                leagueConfig[leagueKey as keyof typeof leagueConfig];
              const LeagueIcon = league.icon;
              const isUnlocked = currentXP >= league.minXP;
              const isCurrent = leagueKey === currentLeague;

              return (
                <motion.div
                  key={leagueKey}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className={`brutal-border transition-all duration-300 ${
                      isCurrent
                        ? `brutal-shadow-lg scale-105 ${league.borderColor} border-4`
                        : isUnlocked
                        ? 'brutal-shadow'
                        : 'opacity-50 grayscale'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                              isUnlocked ? league.bgColor : 'bg-gray-200'
                            } brutal-border`}
                          >
                            {league.emoji}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xl font-bold font-handwritten">
                                {league.name} League
                              </h4>
                              {isCurrent && (
                                <Badge
                                  variant="default"
                                  className="font-handwritten"
                                >
                                  Current
                                </Badge>
                              )}
                              {isUnlocked &&
                                !isCurrent &&
                                currentXP > league.maxXP && (
                                  <Badge
                                    variant="secondary"
                                    className="font-handwritten"
                                  >
                                    ✓ Completed
                                  </Badge>
                                )}
                              {!isUnlocked && (
                                <Badge
                                  variant="outline"
                                  className="font-handwritten"
                                >
                                  🔒 Locked
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground font-handwritten">
                              {league.minXP.toLocaleString()} -{' '}
                              {league.maxXP === Infinity
                                ? '∞'
                                : league.maxXP.toLocaleString()}{' '}
                              XP
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          {isUnlocked ? (
                            <div className="flex items-center gap-2">
                              <LeagueIcon
                                className={`w-6 h-6 ${league.textColor}`}
                              />
                              <Zap className="w-5 h-5 text-yellow-500" />
                            </div>
                          ) : (
                            <div className="text-sm text-muted-foreground font-handwritten">
                              {(league.minXP - currentXP).toLocaleString()} XP
                              to unlock
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progress bar for leagues */}
                      {isUnlocked && league.maxXP !== Infinity && (
                        <div className="mt-3">
                          <Progress
                            value={
                              currentXP >= league.maxXP
                                ? 100
                                : ((currentXP - league.minXP) /
                                    (league.maxXP - league.minXP + 1)) *
                                  100
                            }
                            className={`h-2 ${league.bgColor}`}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <Card className="brutal-border text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {user.stats.challengesCompleted || 0}
              </div>
              <div className="text-sm text-muted-foreground font-handwritten">
                Challenges
              </div>
            </CardContent>
          </Card>
          <Card className="brutal-border text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {user.stats.currentStreak || 0}
              </div>
              <div className="text-sm text-muted-foreground font-handwritten">
                Day Streak
              </div>
            </CardContent>
          </Card>
          <Card className="brutal-border text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {user.stats.skillsMastered || 0}
              </div>
              <div className="text-sm text-muted-foreground font-handwritten">
                Skills
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Message */}
        <div className="mt-6 p-4 brutal-border bg-primary/5 rounded-lg">
          <p className="font-handwritten text-center text-sm">
            {currentLeague === 'master'
              ? '🌟 You are a Master! Keep inspiring others with your dedication! 🌟'
              : `💪 Keep learning! ${xpNeededForNext.toLocaleString()} XP to reach ${
                  nextLeagueConfig?.name
                } League!`}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeagueProgressDialog;
