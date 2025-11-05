import { useEffect } from 'react';
import { useToast } from './use-toast';
import { badgeAPI } from '@/lib/api';

/**
 * Hook to check for and display new badge notifications
 */
export const useBadgeNotifications = () => {
    const { toast } = useToast();

    const checkForNewBadges = async () => {
        try {
            const response = await badgeAPI.getUnclaimedBadges();
            if (response.success && response.data.badges.length > 0) {
                // Show notification for each new badge
                response.data.badges.forEach((badge: any) => {
                    toast({
                        title: `🎉 New Badge Unlocked: ${badge.emoji} ${badge.name}`,
                        description: `${badge.description} | +${badge.xpReward} XP Earned!`,
                        duration: 8000,
                    });

                    // Mark badge as claimed
                    badgeAPI.claimBadge(badge.id);
                });
            }
        } catch (error) {
            console.error('Error checking for new badges:', error);
        }
    };

    return { checkForNewBadges };
};
