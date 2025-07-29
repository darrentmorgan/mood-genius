import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const EmoticonMoodSelector = ({ selectedMood, onMoodSelect }) => {
  const moodOptions = [
    { mood: 2, label: 'awful', emoticon: '😭', color: '#ef4444' },
    { mood: 4, label: 'bad', emoticon: '😔', color: '#f97316' },
    { mood: 6, label: 'meh', emoticon: '😑', color: '#6b7280' },
    { mood: 8, label: 'good', emoticon: '😀', color: '#10b981' },
    { mood: 10, label: 'great', emoticon: '😁', color: '#22c55e' },
  ];

  const handleMoodSelect = (option) => {
    onMoodSelect({
      mood: option.mood,
      label: option.label,
      emoticon: option.emoticon
    });
  };

  return (
    <View style={styles.container} testID="mood-selector-container">
      {moodOptions.map((option) => (
        <TouchableOpacity
          key={option.mood}
          testID={`mood-option-${option.label}`}
          style={[
            styles.moodOption,
            selectedMood === option.mood && {
              backgroundColor: option.color,
              transform: [{ scale: 1.1 }]
            }
          ]}
          onPress={() => handleMoodSelect(option)}
        >
          <Text style={styles.emoticon}>{option.emoticon}</Text>
          <Text style={[
            styles.label,
            selectedMood === option.mood && styles.selectedLabel
          ]}>
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  moodOption: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoticon: {
    fontSize: 28,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
  },
  selectedLabel: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default EmoticonMoodSelector;