/**
 * Calculate the average mood from mood entries
 * @param {Array} moodEntries - Array of mood entry objects with mood property
 * @returns {number} Average mood value
 */
export const getMoodAverage = (moodEntries) => {
  if (!moodEntries || moodEntries.length === 0) {
    return 0;
  }

  const total = moodEntries.reduce((sum, entry) => sum + entry.mood, 0);
  return total / moodEntries.length;
};

// Constants for trend analysis
const TREND_THRESHOLD = 0.5;
const STRONG_TREND_THRESHOLD = 1.5;

/**
 * Get trend description based on direction and strength
 * @param {string} direction - Trend direction
 * @param {string} strength - Trend strength
 * @returns {string} Human-readable description
 */
const getTrendDescription = (direction, strength) => {
  const descriptions = {
    stable: 'Your mood has been relatively stable recently.',
    improving: 'Your mood has been consistently improving over the past few days.',
    declining: 'Your mood has been declining. Consider reaching out for support.',
    insufficient_data: 'Not enough data to determine trend.'
  };
  
  return descriptions[direction] || descriptions.insufficient_data;
};

/**
 * Determine trend strength based on difference magnitude
 * @param {number} difference - Mood difference value
 * @returns {string} Trend strength level
 */
const getTrendStrength = (difference) => {
  const absChange = Math.abs(difference);
  
  if (absChange < TREND_THRESHOLD) return 'stable';
  if (absChange > STRONG_TREND_THRESHOLD) return 'strong';
  return 'moderate';
};

/**
 * Calculate mood trend direction and strength
 * @param {Array} moodEntries - Array of mood entries sorted by date
 * @returns {Object} Trend analysis object
 */
export const calculateMoodTrend = (moodEntries) => {
  if (!moodEntries || moodEntries.length < 2) {
    return {
      direction: 'insufficient_data',
      strength: 'none',
      description: getTrendDescription('insufficient_data')
    };
  }

  // Calculate trend by comparing first half vs second half
  const midpoint = Math.floor(moodEntries.length / 2);
  const firstHalf = moodEntries.slice(0, midpoint);
  const secondHalf = moodEntries.slice(midpoint);

  const firstAvg = getMoodAverage(firstHalf);
  const secondAvg = getMoodAverage(secondHalf);
  const difference = secondAvg - firstAvg;

  // Determine direction
  let direction;
  if (Math.abs(difference) < TREND_THRESHOLD) {
    direction = 'stable';
  } else if (difference > 0) {
    direction = 'improving';
  } else {
    direction = 'declining';
  }

  const strength = getTrendStrength(difference);
  const description = getTrendDescription(direction, strength);

  return {
    direction,
    strength,
    description
  };
};