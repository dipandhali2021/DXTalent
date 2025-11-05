import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  username: string;
  xp: number;
  avatar?: string;
  league: string;
  rank: number;
}

interface LeaderboardCardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
  onViewFull?: () => void;
}

export const LeaderboardCard = ({
  users,
  currentUserId,
  onViewFull,
}: LeaderboardCardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-700" />;
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center font-bold text-muted-foreground">
            #{rank}
          </span>
        );
    }
  };

  return (
    <Card className="brutal-border brutal-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Leaderboard
          </div>
          {onViewFull && (
            <Button variant="outline-brutal" size="sm" onClick={onViewFull}>
              View Full
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className={`flex items-center gap-3 p-3 rounded-lg brutal-border brutal-shadow-sm ${
              user.id === currentUserId
                ? 'bg-primary/10 border-primary'
                : 'bg-card'
            }`}
          >
            <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>

            <Avatar className="brutal-border">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="font-bold truncate">{user.username}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {user.league}
                </Badge>
              </div>
            </div>

            <div className="text-right">
              <div className="font-bold text-primary">
                {user.xp.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">XP</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
