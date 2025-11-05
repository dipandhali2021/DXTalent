import BadgeCard from './BadgeCard';
import { motion } from 'framer-motion';

interface BadgeGridProps {
  badges: Array<{
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
  }>;
  onBadgeClick?: (badge: any) => void;
  compact?: boolean;
}

const BadgeGrid = ({
  badges,
  onBadgeClick,
  compact = false,
}: BadgeGridProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (compact) {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap gap-4"
      >
        {badges.map((badge) => (
          <motion.div key={badge.id} variants={item}>
            <BadgeCard
              badge={badge}
              compact
              onClick={() => onBadgeClick?.(badge)}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {badges.map((badge) => (
        <motion.div key={badge.id} variants={item}>
          <BadgeCard badge={badge} onClick={() => onBadgeClick?.(badge)} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BadgeGrid;
