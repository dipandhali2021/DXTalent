/**
 * Milestone-based leveling system with 100 levels
 * Each level has a name and XP threshold
 */

// Define 100 milestone levels with names and XP thresholds
export const LEVEL_MILESTONES = [
  // Novice Tier (Levels 1-10) - Quick early progression
  { level: 1, name: 'Novice Explorer', xpThreshold: 0 },
  { level: 2, name: 'Code Initiate', xpThreshold: 100 },
  { level: 3, name: 'Digital Apprentice', xpThreshold: 250 },
  { level: 4, name: 'Syntax Learner', xpThreshold: 450 },
  { level: 5, name: 'Logic Seeker', xpThreshold: 700 },
  { level: 6, name: 'Debugging Novice', xpThreshold: 1000 },
  { level: 7, name: 'Algorithm Student', xpThreshold: 1350 },
  { level: 8, name: 'Code Enthusiast', xpThreshold: 1750 },
  { level: 9, name: 'Function Crafter', xpThreshold: 2200 },
  { level: 10, name: 'Junior Developer', xpThreshold: 2700 },

  // Intermediate Tier (Levels 11-25) - Steady progression
  { level: 11, name: 'Pattern Recognizer', xpThreshold: 3300 },
  { level: 12, name: 'Data Structures Adept', xpThreshold: 4000 },
  { level: 13, name: 'API Explorer', xpThreshold: 4800 },
  { level: 14, name: 'Framework Learner', xpThreshold: 5700 },
  { level: 15, name: 'Database Practitioner', xpThreshold: 6700 },
  { level: 16, name: 'Frontend Builder', xpThreshold: 7800 },
  { level: 17, name: 'Backend Designer', xpThreshold: 9000 },
  { level: 18, name: 'Testing Advocate', xpThreshold: 10300 },
  { level: 19, name: 'Performance Optimizer', xpThreshold: 11700 },
  { level: 20, name: 'Mid-Level Developer', xpThreshold: 13200 },
  { level: 21, name: 'Architecture Initiate', xpThreshold: 15000 },
  { level: 22, name: 'Design Pattern Scholar', xpThreshold: 17000 },
  { level: 23, name: 'Security Conscious Coder', xpThreshold: 19200 },
  { level: 24, name: 'Cloud Practitioner', xpThreshold: 21600 },
  { level: 25, name: 'DevOps Explorer', xpThreshold: 24200 },

  // Advanced Tier (Levels 26-50) - Significant challenges
  { level: 26, name: 'System Designer', xpThreshold: 27000 },
  { level: 27, name: 'Microservices Builder', xpThreshold: 30000 },
  { level: 28, name: 'Scalability Expert', xpThreshold: 33300 },
  { level: 29, name: 'Code Reviewer', xpThreshold: 36900 },
  { level: 30, name: 'Senior Developer', xpThreshold: 40800 },
  { level: 31, name: 'Tech Lead Candidate', xpThreshold: 45000 },
  { level: 32, name: 'Concurrency Master', xpThreshold: 49500 },
  { level: 33, name: 'Distributed Systems Pro', xpThreshold: 54300 },
  { level: 34, name: 'Performance Engineer', xpThreshold: 59400 },
  { level: 35, name: 'Security Specialist', xpThreshold: 64800 },
  { level: 36, name: 'Architecture Advocate', xpThreshold: 70500 },
  { level: 37, name: 'Platform Engineer', xpThreshold: 76500 },
  { level: 38, name: 'Innovation Driver', xpThreshold: 82800 },
  { level: 39, name: 'Technical Strategist', xpThreshold: 89400 },
  { level: 40, name: 'Principal Engineer', xpThreshold: 96300 },
  { level: 41, name: 'Systems Architect', xpThreshold: 103500 },
  { level: 42, name: 'Infrastructure Guru', xpThreshold: 111000 },
  { level: 43, name: 'Solution Architect', xpThreshold: 119000 },
  { level: 44, name: 'Tech Visionary', xpThreshold: 127500 },
  { level: 45, name: 'Enterprise Architect', xpThreshold: 136500 },
  { level: 46, name: 'Platform Architect', xpThreshold: 146000 },
  { level: 47, name: 'Distinguished Engineer', xpThreshold: 156000 },
  { level: 48, name: 'Technical Fellow', xpThreshold: 166500 },
  { level: 49, name: 'Chief Architect', xpThreshold: 177500 },
  { level: 50, name: 'Engineering Master', xpThreshold: 189000 },

  // Expert Tier (Levels 51-75) - Mastery level
  { level: 51, name: 'Code Sage', xpThreshold: 201000 },
  { level: 52, name: 'Algorithm Virtuoso', xpThreshold: 213500 },
  { level: 53, name: 'System Philosopher', xpThreshold: 226500 },
  { level: 54, name: 'Innovation Architect', xpThreshold: 240000 },
  { level: 55, name: 'Technology Oracle', xpThreshold: 254000 },
  { level: 56, name: 'Digital Craftsman', xpThreshold: 268500 },
  { level: 57, name: 'Engineering Luminary', xpThreshold: 283500 },
  { level: 58, name: 'Code Alchemist', xpThreshold: 299000 },
  { level: 59, name: 'Software Maestro', xpThreshold: 315000 },
  { level: 60, name: 'Tech Grandmaster', xpThreshold: 331500 },
  { level: 61, name: 'Distributed Genius', xpThreshold: 348500 },
  { level: 62, name: 'Quantum Developer', xpThreshold: 366000 },
  { level: 63, name: 'AI Integration Expert', xpThreshold: 384000 },
  { level: 64, name: 'Blockchain Pioneer', xpThreshold: 402500 },
  { level: 65, name: 'Edge Computing Specialist', xpThreshold: 421500 },
  { level: 66, name: 'Cloud Architect Supreme', xpThreshold: 441000 },
  { level: 67, name: 'Security Mastermind', xpThreshold: 461000 },
  { level: 68, name: 'Performance Wizard', xpThreshold: 481500 },
  { level: 69, name: 'DevOps Champion', xpThreshold: 502500 },
  { level: 70, name: 'Full-Stack Legend', xpThreshold: 524000 },
  { level: 71, name: 'Mobile Innovation Lead', xpThreshold: 546000 },
  { level: 72, name: 'Frontend Virtuoso', xpThreshold: 568500 },
  { level: 73, name: 'Backend Overlord', xpThreshold: 591500 },
  { level: 74, name: 'Data Pipeline Master', xpThreshold: 615000 },
  { level: 75, name: 'ML Engineering Expert', xpThreshold: 639000 },

  // Elite Tier (Levels 76-90) - Legendary status
  { level: 76, name: 'Code Immortal', xpThreshold: 663500 },
  { level: 77, name: 'Tech Emperor', xpThreshold: 688500 },
  { level: 78, name: 'Digital God', xpThreshold: 714000 },
  { level: 79, name: 'Architecture Deity', xpThreshold: 740000 },
  { level: 80, name: 'Silicon Valley Elite', xpThreshold: 766500 },
  { level: 81, name: 'Open Source Hero', xpThreshold: 793500 },
  { level: 82, name: 'Unicorn Creator', xpThreshold: 821000 },
  { level: 83, name: 'Tech Titan', xpThreshold: 849000 },
  { level: 84, name: 'Innovation Messiah', xpThreshold: 877500 },
  { level: 85, name: 'Digital Renaissance Master', xpThreshold: 906500 },
  { level: 86, name: 'Code Transcendent', xpThreshold: 936000 },
  { level: 87, name: 'Tech Enlightened', xpThreshold: 966000 },
  { level: 88, name: 'Software Ascendant', xpThreshold: 996500 },
  { level: 89, name: 'Engineering Nirvana', xpThreshold: 1027500 },
  { level: 90, name: 'Digital Omniscient', xpThreshold: 1059000 },

  // Legendary Tier (Levels 91-100) - Ultimate achievement
  { level: 91, name: 'Code Universe Creator', xpThreshold: 1091000 },
  { level: 92, name: 'Tech Dimension Walker', xpThreshold: 1123500 },
  { level: 93, name: 'Infinity Algorithm', xpThreshold: 1156500 },
  { level: 94, name: 'Quantum Supremacy', xpThreshold: 1190000 },
  { level: 95, name: 'Digital Singularity', xpThreshold: 1224000 },
  { level: 96, name: 'Eternal Codemaster', xpThreshold: 1258500 },
  { level: 97, name: 'Cosmic Developer', xpThreshold: 1293500 },
  { level: 98, name: 'Omnipotent Engineer', xpThreshold: 1329000 },
  { level: 99, name: 'Tech Absolute', xpThreshold: 1365000 },
  { level: 100, name: 'DXTalent Legend', xpThreshold: 1401500 },
];

