// Badge definitions with criteria and rewards
export const BADGES = {
  // Beginner Badges
  FIRST_STEP: {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first lesson',
    emoji: '👣',
    criteria: { type: 'lessons_completed', value: 1 },
    xpReward: 50,
    rarity: 'common',
  },
  EARLY_BIRD: {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Complete a lesson before 9 AM',
    emoji: '🌅',
    criteria: { type: 'early_completion', value: 1 },
    xpReward: 100,
    rarity: 'uncommon',
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete a lesson after 10 PM',
    emoji: '🦉',
    criteria: { type: 'late_completion', value: 1 },
    xpReward: 100,
    rarity: 'uncommon',
  },

  // Streak Badges
  STREAK_STARTER: {
    id: 'streak_starter',
    name: 'Streak Starter',
    description: 'Maintain a 3-day learning streak',
    emoji: '🔥',
    criteria: { type: 'streak', value: 3 },
    xpReward: 150,
    rarity: 'common',
  },
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    emoji: '⚔️',
    criteria: { type: 'streak', value: 7 },
    xpReward: 300,
    rarity: 'rare',
  },
  UNSTOPPABLE: {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: 'Maintain a 30-day learning streak',
    emoji: '🚀',
    criteria: { type: 'streak', value: 30 },
    xpReward: 1000,
    rarity: 'epic',
  },

  // Achievement Badges
  PERFECT_SCORE: {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Get 100% on any test',
    emoji: '💯',
    criteria: { type: 'perfect_test', value: 1 },
    xpReward: 200,
    rarity: 'rare',
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete 5 lessons in one day',
    emoji: '⚡',
    criteria: { type: 'lessons_per_day', value: 5 },
    xpReward: 250,
    rarity: 'rare',
  },
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 25 lessons',
    emoji: '📚',
    criteria: { type: 'lessons_completed', value: 25 },
    xpReward: 500,
    rarity: 'rare',
  },
  MASTER_LEARNER: {
    id: 'master_learner',
    name: 'Master Learner',
    description: 'Complete 100 lessons',
    emoji: '🎓',
    criteria: { type: 'lessons_completed', value: 100 },
    xpReward: 2000,
    rarity: 'legendary',
  },

  // Challenge Badges
  CHALLENGE_ACCEPTED: {
    id: 'challenge_accepted',
    name: 'Challenge Accepted',
    description: 'Complete your first challenge',
    emoji: '🎯',
    criteria: { type: 'challenges_completed', value: 1 },
    xpReward: 100,
    rarity: 'common',
  },
  CHALLENGE_MASTER: {
    id: 'challenge_master',
    name: 'Challenge Master',
    description: 'Complete 20 challenges',
    emoji: '🏆',
    criteria: { type: 'challenges_completed', value: 20 },
    xpReward: 750,
    rarity: 'epic',
  },

  // XP Badges
  XP_NOVICE: {
    id: 'xp_novice',
    name: 'XP Novice',
    description: 'Earn 1,000 XP',
    emoji: '⭐',
    criteria: { type: 'xp_earned', value: 1000 },
    xpReward: 100,
    rarity: 'common',
  },
  XP_EXPERT: {
    id: 'xp_expert',
    name: 'XP Expert',
    description: 'Earn 10,000 XP',
    emoji: '🌟',
    criteria: { type: 'xp_earned', value: 10000 },
    xpReward: 500,
    rarity: 'epic',
  },
  XP_LEGEND: {
    id: 'xp_legend',
    name: 'XP Legend',
    description: 'Earn 50,000 XP',
    emoji: '✨',
    criteria: { type: 'xp_earned', value: 50000 },
    xpReward: 2500,
    rarity: 'legendary',
  },

  // Social Badges
  TOP_10: {
    id: 'top_10',
    name: 'Top 10',
    description: 'Reach top 10 on the leaderboard',
    emoji: '🥇',
    criteria: { type: 'leaderboard_rank', value: 10 },
    xpReward: 500,
    rarity: 'epic',
  },
  LEAGUE_CHAMPION: {
    id: 'league_champion',
    name: 'League Champion',
    description: 'Reach Platinum league',
    emoji: '👑',
    criteria: { type: 'league', value: 'platinum' },
    xpReward: 1500,
    rarity: 'legendary',
  },

  // Skill Badges
  SKILL_EXPLORER: {
    id: 'skill_explorer',
    name: 'Skill Explorer',
    description: 'Learn from 3 different categories',
    emoji: '🧭',
    criteria: { type: 'categories_explored', value: 3 },
    xpReward: 200,
    rarity: 'uncommon',
  },
  POLYMATH: {
    id: 'polymath',
    name: 'Polymath',
    description: 'Master 5 different skills',
    emoji: '🎨',
    criteria: { type: 'skills_mastered', value: 5 },
    xpReward: 1000,
    rarity: 'epic',
  },

  // Special Badges
  COMEBACK_KID: {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Restore a broken streak by learning again',
    emoji: '💪',
    criteria: { type: 'streak_restored', value: 1 },
    xpReward: 150,
    rarity: 'uncommon',
  },
};

export const BADGE_RARITIES = {
  common: { color: '#94a3b8', borderColor: '#64748b' },
  uncommon: { color: '#4ade80', borderColor: '#22c55e' },
  rare: { color: '#3b82f6', borderColor: '#2563eb' },
  epic: { color: '#a855f7', borderColor: '#9333ea' },
  legendary: { color: '#f59e0b', borderColor: '#d97706' },
};

// module.exports = { BADGES, BADGE_RARITIES };
