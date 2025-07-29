import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Card, MoodButton, CustomButton } from './index';
import { theme } from '../../theme';

// Test component to verify our UI foundation works
const TestScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  
  const moodOptions = [
    { mood: 2, label: 'awful', emoticon: '😭' },
    { mood: 4, label: 'bad', emoticon: '😔' },
    { mood: 6, label: 'meh', emoticon: '😑' },
    { mood: 8, label: 'good', emoticon: '😀' },
    { mood: 10, label: 'great', emoticon: '😁' },
  ];
  
  return (
    <ScreenContainer testID="test-screen">
      <Text style={styles.title}>MoodGenius UI Test</Text>
      
      <Card variant="elevated" testID="test-card">
        <Text style={styles.cardTitle}>Theme Colors Test</Text>
        <View style={styles.colorRow}>
          <View style={[styles.colorBox, { backgroundColor: theme.colors.primary[400] }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.secondary[400] }]} />
          <View style={[styles.colorBox, { backgroundColor: theme.colors.mood.great }]} />
        </View>
      </Card>
      
      <Card testID="mood-test-card">
        <Text style={styles.cardTitle}>Mood Buttons Test</Text>
        <View style={styles.moodRow}>
          {moodOptions.map((option) => (
            <MoodButton
              key={option.mood}
              mood={option.mood}
              label={option.label}
              emoticon={option.emoticon}
              selected={selectedMood?.mood === option.mood}
              onPress={setSelectedMood}
              testID={`mood-button-${option.label}`}
            />
          ))}
        </View>
        {selectedMood && (
          <Text style={styles.selectedText}>
            Selected: {selectedMood.emoticon} {selectedMood.label}
          </Text>
        )}
      </Card>
      
      <Card testID="button-test-card">
        <Text style={styles.cardTitle}>Button Variants Test</Text>
        <View style={styles.buttonColumn}>
          <CustomButton 
            title="Primary Button" 
            variant="primary" 
            onPress={() => console.log('Primary pressed')}
            testID="primary-button"
          />
          <CustomButton 
            title="Secondary Button" 
            variant="secondary" 
            onPress={() => console.log('Secondary pressed')}
            testID="secondary-button"
          />
          <CustomButton 
            title="Outline Button" 
            variant="outline" 
            onPress={() => console.log('Outline pressed')}
            testID="outline-button"
          />
          <CustomButton 
            title="Gradient Button" 
            variant="primary" 
            gradient={true}
            onPress={() => console.log('Gradient pressed')}
            testID="gradient-button"
          />
        </View>
      </Card>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.typography.fontSize.xl3,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.base,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[4],
  },
  selectedText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing[2],
  },
  buttonColumn: {
    gap: theme.spacing[3],
  },
});

export default TestScreen;