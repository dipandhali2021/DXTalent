import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, CheckCircle2, Gift } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  xpReward: number;
  type: 'daily' | 'weekly';
  completed: boolean;
  claimed?: boolean;
}

interface ChallengeCardProps {
  challenges: Challenge[];
  onClaimReward?: (challengeId: string) => void;
}

export const ChallengeCard = ({
  challenges,
  onClaimReward,
}: ChallengeCardProps) => {
  return (
    <Card className="brutal-border brutal-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Active Challenges
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {challenges.map((challenge) => {
          const percentage = (challenge.progress / challenge.total) * 100;

          return (
            <div
              key={challenge.id}
              className={`p-4 brutal-border brutal-shadow-sm rounded-lg ${
                challenge.completed ? 'bg-green-50 border-green-500' : 'bg-card'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold">{challenge.title}</h4>
                    <Badge
                      variant={
                        challenge.type === 'daily' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {challenge.type === 'daily' ? (
                        <Clock className="w-3 h-3 mr-1 inline" />
                      ) : null}
                      {challenge.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {challenge.description}
                  </p>
                </div>

                {challenge.completed && (
                  <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="space-y-2">
                <Progress value={percentage} className="h-3" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {challenge.progress} / {challenge.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">
                      +{challenge.xpReward} XP
                    </span>
                    {challenge.completed &&
                      onClaimReward &&
                      (challenge.claimed ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled
                          className="h-7 gap-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Claimed
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="accent"
                          onClick={() => onClaimReward(challenge.id)}
                          className="h-7 gap-1"
                        >
                          <Gift className="w-3 h-3" />
                          Claim
                        </Button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
