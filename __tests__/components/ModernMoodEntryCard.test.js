import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ModernMoodEntryCard from '../../src/components/ModernMoodEntryCard';

describe('ModernMoodEntryCard', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    mockOnSave.mockClear();
  });

  it('should render modern card design with proper styling', () => {
    const { getByTestId, getByText } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    expect(getByTestId('mood-entry-card')).toBeTruthy();
    expect(getByText('How are you feeling?')).toBeTruthy();
    expect(getByTestId('mood-selector-container')).toBeTruthy();
    expect(getByTestId('notes-input')).toBeTruthy();
  });

  it('should show current date and time', () => {
    const { getByTestId } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    const dateDisplay = getByTestId('current-date');
    expect(dateDisplay).toBeTruthy();
    // Should contain today's date in some format
    expect(dateDisplay.children[0]).toMatch(/Today|2024/);
  });

  it('should handle mood selection and update state', () => {
    const { getByTestId } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    const moodSelector = getByTestId('mood-selector-container');
    const goodMoodOption = getByTestId('mood-option-good');
    
    fireEvent.press(goodMoodOption);

    // Should update selected mood in the parent component
    expect(moodSelector).toBeTruthy();
  });

  it('should handle notes input with placeholder text', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    const notesInput = getByPlaceholderText('What\'s on your mind? (optional)');
    expect(notesInput).toBeTruthy();

    fireEvent.changeText(notesInput, 'Had a great day today!');
    expect(notesInput.props.value).toBe('Had a great day today!');
  });

  it('should save mood entry with proper data structure', async () => {
    const { getByTestId, getByPlaceholderText } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    // Select mood
    fireEvent.press(getByTestId('mood-option-good'));
    
    // Add notes
    fireEvent.changeText(
      getByPlaceholderText('What\'s on your mind? (optional)'),
      'Feeling productive today!'
    );

    // Save entry
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        mood: 8,
        label: 'good',
        emoticon: '😀',
        notes: 'Feeling productive today!',
        timestamp: expect.any(String)
      });
    });
  });

  it('should show save button as disabled when no mood selected', () => {
    const { getByTestId } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    const saveButton = getByTestId('save-button');
    expect(saveButton.props.accessibilityState.disabled).toBe(true);
  });

  it('should enable save button when mood is selected', () => {
    const { getByTestId } = render(
      <ModernMoodEntryCard onSave={mockOnSave} />
    );

    // Select mood
    fireEvent.press(getByTestId('mood-option-good'));

    const saveButton = getByTestId('save-button');
    expect(saveButton.props.accessibilityState.disabled).toBe(false);
  });
});