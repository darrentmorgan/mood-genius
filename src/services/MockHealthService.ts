import AsyncStorage from '@react-native-async-storage/async-storage';
import {HealthData, SleepData, StepsData, HeartRateData, AIInsight, HealthCorrelation} from '../types/health';
import {getMoodEntries, MoodEntry} from '../utils/storage';

class MockHealthService {
  private readonly HEALTH_STORAGE_KEY = 'mock_health_data';
  private readonly INSIGHTS_STORAGE_KEY = 'ai_insights';

  // Generate realistic correlated health data based on mood
  private generateHealthDataForMood(mood: number, date: Date): HealthData {
    // Base correlations: better mood = better health metrics (with realistic variance)
    const moodFactor = mood / 5; // 0.2 to 1.0 (adjusted for 1-5 scale)
    const randomVariance = () => 0.8 + Math.random() * 0.4; // 0.8 to 1.2

    // Sleep data (6-9 hours, correlated with mood)
    const sleepDuration = Math.max(6, Math.min(9, 
      6 + (moodFactor * 3) * randomVariance()
    ));
    
    const sleepQuality = this.getSleepQuality(sleepDuration, moodFactor);
    const bedtime = new Date(date);
    bedtime.setHours(22 + Math.random() * 2); // 10PM-12AM
    
    const wakeTime = new Date(bedtime);
    wakeTime.setHours(bedtime.getHours() + sleepDuration);

    const sleep: SleepData = {
      duration: Math.round(sleepDuration * 10) / 10,
      quality: sleepQuality,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      deepSleep: Math.round((15 + moodFactor * 10) * randomVariance()),
      remSleep: Math.round((20 + moodFactor * 5) * randomVariance()),
    };

    // Steps data (3000-12000, higher mood = more active)
    const baseSteps = 5000;
    const stepCount = Math.round(
      Math.max(3000, Math.min(12000, 
        baseSteps + (moodFactor * 4000) * randomVariance()
      ))
    );

    const steps: StepsData = {
      count: stepCount,
      distance: Math.round((stepCount * 0.0008) * 100) / 100, // ~0.8m per step
      calories: Math.round(stepCount * 0.04), // ~0.04 cal per step
      activeMinutes: Math.round(stepCount / 100), // rough estimate
    };

    // Heart rate data (60-100 bpm, better mood = lower resting HR)
    const restingHR = Math.round(
      Math.max(60, Math.min(100, 
        85 - (moodFactor * 15) * randomVariance()
      ))
    );

    const heartRate: HeartRateData = {
      resting: restingHR,
      average: restingHR + Math.round(10 + Math.random() * 10),
      max: restingHR + Math.round(40 + Math.random() * 20),
      variability: Math.round((20 + moodFactor * 30) * randomVariance()),
    };

    return {
      id: `health_${date.getTime()}`,
      date: date.toDateString(),
      timestamp: date.toISOString(),
      sleep,
      steps,
      heartRate,
    };
  }

  private getSleepQuality(duration: number, moodFactor: number): SleepData['quality'] {
    const qualityScore = (duration - 6) / 3 + moodFactor; // 0-2 scale
    
    if (qualityScore > 1.5) return 'excellent';
    if (qualityScore > 1.0) return 'good';
    if (qualityScore > 0.5) return 'fair';
    return 'poor';
  }

