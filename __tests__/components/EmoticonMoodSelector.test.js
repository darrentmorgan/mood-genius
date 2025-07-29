import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import EmoticonMoodSelector from '../../src/components/EmoticonMoodSelector';

describe('EmoticonMoodSelector', () => {
  const mockOnMoodSelect = jest.fn();

  beforeEach(() => {
    mockOnMoodSelect.mockClear();
  });

  it('should render 5 mood emoticons with proper labels', () => {
    const { getByTestId, getByText } = render(
      <EmoticonMoodSelector onMoodSelect={mockOnMoodSelect} />
    );

    // Check that all 5 mood options are rendered
    expect(getByTestId('mood-option-awful')).toBeTruthy();
    expect(getByTestId('mood-option-bad')).toBeTruthy();
    expect(getByTestId('mood-option-meh')).toBeTruthy();
    expect(getByTestId('mood-option-good')).toBeTruthy();
    expect(getByTestId('mood-option-great')).toBeTruthy();

    // Check labels
    expect(getByText('awful')).toBeTruthy();
    expect(getByText('bad')).toBeTruthy();
    expect(getByText('meh')).toBeTruthy();
    expect(getByText('good')).toBeTruthy();
    expect(getByText('great')).toBeTruthy();
  });

  it('should call onMoodSelect with correct value when mood is selected', () => {
    const { getByTestId } = render(
      <EmoticonMoodSelector onMoodSelect={mockOnMoodSelect} />
    );

    fireEvent.press(getByTestId('mood-option-good'));

    expect(mockOnMoodSelect).toHaveBeenCalledWith({
      mood: 8,
      label: 'good',
      emoticon: '😀'
    });
  });

  it('should highlight selected mood option', () => {
    const { getByTestId } = render(
      <EmoticonMoodSelector selectedMood={8} onMoodSelect={mockOnMoodSelect} />
    );

    const selectedOption = getByTestId('mood-option-good');
    expect(selectedOption).toHaveStyle({ backgroundColor: '#10b981' });
  });

  it('should render with professional styling and proper spacing', () => {
    const { getByTestId } = render(
      <EmoticonMoodSelector onMoodSelect={mockOnMoodSelect} />
    );

    const container = getByTestId('mood-selector-container');
    expect(container).toHaveStyle({ 
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20 
    });
  });

  it('should map mood values correctly to emoticons', () => {
    const { getByTestId } = render(
      <EmoticonMoodSelector onMoodSelect={mockOnMoodSelect} />
    );

    // Test that awful mood (value 2) triggers correct callback
    fireEvent.press(getByTestId('mood-option-awful'));
    expect(mockOnMoodSelect).toHaveBeenCalledWith({
      mood: 2,
      label: 'awful',
      emoticon: '😭'
    });

    // Test that great mood (value 10) triggers correct callback
    fireEvent.press(getByTestId('mood-option-great'));
    expect(mockOnMoodSelect).toHaveBeenCalledWith({
      mood: 10,
      label: 'great',
      emoticon: '😁'
    });
  });
});