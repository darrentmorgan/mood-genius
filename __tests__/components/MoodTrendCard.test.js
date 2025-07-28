import React from 'react';
import { render } from '@testing-library/react-native';
import MoodTrendCard from '../../src/components/MoodTrendCard';

describe('MoodTrendCard', () => {
  it('should display improving trend with positive message', () => {
    const mockTrend = {
      direction: 'improving',
      strength: 'strong',
      description: 'Your mood has been consistently improving over the past few days.'
    };

    const { getByText, getByTestId } = render(
      <MoodTrendCard trend={mockTrend} />
    );

    expect(getByText('Mood Trend: Improving')).toBeTruthy();
    expect(getByText('Your mood has been consistently improving over the past few days.')).toBeTruthy();
    expect(getByTestId('trend-icon-improving')).toBeTruthy();
  });

  it('should display declining trend with supportive message', () => {
    const mockTrend = {
      direction: 'declining',
      strength: 'moderate',
      description: 'Your mood has been declining. Consider reaching out for support.'
    };

    const { getByText, getByTestId } = render(
      <MoodTrendCard trend={mockTrend} />
    );

    expect(getByText('Mood Trend: Declining')).toBeTruthy();
    expect(getByText('Your mood has been declining. Consider reaching out for support.')).toBeTruthy();
    expect(getByTestId('trend-icon-declining')).toBeTruthy();
  });

  it('should display stable trend appropriately', () => {
    const mockTrend = {
      direction: 'stable',
      strength: 'stable',
      description: 'Your mood has been relatively stable recently.'
    };

    const { getByText, getByTestId } = render(
      <MoodTrendCard trend={mockTrend} />
    );

    expect(getByText('Mood Trend: Stable')).toBeTruthy();
    expect(getByText('Your mood has been relatively stable recently.')).toBeTruthy();
    expect(getByTestId('trend-icon-stable')).toBeTruthy();
  });
});