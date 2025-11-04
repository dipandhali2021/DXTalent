import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';

interface ProfileSummaryProps {
  badges: number;
  level: number;
  totalHours: number;
  accuracy: number;
  topSkills: string[];
}

export const ProfileSummary = ({
  badges,
  level,
  totalHours,
  accuracy,
  topSkills,
}: ProfileSummaryProps) => {
  return (
    <Card className="brutal-border brutal-shadow bg-gradient-to-br from-blue-50 to-purple-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Profile Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-white brutal-border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Trophy className="w-4 h-4" />
              Badges
            </div>
            <div className="text-2xl font-bold text-primary">{badges}</div>
          </div>

          <div className="p-3 bg-white brutal-border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Target className="w-4 h-4" />
              Level
            </div>
            <div className="text-2xl font-bold text-primary">{level}</div>
          </div>

          <div className="p-3 bg-white brutal-border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <Clock className="w-4 h-4" />
              Hours
            </div>
            <div className="text-2xl font-bold text-primary">{totalHours}</div>
          </div>

          <div className="p-3 bg-white brutal-border rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Accuracy
            </div>
            <div className="text-2xl font-bold text-primary">{accuracy}%</div>
          </div>
        </div>

        <div className="p-3 bg-white brutal-border rounded-lg">
          <div className="text-sm font-bold text-muted-foreground mb-2">
            Top Skills
          </div>
          <div className="flex flex-wrap gap-2">
            {topSkills.map((skill, idx) => (
              <Badge key={idx} variant="default" className="brutal-border">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
