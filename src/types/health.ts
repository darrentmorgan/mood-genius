export interface HealthData {
  id: string;
  date: string;
  timestamp: string;
  sleep: SleepData;
  steps: StepsData;
  heartRate: HeartRateData;
}

export interface SleepData {
  duration: number; // in hours
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  bedtime: string; // ISO string
  wakeTime: string; // ISO string
  deepSleep: number; // percentage
  remSleep: number; // percentage
}

export interface StepsData {
  count: number;
  distance: number; // in kilometers
  calories: number;
  activeMinutes: number;
}

export interface HeartRateData {
  resting: number; // bpm
  average: number; // bpm
  max: number; // bpm
  variability: number; // HRV score
}

export interface HealthCorrelation {
  metric: string;
  correlation: number; // -1 to 1
  strength: 'weak' | 'moderate' | 'strong';
  trend: 'positive' | 'negative' | 'neutral';
  description: string;
}

export interface AIInsight {
  id: string;
  type: 'correlation' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  recommendation?: string;
  correlations?: HealthCorrelation[];
}

export interface HealthSettings {
  useMockData: boolean;
  dataSource: 'mock' | 'healthkit' | 'googlefit';
  enableNotifications: boolean;
  syncFrequency: 'realtime' | 'hourly' | 'daily';
  privacyLevel: 'minimal' | 'standard' | 'full';
}