  // Generate health data for the last 30 days
  async generateMockHealthData(): Promise<HealthData[]> {
    console.log('🏥 Generating mock health data...');
    
    try {
      // Get existing mood entries to correlate with
      const moodEntries = await getMoodEntries();
      const healthData: HealthData[] = [];
      
      // Generate data for last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(12, 0, 0, 0); // Noon for consistency
        
        // Find mood entry for this date or use default
        const dayMoodEntry = moodEntries.find(entry => 
          entry.date === date.toDateString()
        );
        
        const mood = dayMoodEntry?.mood || (3 + Math.random() * 1); // Default 3-4 if no mood (neutral to happy)
        const healthEntry = this.generateHealthDataForMood(mood, date);
        healthData.push(healthEntry);
      }
      
      await AsyncStorage.setItem(this.HEALTH_STORAGE_KEY, JSON.stringify(healthData));
      console.log(`✅ Generated ${healthData.length} health data entries`);
      
      return healthData;
    } catch (error) {
      console.error('❌ Error generating mock health data:', error);
      return [];
    }
  }

  // Get stored health data
  async getHealthData(): Promise<HealthData[]> {
    try {
      const data = await AsyncStorage.getItem(this.HEALTH_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // Generate initial data if none exists
      return await this.generateMockHealthData();
    } catch (error) {
      console.error('❌ Error getting health data:', error);
      return [];
    }
  }

  // Get health data for specific date range
  async getHealthDataForDateRange(startDate: Date, endDate: Date): Promise<HealthData[]> {
    const allData = await this.getHealthData();
    
    return allData.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  // Get today's health data
  async getTodaysHealthData(): Promise<HealthData | null> {
    const today = new Date().toDateString();
    const allData = await this.getHealthData();
    
    return allData.find(entry => entry.date === today) || null;
  }

  // Calculate correlations between mood and health metrics
  async calculateMoodHealthCorrelations(): Promise<HealthCorrelation[]> {
    try {
      const moodEntries = await getMoodEntries();
      const healthData = await this.getHealthData();
      
      if (moodEntries.length < 5 || healthData.length < 5) {
        return []; // Need enough data for meaningful correlations
      }

      // Match mood entries with health data by date
      const pairedData = moodEntries
        .map(mood => {
          const health = healthData.find(h => h.date === mood.date);
          return health ? { mood: mood.mood, health } : null;
        })
        .filter(Boolean) as Array<{ mood: number; health: HealthData }>;

      if (pairedData.length < 5) return [];

      const correlations: HealthCorrelation[] = [];

      // Calculate sleep correlation
      const sleepCorr = this.calculateCorrelation(
        pairedData.map(d => d.mood),
        pairedData.map(d => d.health.sleep.duration)
      );
      
      correlations.push({
        metric: 'Sleep Duration',
        correlation: sleepCorr,
        strength: this.getCorrelationStrength(sleepCorr),
        trend: sleepCorr > 0.1 ? 'positive' : sleepCorr < -0.1 ? 'negative' : 'neutral',
        description: `${Math.abs(sleepCorr * 100).toFixed(0)}% correlation between mood and sleep duration`,
      });

      // Calculate steps correlation
      const stepsCorr = this.calculateCorrelation(
        pairedData.map(d => d.mood),
        pairedData.map(d => d.health.steps.count)
      );
      
      correlations.push({
        metric: 'Daily Steps',
        correlation: stepsCorr,
        strength: this.getCorrelationStrength(stepsCorr),
        trend: stepsCorr > 0.1 ? 'positive' : stepsCorr < -0.1 ? 'negative' : 'neutral',
        description: `${Math.abs(stepsCorr * 100).toFixed(0)}% correlation between mood and physical activity`,
      });

      // Calculate heart rate correlation (inverse - lower resting HR is better)
      const hrCorr = this.calculateCorrelation(
        pairedData.map(d => d.mood),
        pairedData.map(d => -d.health.heartRate.resting) // Negative for inverse correlation
      );
      
      correlations.push({
        metric: 'Resting Heart Rate',
        correlation: hrCorr,
        strength: this.getCorrelationStrength(hrCorr),
        trend: hrCorr > 0.1 ? 'positive' : hrCorr < -0.1 ? 'negative' : 'neutral',
        description: `${Math.abs(hrCorr * 100).toFixed(0)}% correlation between mood and cardiovascular health`,
      });

      return correlations;
    } catch (error) {
      console.error('❌ Error calculating correlations:', error);
      return [];
    }
  }

  private calculateCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length || n < 2) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private getCorrelationStrength(correlation: number): HealthCorrelation['strength'] {
    const abs = Math.abs(correlation);
    if (abs >= 0.5) return 'strong';
    if (abs >= 0.3) return 'moderate';
    return 'weak';
  }

  // Generate AI insights based on correlations and trends
  async generateAIInsights(): Promise<AIInsight[]> {
    try {
      const correlations = await this.calculateMoodHealthCorrelations();
      const insights: AIInsight[] = [];

      correlations.forEach((corr, index) => {
        if (corr.strength !== 'weak') {
          const insight: AIInsight = {
            id: `insight_${index}`,
            type: 'correlation',
            title: `${corr.metric} Impact`,
            description: corr.description,
            confidence: Math.round(Math.abs(corr.correlation) * 100),
            actionable: true,
            recommendation: this.getRecommendation(corr),
            correlations: [corr],
          };
          insights.push(insight);
        }
      });

      // Add trend-based insights
      const recentHealth = await this.getHealthDataForDateRange(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        new Date()
      );

      if (recentHealth.length >= 5) {
        const avgSleep = recentHealth.reduce((sum, h) => sum + h.sleep.duration, 0) / recentHealth.length;
        
        if (avgSleep < 7) {
          insights.push({
            id: 'sleep_trend',
            type: 'recommendation',
            title: 'Sleep Optimization',
            description: `Your average sleep is ${avgSleep.toFixed(1)} hours. Consider improving sleep habits.`,
            confidence: 85,
            actionable: true,
            recommendation: 'Try going to bed 30 minutes earlier and maintaining a consistent sleep schedule.',
          });
        }
      }

      await AsyncStorage.setItem(this.INSIGHTS_STORAGE_KEY, JSON.stringify(insights));
      return insights;
    } catch (error) {
      console.error('❌ Error generating AI insights:', error);
      return [];
    }
  }

  private getRecommendation(correlation: HealthCorrelation): string {
    if (correlation.metric === 'Sleep Duration' && correlation.trend === 'positive') {
      return 'Prioritize 7-9 hours of quality sleep nightly. Consider a consistent bedtime routine.';
    }
    if (correlation.metric === 'Daily Steps' && correlation.trend === 'positive') {
      return 'Increase daily physical activity. Aim for 8,000-10,000 steps or 30 minutes of exercise.';
    }
    if (correlation.metric === 'Resting Heart Rate' && correlation.trend === 'positive') {
      return 'Focus on cardiovascular health through regular exercise and stress management.';
    }
    return 'Continue monitoring this metric for patterns.';
  }

  // Get stored insights
  async getAIInsights(): Promise<AIInsight[]> {
    try {
      const data = await AsyncStorage.getItem(this.INSIGHTS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      return await this.generateAIInsights();
    } catch (error) {
      console.error('❌ Error getting AI insights:', error);
      return [];
    }
  }

  // Refresh all data (useful for testing)
  async refreshMockData(): Promise<void> {
    console.log('🔄 Refreshing mock health data...');
    await this.generateMockHealthData();
    await this.generateAIInsights();
    console.log('✅ Mock data refreshed');
  }

  // Clear all mock data
  async clearMockData(): Promise<void> {
    await AsyncStorage.removeItem(this.HEALTH_STORAGE_KEY);
    await AsyncStorage.removeItem(this.INSIGHTS_STORAGE_KEY);
    console.log('🗑️ Mock health data cleared');
  }
}

export default new MockHealthService();