/**
 * Compute level, level name, and XP progress from total XP
 * @param {number} totalXP - Total XP earned by the user
 * @returns {object} Level information including level number, name, and progress
 */
export function computeLevelFromXP(totalXP) {
  if (totalXP < 0) totalXP = 0;

  // Find the current level based on XP thresholds
  let currentLevel = LEVEL_MILESTONES[0];
  let nextLevel = LEVEL_MILESTONES[1];

  for (let i = 0; i < LEVEL_MILESTONES.length; i++) {
    if (totalXP >= LEVEL_MILESTONES[i].xpThreshold) {
      currentLevel = LEVEL_MILESTONES[i];
      nextLevel = LEVEL_MILESTONES[i + 1] || currentLevel; // Max level reached
    } else {
      break;
    }
  }

  // Calculate XP progress in current level
  const xpIntoLevel = totalXP - currentLevel.xpThreshold;
  const xpForNextLevel = nextLevel.xpThreshold - currentLevel.xpThreshold;
  const isMaxLevel = currentLevel.level === 100;

  return {
    level: currentLevel.level,
    levelName: currentLevel.name,
    xpIntoLevel: isMaxLevel ? 0 : xpIntoLevel,
    xpForNextLevel: isMaxLevel ? 0 : xpForNextLevel,
    xpProgress: isMaxLevel
      ? 100
      : Math.floor((xpIntoLevel / xpForNextLevel) * 100),
    totalXP,
    nextLevelName: isMaxLevel ? 'Max Level' : nextLevel.name,
    isMaxLevel,
  };
}

