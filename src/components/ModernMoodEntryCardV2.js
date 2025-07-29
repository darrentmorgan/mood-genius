import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Card, CustomButton } from './ui';
import ModernEmoticonMoodSelector from './ModernEmoticonMoodSelector';
import { theme } from '../theme';

const ModernMoodEntryCardV2 = ({ onSave }) => {
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
    <Card variant="elevated" style={styles.card} testID="mood-entry-card-v2">
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling?</Text>
        <Text style={styles.dateTime} testID="current-date">
          {getCurrentDate()}
        </Text>
      </View>

      <View style={styles.moodSection}>
        <ModernEmoticonMoodSelector
          selectedMood={selectedMood?.mood}
          onMoodSelect={handleMoodSelect}
        />
      </View>

      <View style={styles.notesSection}>
        <TextInput
          testID="notes-input"
          style={styles.notesInput}
          placeholder="What's on your mind? (optional)"
          placeholderTextColor={theme.colors.text.tertiary}
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </View>

      <CustomButton
        title="Save Entry"
        variant="primary"
        gradient={true}
        disabled={!selectedMood}
        onPress={handleSave}
        testID="save-button"
        style={styles.saveButton}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: theme.spacing[4],
    marginVertical: theme.spacing[2],
  },
  header: {
    marginBottom: theme.spacing[6],
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xl2,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  dateTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  moodSection: {
    marginBottom: theme.spacing[6],
  },
  notesSection: {
    marginBottom: theme.spacing[6],
  },
  notesInput: {
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
    minHeight: 80,
    fontWeight: theme.typography.fontWeight.normal,
    lineHeight: theme.typography.lineHeight.relaxed,
  },
  saveButton: {
    marginTop: theme.spacing[2],
  },
});

export default ModernMoodEntryCardV2;