import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {getTodaysMoodEntry, getMoodEntries, MoodEntry} from '../utils/storage';
import {getHealthSettings} from '../utils/healthSettings';
import MockHealthService from '../services/MockHealthService';
import {HealthData} from '../types/health';

const HomeScreen = () => {
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
  const [recentEntries, setRecentEntries] = useState<MoodEntry[]>([]);
  const [todaysHealth, setTodaysHealth] = useState<HealthData | null>(null);
  const [showHealthData, setShowHealthData] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const loadData = async () => {
    try {
      const [todaysEntry, allEntries, healthSettings] = await Promise.all([
        getTodaysMoodEntry(),
        getMoodEntries(),
        getHealthSettings(),
      ]);
      
      setTodaysMood(todaysEntry);
      setRecentEntries(allEntries.slice(0, 3));
      setShowHealthData(healthSettings.useMockData);
      
      if (healthSettings.useMockData) {
        const todaysHealthData = await MockHealthService.getTodaysHealthData();
        setTodaysHealth(todaysHealthData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getMoodEmoji = (moodValue: number) => {
    if (moodValue <= 2) return '😢';
    if (moodValue <= 4) return '😕';
    if (moodValue <= 6) return '😐';
    if (moodValue <= 8) return '🙂';
    return '😄';
  };

  const getMoodLabel = (moodValue: number) => {
    if (moodValue <= 2) return 'Very Sad';
    if (moodValue <= 4) return 'Sad';
    if (moodValue <= 6) return 'Neutral';
    if (moodValue <= 8) return 'Happy';
    return 'Very Happy';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleQuickEntry = () => {
    navigation.navigate('Mood Entry' as never);
  };

  const handleViewHistory = () => {
    navigation.navigate('History' as never);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.content}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subtitle}>How are you feeling today?</Text>

        {todaysMood ? (
          <View style={styles.todaysMoodCard}>
            <Text style={styles.cardTitle}>Today's Mood</Text>
            <View style={styles.moodDisplay}>
              <Text style={styles.moodEmoji}>
                {getMoodEmoji(todaysMood.mood)}
              </Text>
              <View style={styles.moodInfo}>
                <Text style={styles.moodValue}>{todaysMood.mood}/10</Text>
                <Text style={styles.moodLabel}>
                  {getMoodLabel(todaysMood.mood)}
                </Text>
              </View>
            </View>
            {todaysMood.notes ? (
              <View style={styles.notesPreview}>
                <Text style={styles.notesLabel}>Your notes:</Text>
                <Text style={styles.notes} numberOfLines={2}>
                  {todaysMood.notes}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.noMoodCard}>
            <Text style={styles.noMoodEmoji}>🤔</Text>
            <Text style={styles.noMoodText}>
              You haven't logged your mood today yet
            </Text>
            <TouchableOpacity
              style={styles.quickEntryButton}
              onPress={handleQuickEntry}>
              <Text style={styles.quickEntryButtonText}>Log Your Mood</Text>
            </TouchableOpacity>
          </View>
        )}

        {recentEntries.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Entries</Text>
              <TouchableOpacity onPress={handleViewHistory}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {recentEntries.map(entry => (
              <View key={entry.id} style={styles.recentEntry}>
                <Text style={styles.recentMoodEmoji}>
                  {getMoodEmoji(entry.mood)}
                </Text>
                <View style={styles.recentMoodInfo}>
                  <Text style={styles.recentMoodValue}>{entry.mood}/10</Text>
                  <Text style={styles.recentDate}>
                    {formatDate(entry.timestamp)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {showHealthData && todaysHealth && (
          <View style={styles.healthSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Today's Health</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Insights' as never)}>
                <Text style={styles.viewAllText}>AI Insights</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.healthGrid}>
              <View style={styles.healthCard}>
                <Text style={styles.healthIcon}>😴</Text>
                <Text style={styles.healthValue}>{todaysHealth.sleep.duration.toFixed(1)}h</Text>
                <Text style={styles.healthLabel}>Sleep</Text>
                <Text style={styles.healthQuality}>{todaysHealth.sleep.quality}</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthIcon}>🚶‍♂️</Text>
                <Text style={styles.healthValue}>{todaysHealth.steps.count.toLocaleString()}</Text>
                <Text style={styles.healthLabel}>Steps</Text>
                <Text style={styles.healthQuality}>{todaysHealth.steps.distance.toFixed(1)}km</Text>
              </View>
              <View style={styles.healthCard}>
                <Text style={styles.healthIcon}>❤️</Text>
                <Text style={styles.healthValue}>{todaysHealth.heartRate.resting}</Text>
                <Text style={styles.healthLabel}>Resting HR</Text>
                <Text style={styles.healthQuality}>HRV {todaysHealth.heartRate.variability}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleQuickEntry}>
            <Text style={styles.actionButtonEmoji}>✨</Text>
            <Text style={styles.actionButtonText}>Add New Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewHistory}>
            <Text style={styles.actionButtonEmoji}>📊</Text>
            <Text style={styles.actionButtonText}>View History</Text>
          </TouchableOpacity>
          {showHealthData && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('Insights' as never)}>
              <Text style={styles.actionButtonEmoji}>🤖</Text>
              <Text style={styles.actionButtonText}>AI Insights</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
  },
  todaysMoodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  moodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  moodEmoji: {
    fontSize: 60,
    marginRight: 16,
  },
  moodInfo: {
    alignItems: 'flex-start',
  },
  moodValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  moodLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  notesPreview: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  noMoodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  noMoodEmoji: {
    fontSize: 60,
    marginBottom: 16,
  },
  noMoodText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  quickEntryButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  quickEntryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  recentSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  recentEntry: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  recentMoodEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  recentMoodInfo: {
    flex: 1,
  },
  recentMoodValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recentDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionButtonEmoji: {
    fontSize: 24,
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  healthSection: {
    marginBottom: 24,
  },
  healthGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  healthCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  healthIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  healthLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  healthQuality: {
    fontSize: 10,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default HomeScreen;