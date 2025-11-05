import {
  getUserBadgesWithProgress,
  claimBadge,
  getUnclaimedBadges,
  checkAndAwardBadges,
} from '../utils/badgeService.js';
import { BADGES, BADGE_RARITIES } from '../config/badges.js';

/**
 * Get all badges with user's progress
 * GET /api/badges
 */
export const getAllBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const badges = await getUserBadgesWithProgress(userId);

    res.json({
      success: true,
      data: {
        badges,
        rarities: BADGE_RARITIES,
      },
    });
  } catch (error) {
    console.error('Error fetching badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
    });
  }
};

/**
 * Get unclaimed badges (newly earned)
 * GET /api/badges/unclaimed
 */
export const getUnclaimed = async (req, res) => {
  try {
    const userId = req.user.id;
    const unclaimed = await getUnclaimedBadges(userId);

    res.json({
      success: true,
      data: {
        badges: unclaimed,
      },
    });
  } catch (error) {
    console.error('Error fetching unclaimed badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unclaimed badges',
    });
  }
};

/**
 * Claim a badge (mark as viewed)
 * POST /api/badges/:badgeId/claim
 */
export const claimBadgeById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { badgeId } = req.params;

    const success = await claimBadge(userId, badgeId);

    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Badge not found or already claimed',
      });
    }

    res.json({
      success: true,
      message: 'Badge claimed successfully',
    });
  } catch (error) {
    console.error('Error claiming badge:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to claim badge',
    });
  }
};

/**
 * Check for new badges and award them
 * POST /api/badges/check
 */
export const checkBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const newBadges = await checkAndAwardBadges(userId);

    res.json({
      success: true,
      data: {
        newBadges,
        count: newBadges.length,
      },
    });
  } catch (error) {
    console.error('Error checking badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check badges',
    });
  }
};

/**
 * Get badge configuration (for reference)
 * GET /api/badges/config
 */
export const getBadgeConfig = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        badges: BADGES,
        rarities: BADGE_RARITIES,
      },
    });
  } catch (error) {
    console.error('Error fetching badge config:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badge configuration',
    });
  }
};
