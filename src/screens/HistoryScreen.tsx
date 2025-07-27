import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getMoodEntries, MoodEntry} from '../utils/storageFirestore';
import {getMoodEmoji, getMoodLabel} from '../utils/moodUtils';

const HistoryScreen = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadEntries = async () => {
    try {
      const moodEntries = await getMoodEntries();
      setEntries(moodEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMoodEntry = ({item}: {item: MoodEntry}) => (
    <TouchableOpacity style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <View style={styles.moodInfo}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
          <View style={styles.moodDetails}>
            <Text style={styles.moodValue}>{item.mood}/5</Text>
            <Text style={styles.moodLabel}>{getMoodLabel(item.mood)}</Text>
          </View>
        </View>
        <View style={styles.dateInfo}>
          <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
          <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
      {item.notes ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes:</Text>
          <Text style={styles.notes}>{item.notes}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📊</Text>
      <Text style={styles.emptyTitle}>No mood entries yet</Text>
      <Text style={styles.emptyText}>
        Start tracking your mood to see your history here!
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderMoodEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={EmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  entryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  moodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  moodDetails: {
    flex: 1,
  },
  moodValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  moodLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  dateInfo: {
    alignItems: 'flex-end',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
  notesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notes: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default HistoryScreen;