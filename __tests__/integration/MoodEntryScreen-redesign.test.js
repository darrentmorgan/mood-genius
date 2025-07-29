import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import MoodEntryScreen from '../../src/screens/MoodEntryScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

// Mock storage functions
jest.mock('../../src/utils/storageFirestore', () => ({
  saveMoodEntry: jest.fn().mockResolvedValue(true),
}));

// Mock Alert in jest-setup.js already handles this

describe('MoodEntryScreen Integration with Modern Design', () => {
  beforeEach(() => {
    mockNavigation.navigate.mockClear();
    mockNavigation.goBack.mockClear();
  });

  it('should render the modern mood entry interface', () => {
    const { getByTestId, getByText } = render(
      <MoodEntryScreen navigation={mockNavigation} />
    );

    // Should render the modern card design
    expect(getByTestId('mood-entry-card')).toBeTruthy();
    expect(getByText('How are you feeling?')).toBeTruthy();
    
    // Should have all 5 emoticon options
    expect(getByTestId('mood-option-awful')).toBeTruthy();
    expect(getByTestId('mood-option-bad')).toBeTruthy();
    expect(getByTestId('mood-option-meh')).toBeTruthy();
    expect(getByTestId('mood-option-good')).toBeTruthy();
    expect(getByTestId('mood-option-great')).toBeTruthy();
  });

  it('should handle complete mood entry flow with new design', async () => {
    const { saveMoodEntry } = require('../../src/utils/storageFirestore');
    
    const { getByTestId, getByPlaceholderText } = render(
      <MoodEntryScreen navigation={mockNavigation} />
    );

    // Select mood using new emoticon selector
    fireEvent.press(getByTestId('mood-option-great'));

    // Add notes
    fireEvent.changeText(
      getByPlaceholderText('What\'s on your mind? (optional)'),
      'Had an amazing day with the family!'
    );

    // Save entry
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(saveMoodEntry).toHaveBeenCalledWith(
        10,
        'Had an amazing day with the family!'
      );
    });
  });

  it('should show professional styling with proper spacing', () => {
    const { getByTestId } = render(
      <MoodEntryScreen navigation={mockNavigation} />
    );

    const card = getByTestId('mood-entry-card');
    expect(card).toHaveStyle({
      borderRadius: 24,
      backgroundColor: '#ffffff'
    });

    const moodContainer = getByTestId('mood-selector-container');
    expect(moodContainer).toHaveStyle({
      flexDirection: 'row',
      justifyContent: 'space-between'
    });
  });

  it('should validate mood selection before allowing save', () => {
    const { getByTestId } = render(
      <MoodEntryScreen navigation={mockNavigation} />
    );

    const saveButton = getByTestId('save-button');
    expect(saveButton.props.accessibilityState.disabled).toBe(true);

    // Select mood
    fireEvent.press(getByTestId('mood-option-good'));

    expect(saveButton.props.accessibilityState.disabled).toBe(false);
  });
});