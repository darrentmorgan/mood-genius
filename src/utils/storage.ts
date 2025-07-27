import AsyncStorage from '@react-native-async-storage/async-storage';

export interface MoodEntry {
  id: string;
  mood: number;
  notes: string;
  timestamp: string;
  date: string;
}

const MOOD_STORAGE_KEY = 'mood_entries';

export const saveMoodEntry = async (mood: number, notes: string): Promise<void> => {
  try {
    const timestamp = new Date().toISOString();
    const date = new Date().toDateString();
    const id = Date.now().toString();
    
    const newEntry: MoodEntry = {
      id,
      mood,
      notes,
      timestamp,
      date,
    };

    const existingEntries = await getMoodEntries();
    const updatedEntries = [newEntry, ...existingEntries];
    
    await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
  } catch (error) {
    console.error('Error saving mood entry:', error);
    throw error;
  }
};

export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    const entries = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error getting mood entries:', error);
    return [];
  }
};

export const getTodaysMoodEntry = async (): Promise<MoodEntry | null> => {
  try {
    const entries = await getMoodEntries();
    const today = new Date().toDateString();
    return entries.find(entry => entry.date === today) || null;
  } catch (error) {
    console.error('Error getting today\'s mood entry:', error);
    return null;
  }
};