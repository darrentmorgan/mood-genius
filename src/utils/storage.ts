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

// Generate sample mood entries for testing purposes
export const generateSampleMoodEntries = async (force: boolean = false): Promise<void> => {
  try {
    console.log('🎭 Starting sample mood entries generation...');
    
    const existingEntries = await getMoodEntries();
    console.log(`📊 Found ${existingEntries.length} existing mood entries`);
    
    if (existingEntries.length >= 5 && !force) {
      console.log('✅ Already have enough mood entries for testing (5+)');
      return;
    }

    const sampleEntries: MoodEntry[] = [];
    const sampleData = [
      { mood: 4, notes: "Had a great workout this morning! Feeling energized and positive.", daysAgo: 0 },
      { mood: 2, notes: "Stressed about work deadlines. Didn't sleep well last night.", daysAgo: 1 },
      { mood: 5, notes: "Amazing day! Spent time with friends and got good news about a project.", daysAgo: 2 },
      { mood: 3, notes: "Neutral day. Nothing particularly good or bad happened.", daysAgo: 3 },
      { mood: 1, notes: "Really tough day. Multiple things went wrong and feeling overwhelmed.", daysAgo: 4 },
      { mood: 4, notes: "Better day today. Managed to resolve some issues and feel more hopeful.", daysAgo: 5 },
      { mood: 3, notes: "Decent day overall. Work was busy but manageable.", daysAgo: 6 },
    ];

    let entriesToCreate;
    if (force) {
      entriesToCreate = 7; // Always create 7 entries when forced
      console.log(`📝 Force mode: Will create ${entriesToCreate} sample entries`);
    } else {
      entriesToCreate = Math.min(7, Math.max(5, 7 - existingEntries.length));
      console.log(`📝 Auto mode: Will create ${entriesToCreate} sample entries`);
    }

    for (let i = 0; i < entriesToCreate; i++) {
      const sample = sampleData[i];
      const entryDate = new Date();
      entryDate.setDate(entryDate.getDate() - sample.daysAgo);
      entryDate.setHours(14 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60), 0, 0);
      
      console.log(`Creating entry for ${sample.daysAgo} days ago: ${entryDate.toDateString()}`);
      
      const entry: MoodEntry = {
        id: `sample_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
        mood: sample.mood,
        notes: sample.notes,
        timestamp: entryDate.toISOString(),
        date: entryDate.toDateString(),
      };
      
      sampleEntries.push(entry);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`📦 Created ${sampleEntries.length} sample entries`);

    let allEntries;
    if (force) {
      // When forced, replace all entries with sample data
      allEntries = sampleEntries.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      console.log(`💾 Force mode: Replacing all entries with ${allEntries.length} sample entries`);
    } else {
      // Merge with existing entries and sort by timestamp (newest first)
      allEntries = [...existingEntries, ...sampleEntries].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      console.log(`💾 Auto mode: Saving ${allEntries.length} total entries to storage`);
    }
    await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(allEntries));
    
    console.log(`✅ Successfully generated ${sampleEntries.length} sample mood entries`);
    console.log('📅 Sample entries dates:', sampleEntries.map(e => `${e.date} (mood: ${e.mood})`));
  } catch (error) {
    console.error('❌ Error generating sample mood entries:', error);
    throw error;
  }
};

// Clear all mood entries (useful for testing)
export const clearMoodEntries = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(MOOD_STORAGE_KEY);
    console.log('🗑️ Cleared all mood entries');
  } catch (error) {
    console.error('❌ Error clearing mood entries:', error);
  }
};

// Debug function to verify mood data exists
export const debugMoodEntries = async (): Promise<void> => {
  try {
    const entries = await getMoodEntries();
    console.log('🔍 Debug: Mood entries count:', entries.length);
    entries.forEach((entry, index) => {
      console.log(`🔍 Entry ${index + 1}: ${entry.date} - Mood ${entry.mood} - "${entry.notes.substring(0, 30)}..."`);
    });
  } catch (error) {
    console.error('❌ Error debugging mood entries:', error);
  }
};