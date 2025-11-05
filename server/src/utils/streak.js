/**
 * Streak calculation and management utilities
 * Streaks are based on consecutive days with at least one lesson completed
 */

/**
 * Get date string in YYYY-MM-DD format for consistent date comparison
 * @param {Date} date - Date object
 * @returns {string} Date string in YYYY-MM-DD format
 */
export function getDateString(date = new Date()) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Check if two dates are consecutive days
 * @param {Date|string} date1 - First date
 * @param {Date|string} date2 - Second date
 * @returns {boolean} True if dates are consecutive
 */
export function areConsecutiveDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  // Reset time to midnight for accurate day comparison
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays === 1;
}

/**
 * Check if a date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is today
 */
export function isToday(date) {
  const today = getDateString(new Date());
  const checkDate = getDateString(new Date(date));
  return today === checkDate;
}

/**
 * Check if a date is yesterday
 * @param {Date|string} date - Date to check
 * @returns {boolean} True if date is yesterday
 */
export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getDateString(yesterday);
  const checkDate = getDateString(new Date(date));
  return yesterdayStr === checkDate;
}

/**
 * Calculate and update user's streak based on lesson completion
 * @param {Object} user - User document with stats and dailyActivity
 * @param {Date} completionDate - Date of lesson completion (defaults to now)
 * @returns {Object} Updated streak information
 */
export function updateStreak(user, completionDate = new Date()) {
  const todayStr = getDateString(completionDate);
  const lastLessonDate = user.stats.lastLessonDate;

  // Initialize dailyActivity if not exists
  if (!user.dailyActivity) {
    user.dailyActivity = new Map();
  }

  // Increment today's activity count
  const currentCount = user.dailyActivity.get(todayStr) || 0;
  user.dailyActivity.set(todayStr, currentCount + 1);

  // If this is the first lesson today, update streak
  if (currentCount === 0) {
    if (!lastLessonDate) {
      // First lesson ever - start streak at 1
      user.stats.currentStreak = 1;
      user.stats.longestStreak = 1;
    } else if (isToday(lastLessonDate)) {
      // Already completed lesson today, streak unchanged
      // (no-op, just increment activity count which we did above)
    } else if (isYesterday(lastLessonDate)) {
      // Consecutive day - increment streak
      user.stats.currentStreak += 1;

      // Update longest streak if current is higher
      if (user.stats.currentStreak > user.stats.longestStreak) {
        user.stats.longestStreak = user.stats.currentStreak;
      }
    } else {
      // Gap in activity - reset streak to 1
      user.stats.currentStreak = 1;
    }
  }

  // Update last lesson date
  user.stats.lastLessonDate = completionDate;

  return {
    currentStreak: user.stats.currentStreak,
    longestStreak: user.stats.longestStreak,
    todayLessons: user.dailyActivity.get(todayStr),
    streakIncreased:
      currentCount === 0 &&
      (!lastLessonDate ||
        isYesterday(lastLessonDate) ||
        (!isToday(lastLessonDate) && !lastLessonDate)),
  };
}

/**
 * Get activity data for a date range (for heatmap)
 * @param {Map} dailyActivity - User's daily activity map
 * @param {number} days - Number of days to retrieve (default 365)
 * @param {number} month - Optional month (0-11) for monthly view
 * @param {number} year - Optional year for monthly view
 * @returns {Array} Array of {date, count} objects
 */
export function getActivityData(
  dailyActivity,
  days = 365,
  month = null,
  year = null
) {
  const result = [];

  // If month and year are provided, get data for that specific month
  if (month !== null && year !== null) {
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = getDateString(date);

      result.push({
        date: dateStr,
        count: dailyActivity?.get(dateStr) || 0,
      });
    }
  } else {
    // Default behavior: last N days
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = getDateString(date);

      result.push({
        date: dateStr,
        count: dailyActivity?.get(dateStr) || 0,
      });
    }
  }

  return result;
}

/**
 * Calculate streak bonus XP multiplier (optional feature)
 * @param {number} currentStreak - Current streak days
 * @returns {number} Multiplier (1.0 to 1.5)
 */
export function getStreakXPBonus(currentStreak) {
  if (currentStreak <= 0) return 1.0;

  // +2% per streak day, capped at +50% (25 day streak)
  const bonusPercent = Math.min(currentStreak * 2, 50);
  return 1.0 + bonusPercent / 100;
}
