import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {HealthSettings} from '../types/health';
import {getHealthSettings, saveHealthSettings, toggleMockData} from '../utils/healthSettings';
import MockHealthService from '../services/MockHealthService';

const SettingsScreen = () => {
  const [settings, setSettings] = useState<HealthSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const healthSettings = await getHealthSettings();
      setSettings(healthSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const handleToggleMockData = async () => {
    try {
      const newValue = await toggleMockData();
      setSettings(prev => prev ? {...prev, useMockData: newValue} : null);
      
      if (newValue) {
        Alert.alert(
          'Mock Data Enabled',
          'Using simulated health data for testing. This generates realistic correlations with your mood data.',
          [
            {text: 'Refresh Data', onPress: handleRefreshMockData},
            {text: 'OK', style: 'default'},
          ]
        );
      } else {
        Alert.alert(
          'Real Data Mode',
          'Switched to real health data. You\'ll need to set up HealthKit integration for this to work.',
          [{text: 'OK'}]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle mock data setting');
    }
  };

  const handleRefreshMockData = async () => {
    try {
      await MockHealthService.refreshMockData();
      Alert.alert('Success', 'Mock health data has been refreshed with new correlations!');
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh mock data');
    }
  };

  const handleClearMockData = () => {
    Alert.alert(
      'Clear Mock Data',
      'This will remove all generated health data and insights. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await MockHealthService.clearMockData();
              Alert.alert('Success', 'Mock health data cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear mock data');
            }
          },
        },
      ]
    );
  };

  const handleSyncFrequencyChange = async (frequency: HealthSettings['syncFrequency']) => {
    try {
      await saveHealthSettings({syncFrequency: frequency});
      setSettings(prev => prev ? {...prev, syncFrequency: frequency} : null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update sync frequency');
    }
  };

  const handlePrivacyLevelChange = async (level: HealthSettings['privacyLevel']) => {
    try {
      await saveHealthSettings({privacyLevel: level});
      setSettings(prev => prev ? {...prev, privacyLevel: level} : null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy level');
    }
  };

  if (loading || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        
        {/* Health Data Source */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Data Source</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Use Mock Data</Text>
              <Text style={styles.settingDescription}>
                {settings.useMockData 
                  ? 'Using simulated health data for testing AI insights'
                  : 'Using real health data from HealthKit/Google Fit'
                }
              </Text>
            </View>
            <Switch
              value={settings.useMockData}
              onValueChange={handleToggleMockData}
              trackColor={{false: '#e5e7eb', true: '#6366f1'}}
              thumbColor={settings.useMockData ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Data Source</Text>
              <Text style={styles.settingDescription}>
                Current: {settings.dataSource.charAt(0).toUpperCase() + settings.dataSource.slice(1)}
              </Text>
            </View>
            <Text style={[
              styles.statusBadge,
              settings.useMockData ? styles.mockBadge : styles.realBadge
            ]}>
              {settings.useMockData ? 'MOCK' : 'REAL'}
            </Text>
          </View>
        </View>

        {/* Mock Data Controls */}
        {settings.useMockData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mock Data Controls</Text>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleRefreshMockData}>
              <Text style={styles.actionButtonText}>🔄 Refresh Mock Data</Text>
              <Text style={styles.actionButtonDescription}>
                Generate new health data with mood correlations
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.dangerButton]} 
              onPress={handleClearMockData}
            >
              <Text style={[styles.actionButtonText, styles.dangerText]}>🗑️ Clear Mock Data</Text>
              <Text style={styles.actionButtonDescription}>
                Remove all generated health data and insights
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Sync Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sync Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Sync Frequency</Text>
              <Text style={styles.settingDescription}>
                How often to update health data
              </Text>
            </View>
          </View>
          
          <View style={styles.optionGroup}>
            {['realtime', 'hourly', 'daily'].map((freq) => (
              <TouchableOpacity
                key={freq}
                style={[
                  styles.optionButton,
                  settings.syncFrequency === freq && styles.selectedOption
                ]}
                onPress={() => handleSyncFrequencyChange(freq as HealthSettings['syncFrequency'])}
              >
                <Text style={[
                  styles.optionText,
                  settings.syncFrequency === freq && styles.selectedOptionText
                ]}>
                  {freq.charAt(0).toUpperCase() + freq.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>Privacy Level</Text>
              <Text style={styles.settingDescription}>
                Control how much data is used for insights
              </Text>
            </View>
          </View>
          
          <View style={styles.optionGroup}>
            {[
              {key: 'minimal', label: 'Minimal', desc: 'Basic correlations only'},
              {key: 'standard', label: 'Standard', desc: 'Recommended for insights'},
              {key: 'full', label: 'Full', desc: 'Detailed analysis'}
            ].map((level) => (
              <TouchableOpacity
                key={level.key}
                style={[
                  styles.optionButton,
                  settings.privacyLevel === level.key && styles.selectedOption
                ]}
                onPress={() => handlePrivacyLevelChange(level.key as HealthSettings['privacyLevel'])}
              >
                <Text style={[
                  styles.optionText,
                  settings.privacyLevel === level.key && styles.selectedOptionText
                ]}>
                  {level.label}
                </Text>
                <Text style={styles.optionDescription}>{level.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>💡 About Mock Data</Text>
          <Text style={styles.infoText}>
            Mock data generates realistic health metrics (sleep, steps, heart rate) that correlate with your actual mood entries. 
            This lets you test AI insights and correlations before setting up real health data integration.
          </Text>
          <Text style={styles.infoText}>
            When you're ready to use real data, toggle off mock mode and set up HealthKit (iOS) or Google Fit (Android) permissions.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  mockBadge: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
  },
  realBadge: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  actionButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dangerButton: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  dangerText: {
    color: '#dc2626',
  },
  actionButtonDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionGroup: {
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedOption: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  selectedOptionText: {
    color: '#ffffff',
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
    marginBottom: 12,
  },
});

export default SettingsScreen;