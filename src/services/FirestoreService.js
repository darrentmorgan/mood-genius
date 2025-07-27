import firestore from '@react-native-firebase/firestore';
import AuthService from './AuthService';

class FirestoreService {
  constructor() {
    this.db = firestore();
  }

  // Get current user ID
  getCurrentUserId() {
    const user = AuthService.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }
    return user.uid;
  }

  // Get user's mood entries collection reference
  getUserMoodEntriesRef() {
    const userId = this.getCurrentUserId();
    return this.db.collection('users').doc(userId).collection('moodEntries');
  }

  // Get user's health data collection reference
  getUserHealthDataRef() {
    const userId = this.getCurrentUserId();
    return this.db.collection('users').doc(userId).collection('healthData');
  }

  // Get user's AI insights collection reference
  getUserInsightsRef() {
    const userId = this.getCurrentUserId();
    return this.db.collection('users').doc(userId).collection('aiInsights');
  }

  // MOOD ENTRIES
  async saveMoodEntry(mood, notes) {
    try {
      const timestamp = new Date().toISOString();
      const date = new Date().toDateString();
      const moodEntryRef = this.getUserMoodEntriesRef();

      const moodEntry = {
        mood,
        notes,
        timestamp,
        date,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      const docRef = await moodEntryRef.add(moodEntry);
      console.log('✅ Mood entry saved to Firestore:', docRef.id);
      
      return { ...moodEntry, id: docRef.id };
    } catch (error) {
      console.error('❌ Error saving mood entry to Firestore:', error);
      throw error;
    }
  }

  async getMoodEntries() {
    try {
      const moodEntriesRef = this.getUserMoodEntriesRef();
      const snapshot = await moodEntriesRef
        .orderBy('createdAt', 'desc')
        .get();

      const entries = [];
      snapshot.forEach(doc => {
        entries.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`📊 Retrieved ${entries.length} mood entries from Firestore`);
      return entries;
    } catch (error) {
      console.error('❌ Error getting mood entries from Firestore:', error);
      return [];
    }
  }

  async getTodaysMoodEntry() {
    try {
      const today = new Date().toDateString();
      const moodEntriesRef = this.getUserMoodEntriesRef();
      const snapshot = await moodEntriesRef
        .where('date', '==', today)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting today\'s mood entry from Firestore:', error);
      return null;
    }
  }

  async clearMoodEntries() {
    try {
      const moodEntriesRef = this.getUserMoodEntriesRef();
      const snapshot = await moodEntriesRef.get();
      
      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('🗑️ Cleared all mood entries from Firestore');
    } catch (error) {
      console.error('❌ Error clearing mood entries from Firestore:', error);
      throw error;
    }
  }

  // HEALTH DATA
  async saveHealthData(healthDataArray) {
    try {
      const healthDataRef = this.getUserHealthDataRef();
      const batch = this.db.batch();

      healthDataArray.forEach(healthEntry => {
        const docRef = healthDataRef.doc(healthEntry.id || this.db.collection('temp').doc().id);
        batch.set(docRef, {
          ...healthEntry,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`✅ Saved ${healthDataArray.length} health data entries to Firestore`);
    } catch (error) {
      console.error('❌ Error saving health data to Firestore:', error);
      throw error;
    }
  }

  async getHealthData() {
    try {
      const healthDataRef = this.getUserHealthDataRef();
      const snapshot = await healthDataRef
        .orderBy('timestamp', 'desc')
        .get();

      const healthData = [];
      snapshot.forEach(doc => {
        healthData.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`📊 Retrieved ${healthData.length} health data entries from Firestore`);
      return healthData;
    } catch (error) {
      console.error('❌ Error getting health data from Firestore:', error);
      return [];
    }
  }

  async getTodaysHealthData() {
    try {
      const today = new Date().toDateString();
      const healthDataRef = this.getUserHealthDataRef();
      const snapshot = await healthDataRef
        .where('date', '==', today)
        .limit(1)
        .get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return {
          id: doc.id,
          ...doc.data(),
        };
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting today\'s health data from Firestore:', error);
      return null;
    }
  }

  async clearHealthData() {
    try {
      const healthDataRef = this.getUserHealthDataRef();
      const snapshot = await healthDataRef.get();
      
      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('🗑️ Cleared all health data from Firestore');
    } catch (error) {
      console.error('❌ Error clearing health data from Firestore:', error);
      throw error;
    }
  }

  // AI INSIGHTS
  async saveInsights(insights) {
    try {
      const insightsRef = this.getUserInsightsRef();
      
      // Clear existing insights first
      const existingSnapshot = await insightsRef.get();
      const batch = this.db.batch();
      
      existingSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      // Add new insights
      insights.forEach(insight => {
        const docRef = insightsRef.doc(insight.id);
        batch.set(docRef, {
          ...insight,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`✅ Saved ${insights.length} AI insights to Firestore`);
    } catch (error) {
      console.error('❌ Error saving AI insights to Firestore:', error);
      throw error;
    }
  }

  async getInsights() {
    try {
      const insightsRef = this.getUserInsightsRef();
      const snapshot = await insightsRef
        .orderBy('createdAt', 'desc')
        .get();

      const insights = [];
      snapshot.forEach(doc => {
        insights.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`📊 Retrieved ${insights.length} AI insights from Firestore`);
      return insights;
    } catch (error) {
      console.error('❌ Error getting AI insights from Firestore:', error);
      return [];
    }
  }

  async clearInsights() {
    try {
      const insightsRef = this.getUserInsightsRef();
      const snapshot = await insightsRef.get();
      
      const batch = this.db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log('🗑️ Cleared all AI insights from Firestore');
    } catch (error) {
      console.error('❌ Error clearing AI insights from Firestore:', error);
      throw error;
    }
  }

  // SAMPLE DATA GENERATION
  async generateSampleMoodEntries(force = false) {
    try {
      console.log('🎭 Starting sample mood entries generation in Firestore...');
      
      const existingEntries = await this.getMoodEntries();
      console.log(`📊 Found ${existingEntries.length} existing mood entries`);
      
      if (existingEntries.length >= 5 && !force) {
        console.log('✅ Already have enough mood entries for testing (5+)');
        return;
      }

      const sampleData = [
        { mood: 4, notes: "Had a great workout this morning! Feeling energized and positive.", daysAgo: 0 },
        { mood: 2, notes: "Stressed about work deadlines. Didn't sleep well last night.", daysAgo: 1 },
        { mood: 5, notes: "Amazing day! Spent time with friends and got good news about a project.", daysAgo: 2 },
        { mood: 3, notes: "Neutral day. Nothing particularly good or bad happened.", daysAgo: 3 },
        { mood: 1, notes: "Really tough day. Multiple things went wrong and feeling overwhelmed.", daysAgo: 4 },
        { mood: 4, notes: "Better day today. Managed to resolve some issues and feel more hopeful.", daysAgo: 5 },
        { mood: 3, notes: "Decent day overall. Work was busy but manageable.", daysAgo: 6 },
      ];

      const moodEntriesRef = this.getUserMoodEntriesRef();
      const batch = this.db.batch();

      let entriesToCreate = force ? 7 : Math.min(7, Math.max(5, 7 - existingEntries.length));
      console.log(`📝 Will create ${entriesToCreate} sample entries`);

      for (let i = 0; i < entriesToCreate; i++) {
        const sample = sampleData[i];
        const entryDate = new Date();
        entryDate.setDate(entryDate.getDate() - sample.daysAgo);
        entryDate.setHours(14 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 60), 0, 0);
        
        const entry = {
          mood: sample.mood,
          notes: sample.notes,
          timestamp: entryDate.toISOString(),
          date: entryDate.toDateString(),
          createdAt: firestore.FieldValue.serverTimestamp(),
        };
        
        const docRef = moodEntriesRef.doc();
        batch.set(docRef, entry);
      }

      await batch.commit();
      console.log(`✅ Successfully generated ${entriesToCreate} sample mood entries in Firestore`);
    } catch (error) {
      console.error('❌ Error generating sample mood entries in Firestore:', error);
      throw error;
    }
  }

  // Real-time listeners
  subscribeMoodEntries(callback) {
    try {
      const moodEntriesRef = this.getUserMoodEntriesRef();
      return moodEntriesRef
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const entries = [];
          snapshot.forEach(doc => {
            entries.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          callback(entries);
        });
    } catch (error) {
      console.error('❌ Error subscribing to mood entries:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }

  subscribeInsights(callback) {
    try {
      const insightsRef = this.getUserInsightsRef();
      return insightsRef
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const insights = [];
          snapshot.forEach(doc => {
            insights.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          callback(insights);
        });
    } catch (error) {
      console.error('❌ Error subscribing to insights:', error);
      return () => {}; // Return empty unsubscribe function
    }
  }
}

export default new FirestoreService();