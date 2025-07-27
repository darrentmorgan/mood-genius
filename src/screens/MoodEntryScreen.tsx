import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {saveMoodEntry} from '../utils/storage';

const MoodEntryScreen = () => {
  const [mood, setMood] = useState(5);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveMood = async () => {
    setIsLoading(true);
    try {
      await saveMoodEntry(mood, notes);
      Alert.alert('Success', 'Your mood has been saved!');
      setNotes('');
      setMood(5);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling today?</Text>
        
        <View style={styles.moodContainer}>
          <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
          <Text style={styles.moodLabel}>{getMoodLabel(mood)}</Text>
          <Text style={styles.moodValue}>{mood}/10</Text>
        </View>

        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Rate your mood:</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={mood}
            onValueChange={setMood}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#e5e7eb"
            thumbStyle={styles.sliderThumb}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabelText}>1</Text>
            <Text style={styles.sliderLabelText}>10</Text>
          </View>
        </View>

        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes (optional):</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="How was your day? What made you feel this way?"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveMood}
          disabled={isLoading}>
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save Mood'}
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 30,
  },
  moodContainer: {
    alignItems: 'center',
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  moodLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  moodValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  sliderContainer: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 15,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#6366f1',
    width: 20,
    height: 20,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderLabelText: {
    fontSize: 14,
    color: '#6b7280',
  },
  notesContainer: {
    marginBottom: 30,
  },
  notesLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    minHeight: 100,
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default MoodEntryScreen;