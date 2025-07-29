import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MoodButton } from './ui';
import { theme } from '../theme';

const ModernEmoticonMoodSelector = ({ selectedMood, onMoodSelect, testID }) => {
  const moodOptions = [
    { mood: 2, label: 'awful', emoticon: '😭' },
    { mood: 4, label: 'bad', emoticon: '😔' },
    { mood: 6, label: 'meh', emoticon: '😑' },
    { mood: 8, label: 'good', emoticon: '😀' },
    { mood: 10, label: 'great', emoticon: '😁' },
  ];

  const handleMoodSelect = (moodData) => {
    onMoodSelect(moodData);
  };

  return (
    <View style={styles.container} testID={testID || "mood-selector-container"}>
      {moodOptions.map((option) => (
        <MoodButton
          key={option.mood}
          mood={option.mood}
          label={option.label}
          emoticon={option.emoticon}
          selected={selectedMood === option.mood}
          onPress={handleMoodSelect}
          size="medium"
          testID={`mood-option-${option.label}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[4],
  },
});

export default ModernEmoticonMoodSelector;