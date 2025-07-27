import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {saveMoodEntry} from '../utils/storageFirestore';
import {moodOptions, getMoodData} from '../utils/moodUtils';

const MoodEntryScreen = () => {
  const [mood, setMood] = useState(3); // Default to neutral (middle option)
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const notesInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();

  const getCurrentMoodData = () => {
    return getMoodData(mood);
  };

  const handleNoteFocus = () => {
    // Scroll to notes input when focused and ensure submit button is visible
    setTimeout(() => {
      notesInputRef.current?.measure((x, y, width, height, pageX, pageY) => {
        // Scroll to position the notes input in the middle of the screen
        // This ensures both the input and submit button are visible
        const scrollToY = Math.max(0, pageY - 200); // 200px from top of screen
        scrollViewRef.current?.scrollTo({ x: 0, y: scrollToY, animated: true });
      });
    }, 300); // Delay to ensure keyboard animation starts
  };

  const handleSaveMood = async () => {
    setIsLoading(true);
    try {
      await saveMoodEntry(mood, notes);
      Alert.alert('Success', 'Your mood has been saved!', [
        {
          text: 'OK',
          onPress: () => {
            setNotes('');
            setMood(3); // Reset to neutral
            navigation.navigate('Home' as never);
          }
        }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView 
        ref={scrollViewRef} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <Text style={styles.title}>How are you feeling today?</Text>
          
          <View style={styles.selectedMoodContainer}>
            <Text style={styles.selectedMoodEmoji}>{getCurrentMoodData().emoji}</Text>
            <Text style={styles.selectedMoodLabel}>{getCurrentMoodData().label}</Text>
          </View>

          <View style={styles.moodOptionsContainer}>
            <Text style={styles.moodOptionsLabel}>Choose your mood:</Text>
            <View style={styles.moodOptionsGrid}>
              {moodOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.moodOption,
                    mood === option.value && styles.selectedMoodOption,
                    mood === option.value && { borderColor: option.color }
                  ]}
                  onPress={() => setMood(option.value)}
                  activeOpacity={0.7}
                  delayPressIn={0}
                >
                  <Text style={[
                    styles.moodOptionEmoji,
                    mood === option.value && styles.selectedMoodOptionEmoji
                  ]}>
                    {option.emoji}
                  </Text>
                  <Text style={[
                    styles.moodOptionLabel,
                    mood === option.value && styles.selectedMoodOptionLabel
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.notesContainer}>
            <Text style={styles.notesLabel}>Notes (optional):</Text>
            <TextInput
              ref={notesInputRef}
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              onFocus={handleNoteFocus}
              placeholder="How was your day? What made you feel this way?"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveMood}
            disabled={isLoading}
            activeOpacity={0.8}
            delayPressIn={0}>
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Mood'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 30,
  },
  selectedMoodContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
  selectedMoodEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  selectedMoodLabel: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  moodOptionsContainer: {
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
  moodOptionsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodOption: {
    width: 60,
    height: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  selectedMoodOption: {
    backgroundColor: '#eff6ff',
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  moodOptionEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  selectedMoodOptionEmoji: {
    fontSize: 36,
  },
  moodOptionLabel: {
    fontSize: 9,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 10,
  },
  selectedMoodOptionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1e40af',
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