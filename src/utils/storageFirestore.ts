import AsyncStorage from '@react-native-async-storage/async-storage';
import FirestoreService from '../services/FirestoreService';
import AuthService from '../services/AuthService';

export interface MoodEntry {
  id: string;
  mood: number;
  notes: string;
  timestamp: string;
  date: string;
}

const MOOD_STORAGE_KEY = 'mood_entries_offline';

// Check if user is authenticated and online
const canUseFirestore = () => {
  return AuthService.isAuthenticated();
};

export const saveMoodEntry = async (mood: number, notes: string): Promise<void> => {
  try {
    if (canUseFirestore()) {
      // Save to Firestore
      await FirestoreService.saveMoodEntry(mood, notes);
    } else {
      // Fallback to AsyncStorage
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

      const existingEntries = await getMoodEntriesFromLocal();
      const updatedEntries = [newEntry, ...existingEntries];
      
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries));
      console.log('💾 Mood entry saved to AsyncStorage (offline mode)');
    }
  } catch (error) {
    console.error('❌ Error saving mood entry:', error);
    throw error;
  }
};

export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    if (canUseFirestore()) {
      // Get from Firestore
      return await FirestoreService.getMoodEntries();
    } else {
      // Fallback to AsyncStorage
      return await getMoodEntriesFromLocal();
    }
  } catch (error) {
    console.error('❌ Error getting mood entries:', error);
    // Fallback to local storage if Firestore fails
    return await getMoodEntriesFromLocal();
  }
};

export const getTodaysMoodEntry = async (): Promise<MoodEntry | null> => {
  try {
    if (canUseFirestore()) {
      // Get from Firestore
      return await FirestoreService.getTodaysMoodEntry();
    } else {
      // Fallback to AsyncStorage
      const entries = await getMoodEntriesFromLocal();
      const today = new Date().toDateString();
      return entries.find(entry => entry.date === today) || null;
    }
  } catch (error) {
    console.error('❌ Error getting today\'s mood entry:', error);
    return null;
  }
};

// Helper function to get mood entries from AsyncStorage
const getMoodEntriesFromLocal = async (): Promise<MoodEntry[]> => {
  try {
    const entries = await AsyncStorage.getItem(MOOD_STORAGE_KEY);
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('❌ Error getting local mood entries:', error);
    return [];
  }
};

// Generate sample mood entries for testing purposes
export const generateSampleMoodEntries = async (force: boolean = false): Promise<void> => {
  try {
    if (canUseFirestore()) {
      // Generate in Firestore
      await FirestoreService.generateSampleMoodEntries(force);
    } else {
      // Generate in AsyncStorage
      console.log('🎭 Starting sample mood entries generation in AsyncStorage...');
      
      const existingEntries = await getMoodEntriesFromLocal();
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
        entriesToCreate = 7;
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
        
        const entry: MoodEntry = {
          id: `sample_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          mood: sample.mood,
          notes: sample.notes,
          timestamp: entryDate.toISOString(),
          date: entryDate.toDateString(),
        };
        
        sampleEntries.push(entry);
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      let allEntries;
      if (force) {
        allEntries = sampleEntries.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        console.log(`💾 Force mode: Replacing all entries with ${allEntries.length} sample entries`);
      } else {
        allEntries = [...existingEntries, ...sampleEntries].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        console.log(`💾 Auto mode: Saving ${allEntries.length} total entries to storage`);
      }
      
      await AsyncStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(allEntries));
      console.log(`✅ Successfully generated ${sampleEntries.length} sample mood entries in AsyncStorage`);
    }
  } catch (error) {
    console.error('❌ Error generating sample mood entries:', error);
    throw error;
  }
};

// Clear all mood entries (useful for testing)
export const clearMoodEntries = async (): Promise<void> => {
  try {
    if (canUseFirestore()) {
      // Clear from Firestore
      await FirestoreService.clearMoodEntries();
    } else {
      // Clear from AsyncStorage
      await AsyncStorage.removeItem(MOOD_STORAGE_KEY);
      console.log('🗑️ Cleared all mood entries from AsyncStorage');
    }
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

// Sync offline data to Firestore when user comes online
export const syncOfflineDataToFirestore = async (): Promise<void> => {
  try {
    if (!canUseFirestore()) {
      console.log('⚠️ Cannot sync: User not authenticated');
      return;
    }

    console.log('🔄 Starting offline data sync to Firestore...');
    const offlineEntries = await getMoodEntriesFromLocal();
    
    if (offlineEntries.length === 0) {
      console.log('✅ No offline data to sync');
      return;
    }

    // Check what's already in Firestore to avoid duplicates
    const firestoreEntries = await FirestoreService.getMoodEntries();
    const firestoreTimestamps = new Set(firestoreEntries.map(entry => entry.timestamp));
    
    // Filter out entries that already exist in Firestore
    const entriesToSync = offlineEntries.filter(entry => !firestoreTimestamps.has(entry.timestamp));
    
    if (entriesToSync.length === 0) {
      console.log('✅ All offline data already synced');
      return;
    }

    console.log(`📤 Syncing ${entriesToSync.length} offline entries to Firestore...`);
    
    // Save each entry to Firestore
    for (const entry of entriesToSync) {
      await FirestoreService.saveMoodEntry(entry.mood, entry.notes);
    }

    // Clear offline storage after successful sync
    await AsyncStorage.removeItem(MOOD_STORAGE_KEY);
    console.log('✅ Offline data synced successfully and local cache cleared');
  } catch (error) {
    console.error('❌ Error syncing offline data:', error);
  }
};