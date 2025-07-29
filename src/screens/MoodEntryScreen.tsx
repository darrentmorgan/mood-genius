import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {saveMoodEntry} from '../utils/storageFirestore';
import ModernMoodEntryCard from '../components/ModernMoodEntryCard';

const MoodEntryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSaveMood = async (moodData) => {
    try {
      setIsLoading(true);
      console.log('🎭 MoodEntryScreen: Saving mood entry...', moodData);
      
      await saveMoodEntry(moodData.mood, moodData.notes);
      
      console.log('✅ MoodEntryScreen: Mood entry saved successfully');
      Alert.alert(
        'Success',
        'Your mood has been saved!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Home' as never),
          },
        ]
      );
    } catch (error) {
      console.error('❌ MoodEntryScreen: Failed to save mood entry:', error);
      Alert.alert('Error', 'Failed to save your mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ModernMoodEntryCard onSave={handleSaveMood} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 100,
    minHeight: '100%',
  },
});

export default MoodEntryScreen;