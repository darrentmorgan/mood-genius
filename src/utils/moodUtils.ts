export interface MoodOption {
  value: number;
  emoji: string;
  label: string;
  color: string;
}

export const moodOptions: MoodOption[] = [
  { value: 1, emoji: '😢', label: 'Very Sad', color: '#ef4444' },
  { value: 2, emoji: '😕', label: 'Sad', color: '#f97316' },
  { value: 3, emoji: '😐', label: 'Neutral', color: '#eab308' },
  { value: 4, emoji: '🙂', label: 'Happy', color: '#22c55e' },
  { value: 5, emoji: '😄', label: 'Very Happy', color: '#10b981' },
];

export const getMoodData = (moodValue: number): MoodOption => {
  return moodOptions.find(option => option.value === moodValue) || moodOptions[2]; // Default to neutral
};

export const getMoodEmoji = (moodValue: number): string => {
  return getMoodData(moodValue).emoji;
};

export const getMoodLabel = (moodValue: number): string => {
  return getMoodData(moodValue).label;
};

export const getMoodColor = (moodValue: number): string => {
  return getMoodData(moodValue).color;
};

// Convert old 1-10 scale to new 1-5 scale (for migration)
export const convertOldMoodScale = (oldMood: number): number => {
  if (oldMood <= 2) return 1; // Very Sad
  if (oldMood <= 4) return 2; // Sad
  if (oldMood <= 6) return 3; // Neutral
  if (oldMood <= 8) return 4; // Happy
  return 5; // Very Happy
};