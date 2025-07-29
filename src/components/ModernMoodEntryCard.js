import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import EmoticonMoodSelector from './EmoticonMoodSelector';

const ModernMoodEntryCard = ({ onSave }) => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');

  const getCurrentDate = () => {
    const now = new Date();
    return `Today, ${now.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    })} at ${now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })}`;
  };

  const handleMoodSelect = (moodData) => {
    setSelectedMood(moodData);
  };

  const handleSave = () => {
    if (selectedMood) {
      onSave({
        ...selectedMood,
        notes: notes.trim(),
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <View style={styles.card} testID="mood-entry-card">
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.dateTime} testID="current-date">
          {getCurrentDate()}
        </Text>
      </View>

      <View style={styles.moodSection}>
        <EmoticonMoodSelector
          testID="mood-selector"
          selectedMood={selectedMood?.mood}
          onMoodSelect={handleMoodSelect}
        />
      </View>

      <View style={styles.notesSection}>
        <TextInput
          testID="notes-input"
          style={styles.notesInput}
          placeholder="What's on your mind? (optional)"
          placeholderTextColor="#9ca3af"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        testID="save-button"
        style={[
          styles.saveButton,
          !selectedMood && styles.saveButtonDisabled
        ]}
        onPress={handleSave}
        disabled={!selectedMood}
        accessibilityState={{ disabled: !selectedMood }}
      >
        <Text style={[
          styles.saveButtonText,
          !selectedMood && styles.saveButtonTextDisabled
        ]}>
          Save Entry
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateTime: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  moodSection: {
    marginBottom: 24,
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minHeight: 80,
    fontWeight: '400',
  },
  saveButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#e5e7eb',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
});

export default ModernMoodEntryCard;