/**
 * Calculate XP to award based on lesson difficulty
 * @param {string} difficulty - 'Beginner', 'Intermediate', or 'Advanced'
 * @param {boolean} isFirstCompletion - Whether this is the first time completing the lesson
 * @returns {number} XP to award
 */
export function calculateLessonXP(
  difficulty,
  isFirstCompletion,
  correctAnswers = null,
  totalQuestions = null
) {
  const baseXP = {
    Beginner: 50,
    Intermediate: 100,
    Advanced: 150,
  };

  const maxXP = baseXP[difficulty] || baseXP.Beginner;

  // Award only 10 XP for repeat completions
  if (!isFirstCompletion) {
    return 10;
  }

  // If correctAnswers and totalQuestions are provided, calculate proportional XP
  if (
    correctAnswers !== null &&
    totalQuestions !== null &&
    totalQuestions > 0
  ) {
    const scorePercentage = correctAnswers / totalQuestions;
    return Math.round(maxXP * scorePercentage);
  }

  // Otherwise return full XP (backward compatibility)
  return maxXP;
}

/**
 * Get level tier information for UI styling
 * @param {number} level - Level number
 * @returns {object} Tier information
 */
export function getLevelTier(level) {
  if (level <= 10) {
    return { tier: 'Novice', color: '#10b981', bgColor: '#d1fae5' };
  } else if (level <= 25) {
    return { tier: 'Intermediate', color: '#3b82f6', bgColor: '#dbeafe' };
  } else if (level <= 50) {
    return { tier: 'Advanced', color: '#8b5cf6', bgColor: '#ede9fe' };
  } else if (level <= 75) {
    return { tier: 'Expert', color: '#f59e0b', bgColor: '#fef3c7' };
  } else if (level <= 90) {
    return { tier: 'Elite', color: '#ef4444', bgColor: '#fee2e2' };
  } else {
    return { tier: 'Legendary', color: '#d946ef', bgColor: '#fae8ff' };
  }
}

/**
 * Get all level milestones (useful for leaderboards and UI)
 * @returns {array} Array of all level milestones
 */
export function getAllLevelMilestones() {
  return LEVEL_MILESTONES;
}

/**
 * Get level info by level number
 * @param {number} levelNumber - Level number to look up
 * @returns {object|null} Level milestone or null if not found
 */
export function getLevelByNumber(levelNumber) {
  return LEVEL_MILESTONES.find((m) => m.level === levelNumber) || null;
}
