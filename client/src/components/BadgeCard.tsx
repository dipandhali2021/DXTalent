import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: {
    id: string;
    name: string;
    description: string;
    emoji: string;
    xpReward: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    earned: boolean;
    earnedAt?: string;
    progress: number;
    current: number;
    target: number;
  };
  onClick?: () => void;
  compact?: boolean;
}

const RARITY_COLORS = {
  common: {
    bg: 'bg-slate-100',
    border: 'border-slate-400',
    text: 'text-slate-700',
    label: 'Common',
  },
  uncommon: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-700',
    label: 'Uncommon',
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    text: 'text-blue-700',
    label: 'Rare',
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-700',
    label: 'Epic',
  },
  legendary: {
    bg: 'bg-yellow-100',
    border: 'border-yellow-500',
    text: 'text-yellow-700',
    label: 'Legendary',
  },
};

const BadgeCard = ({ badge, onClick, compact = false }: BadgeCardProps) => {
  const rarityStyle = RARITY_COLORS[badge.rarity];
  const isLocked = !badge.earned;

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.05, rotate: badge.earned ? 3 : 0 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative w-20 h-20 rounded-xl border-[3px] flex items-center justify-center text-4xl cursor-pointer transition-all',
          isLocked
            ? 'bg-muted border-border opacity-50 grayscale'
            : `${rarityStyle.bg} ${rarityStyle.border}`,
          badge.earned && 'hover:shadow-lg shadow-md'
        )}
        onClick={onClick}
      >
        {isLocked ? (
          <Lock className="w-8 h-8 text-muted-foreground" />
        ) : (
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            {badge.emoji}
          </motion.span>
        )}
        {badge.earned && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-primary border-[2px] border-white rounded-full flex items-center justify-center"
          >
            <Sparkles className="w-3 h-3 text-white" />
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, rotate: badge.earned ? 1 : 0 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative transition-all cursor-pointer',
        badge.earned ? 'rotate-[-0.5deg]' : 'rotate-[0.5deg]'
      )}
      onClick={onClick}
    >
      <Card
        className={cn(
          'border-[3px] shadow-brutal overflow-hidden',
          isLocked ? 'border-border bg-muted' : rarityStyle.border
        )}
      >
        <CardContent className="p-6 space-y-4">
          {/* Badge Icon */}
          <div className="flex items-start justify-between">
            <div
              className={cn(
                'w-16 h-16 rounded-2xl border-[3px] flex items-center justify-center text-4xl',
                isLocked
                  ? 'bg-muted border-border opacity-50'
                  : `${rarityStyle.bg} ${rarityStyle.border}`
              )}
            >
              {isLocked ? (
                <Lock className="w-8 h-8 text-muted-foreground" />
              ) : (
                <motion.span
                  animate={badge.earned ? { rotate: [0, -10, 10, -10, 0] } : {}}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  {badge.emoji}
                </motion.span>
              )}
            </div>

            {/* Rarity Badge */}
            <Badge
              variant="outline"
              className={cn(
                'border-[2px] font-bold',
                rarityStyle.border,
                rarityStyle.text
              )}
            >
              {rarityStyle.label}
            </Badge>
          </div>

          {/* Badge Info */}
          <div className="space-y-2">
            <h3
              className={cn(
                'font-handwritten text-xl font-bold',
                isLocked && 'text-muted-foreground'
              )}
            >
              {badge.name}
            </h3>
            <p
              className={cn(
                'font-handwritten text-sm',
                isLocked ? 'text-muted-foreground' : 'text-foreground/80'
              )}
            >
              {badge.description}
            </p>
          </div>

          {/* Progress Bar (for locked badges) */}
          {isLocked && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-handwritten text-muted-foreground">
                  Progress: {badge.current}/{badge.target}
                </span>
                <span className="text-xs font-handwritten font-bold text-primary">
                  {badge.progress}%
                </span>
              </div>
              <div className="relative h-2 bg-muted border-[2px] border-border rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${badge.progress}%` }}
                  transition={{ duration: 0.5 }}
                  className={cn('h-full', rarityStyle.bg)}
                />
              </div>
            </div>
          )}

          {/* XP Reward */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'px-3 py-1 rounded-lg border-[2px] font-handwritten font-bold text-sm',
                isLocked
                  ? 'bg-muted border-border text-muted-foreground'
                  : 'bg-primary border-primary-foreground text-primary-foreground'
              )}
            >
              +{badge.xpReward} XP
            </div>
            {badge.earned && badge.earnedAt && (
              <span className="text-xs font-handwritten text-muted-foreground ml-auto">
                Earned {new Date(badge.earnedAt).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Earned Indicator */}
          {badge.earned && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute top-3 right-3"
            >
              <div className="w-8 h-8 bg-primary border-[2px] border-white rounded-full flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgeCard;
