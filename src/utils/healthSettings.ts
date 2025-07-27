import AsyncStorage from '@react-native-async-storage/async-storage';
import {HealthSettings} from '../types/health';

const HEALTH_SETTINGS_KEY = 'health_settings';

const defaultSettings: HealthSettings = {
  useMockData: true, // Default to mock data for testing
  dataSource: 'mock',
  enableNotifications: true,
  syncFrequency: 'daily',
  privacyLevel: 'standard',
};

export const getHealthSettings = async (): Promise<HealthSettings> => {
  try {
    const settings = await AsyncStorage.getItem(HEALTH_SETTINGS_KEY);
    return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
  } catch (error) {
    console.error('Error getting health settings:', error);
    return defaultSettings;
  }
};

export const saveHealthSettings = async (settings: Partial<HealthSettings>): Promise<void> => {
  try {
    const currentSettings = await getHealthSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    await AsyncStorage.setItem(HEALTH_SETTINGS_KEY, JSON.stringify(updatedSettings));
    console.log('✅ Health settings saved:', updatedSettings);
  } catch (error) {
    console.error('❌ Error saving health settings:', error);
    throw error;
  }
};

export const toggleMockData = async (): Promise<boolean> => {
  try {
    const currentSettings = await getHealthSettings();
    const newUseMockData = !currentSettings.useMockData;
    
    await saveHealthSettings({
      useMockData: newUseMockData,
      dataSource: newUseMockData ? 'mock' : 'healthkit',
    });
    
    return newUseMockData;
  } catch (error) {
    console.error('❌ Error toggling mock data:', error);
    throw error;
  }
};