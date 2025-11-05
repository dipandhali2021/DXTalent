# 🏆 Badge System Documentation

## Overview

The badge system rewards users for completing various tasks and achievements throughout the platform. There are 20 different badges across 5 rarity tiers.

## Badge Rarities

- **Common** (Gray) - Easy to earn, basic achievements
- **Uncommon** (Green) - Moderate difficulty
- **Rare** (Blue) - Challenging achievements
- **Epic** (Purple) - Very difficult to earn
- **Legendary** (Gold) - Extremely rare and prestigious

## All Badges

### Beginner Badges

1. **👣 First Step** (Common) - Complete your first lesson - 50 XP
2. **🌅 Early Bird** (Uncommon) - Complete a lesson before 9 AM - 100 XP
3. **🦉 Night Owl** (Uncommon) - Complete a lesson after 10 PM - 100 XP

### Streak Badges

4. **🔥 Streak Starter** (Common) - Maintain a 3-day learning streak - 150 XP
5. **⚔️ Week Warrior** (Rare) - Maintain a 7-day learning streak - 300 XP
6. **🚀 Unstoppable** (Epic) - Maintain a 30-day learning streak - 1000 XP

### Achievement Badges

7. **💯 Perfect Score** (Rare) - Get 100% on any test - 200 XP
8. **⚡ Speed Demon** (Rare) - Complete 5 lessons in one day - 250 XP
9. **📚 Knowledge Seeker** (Rare) - Complete 25 lessons - 500 XP
10. **🎓 Master Learner** (Legendary) - Complete 100 lessons - 2000 XP

### Challenge Badges

11. **🎯 Challenge Accepted** (Common) - Complete your first challenge - 100 XP
12. **🏆 Challenge Master** (Epic) - Complete 20 challenges - 750 XP

### XP Badges

13. **⭐ XP Novice** (Common) - Earn 1,000 XP - 100 XP
14. **🌟 XP Expert** (Epic) - Earn 10,000 XP - 500 XP
15. **✨ XP Legend** (Legendary) - Earn 50,000 XP - 2500 XP

### Social Badges

16. **🥇 Top 10** (Epic) - Reach top 10 on the leaderboard - 500 XP
17. **👑 League Champion** (Legendary) - Reach Platinum league - 1500 XP

### Skill Badges

18. **🧭 Skill Explorer** (Uncommon) - Learn from 3 different categories - 200 XP
19. **🎨 Polymath** (Epic) - Master 5 different skills - 1000 XP

### Special Badges

20. **💪 Comeback Kid** (Uncommon) - Restore a broken streak - 150 XP

## How to Earn Badges

### Automatic Awarding

Badges are automatically checked and awarded when you:

- Complete a lesson
- Finish a challenge
- Maintain your learning streak
- Reach XP milestones

### Manual Check

You can also manually check for new badges:

1. Go to your Profile page
2. Scroll to the "All Badges" section
3. Click "🔍 Check for New Badges" button

## Badge Progress

- View your progress toward locked badges on your Profile page
- Each badge shows:
  - Current progress (e.g., 5/10 lessons)
  - Progress percentage
  - XP reward
  - Requirements to unlock

## Tips for Badge Collectors

1. **Complete lessons daily** to maintain streaks and earn multiple badges
2. **Try different categories** to unlock the Skill Explorer badge
3. **Aim for perfect scores** to earn bonus badges
4. **Complete challenges** for extra XP and badge progress
5. **Stay consistent** - many badges reward long-term dedication

## Notifications

When you earn a new badge:

- You'll see a toast notification
- The badge will appear in your Recent Badges section
- Your XP will be automatically updated
- The badge will unlock on your Profile page

## Viewing Badges

- **Dashboard**: See your 6 most recent earned badges
- **Profile**: View all 20 badges with filters (All/Earned/Locked)
- **Badge Details**: Click any badge to see detailed information

## Migration Scripts

For developers:

### Initialize Badge Stats for Existing Users

```bash
cd server
node src/utils/migrateBadgeStats.js
```

### Award All Eligible Badges

```bash
cd server
node src/utils/awardBadges.js
```

## Troubleshooting

### "I completed a task but didn't get the badge"

1. Try manually checking for badges using the button on Profile page
2. Refresh the page
3. Check if you already have the badge in your earned collection

### "Progress shows 100% but badge is still locked"

Run the badge awarding script:

```bash
cd server
node src/utils/awardBadges.js
```

### "No badges showing up"

Make sure:

1. Badge stats are initialized: `node src/utils/migrateBadgeStats.js`
2. Backend server is running
3. You're logged in

## Future Enhancements

- Seasonal badges
- Time-limited event badges
- Community achievement badges
- Badge showcasing on profile
- Badge trading system
- Badge leaderboards
