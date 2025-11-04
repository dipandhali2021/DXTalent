import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Flame, Star, Target } from 'lucide-react';

interface OverviewCardProps {
  xp: number;
  league: string;
  streak: number;
  badges: number;
  onContinueLesson?: () => void;
}

export const OverviewCard = ({
  xp,
  league,
  streak,
  badges,
  onContinueLesson,
}: OverviewCardProps) => {
  return (
    <Card className="brutal-border brutal-shadow bg-gradient-to-br from-primary/10 to-secondary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" />
          Your Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Star className="w-4 h-4" />
              Total XP
            </div>
            <div className="text-3xl font-bold text-primary">
              {xp.toLocaleString()}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Flame className="w-4 h-4" />
              Streak
            </div>
            <div className="text-3xl font-bold text-orange-500">
              {streak} days
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t-2 border-border">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">League</div>
            <Badge
              variant="default"
              className="brutal-border text-base px-3 py-1"
            >
              {league}
            </Badge>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Badges</div>
            <div className="flex items-center gap-1">
              <Target className="w-5 h-5 text-accent" />
              <span className="font-bold text-lg">{badges}</span>
            </div>
          </div>
        </div>

        {onContinueLesson && (
          <Button
            variant="hero"
            className="w-full mt-4"
            onClick={onContinueLesson}
          >
            Continue Lesson
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
