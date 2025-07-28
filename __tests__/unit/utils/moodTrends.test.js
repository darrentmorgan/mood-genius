import { calculateMoodTrend, getMoodAverage } from '../../../src/utils/moodTrends';

describe('Mood Trends Utility', () => {
  describe('getMoodAverage', () => {
    it('should calculate average mood from mood entries', () => {
      const mockMoodEntries = [
        { mood: 8, date: '2024-01-01' },
        { mood: 6, date: '2024-01-02' },
        { mood: 7, date: '2024-01-03' },
      ];

      const average = getMoodAverage(mockMoodEntries);

      expect(average).toBe(7); // (8 + 6 + 7) / 3 = 7
    });

    it('should return 0 for empty mood entries', () => {
      const average = getMoodAverage([]);
      expect(average).toBe(0);
    });

    it('should handle single mood entry', () => {
      const mockMoodEntries = [{ mood: 9, date: '2024-01-01' }];
      const average = getMoodAverage(mockMoodEntries);
      expect(average).toBe(9);
    });
  });

  describe('calculateMoodTrend', () => {
    it('should return "improving" for upward trend', () => {
      const mockMoodEntries = [
        { mood: 5, date: '2024-01-01' },
        { mood: 6, date: '2024-01-02' },
        { mood: 7, date: '2024-01-03' },
        { mood: 8, date: '2024-01-04' },
      ];

      const trend = calculateMoodTrend(mockMoodEntries);

      expect(trend).toEqual({
        direction: 'improving',
        strength: 'strong',
        description: 'Your mood has been consistently improving over the past few days.'
      });
    });

    it('should return "declining" for downward trend', () => {
      const mockMoodEntries = [
        { mood: 8, date: '2024-01-01' },
        { mood: 7, date: '2024-01-02' },
        { mood: 6, date: '2024-01-03' },
        { mood: 4, date: '2024-01-04' },
      ];

      const trend = calculateMoodTrend(mockMoodEntries);

      expect(trend).toEqual({
        direction: 'declining',
        strength: 'strong',
        description: 'Your mood has been declining. Consider reaching out for support.'
      });
    });

    it('should return "stable" for consistent mood', () => {
      const mockMoodEntries = [
        { mood: 7, date: '2024-01-01' },
        { mood: 7, date: '2024-01-02' },
        { mood: 7, date: '2024-01-03' },
        { mood: 7, date: '2024-01-04' },
      ];

      const trend = calculateMoodTrend(mockMoodEntries);

      expect(trend.direction).toBe('stable');
    });
  });
});