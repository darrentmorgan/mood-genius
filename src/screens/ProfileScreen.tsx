import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthService from '../services/AuthService';
import { HealthSettings } from '../types/health';
import { getHealthSettings, saveHealthSettings, toggleMockData } from '../utils/healthSettings';
import { generateSampleMoodEntries, clearMoodEntries, debugMoodEntries } from '../utils/storageFirestore';
import MockHealthService from '../services/MockHealthService';

const ProfileScreen = () => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [settings, setSettings] = useState<HealthSettings | null>(null);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const profile = await AuthService.getUserDocument(user.uid);
      setUserProfile(profile);
      if (profile?.displayName) {
        setDisplayName(profile.displayName);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const healthSettings = await getHealthSettings();
      setSettings(healthSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name cannot be empty.');
      return;
    }

    setLoading(true);
    try {
      const result = await AuthService.updateProfile({
        displayName: displayName.trim(),
      });

      if (result.error) {
        Alert.alert('Error', result.error);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
        setEditing(false);
        await loadUserProfile();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleGenerateSampleMoods = async () => {
    try {
      console.log('🎭 Settings: Generating sample mood data...');
      await generateSampleMoodEntries(true); // Force generation even if entries exist
      
      // Debug the results
      await debugMoodEntries();
      
      Alert.alert('Success', 'Generated 7 days of sample mood entries! Check your mood history and try generating insights.');
    } catch (error) {
      console.error('❌ Settings: Failed to generate sample mood data:', error);
      Alert.alert('Error', 'Failed to generate sample mood data. Check console for details.');
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Test Data',
      'This will remove all mood entries, health data, and insights. Are you sure?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all([
                MockHealthService.clearMockData(),
                clearMoodEntries()
              ]);
              Alert.alert('Success', 'All test data cleared');  
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          },
        },
      ]
    );
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

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            const result = await signOut();
            if (result.error) {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    
    let date;
    if (timestamp.toDate) {
      // Firestore timestamp
      date = timestamp.toDate();
    } else {
      // Regular date
      date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(displayName || user?.email || 'U')[0].toUpperCase()}
            </Text>
          </View>
          
          {editing ? (
            <View style={styles.editingContainer}>
              <TextInput
                style={styles.nameInput}
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your display name"
                autoCapitalize="words"
                editable={!loading}
              />
              <View style={styles.editingButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setDisplayName(user?.displayName || '');
                    setEditing(false);
                  }}
                  disabled={loading}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={handleUpdateProfile}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.profileInfo}>
              <Text style={styles.displayName}>
                {displayName || 'No name set'}
              </Text>
              <Text style={styles.email}>{user?.email}</Text>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setEditing(true)}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user?.uid}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Created</Text>
            <Text style={styles.infoValue}>
              {formatDate(userProfile?.createdAt)}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email Verified</Text>
            <Text style={[
              styles.infoValue,
              user?.emailVerified ? styles.verified : styles.unverified
            ]}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </Text>
          </View>
        </View>

        {/* Health Data Settings */}
        {!settingsLoading && settings && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Health Data Settings</Text>
              
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
                <Text style={styles.sectionTitle}>Testing Data Controls</Text>
                
                <TouchableOpacity style={styles.actionButton} onPress={handleGenerateSampleMoods}>
                  <Text style={styles.actionButtonText}>🎭 Generate 7 Days of Sample Moods</Text>
                  <Text style={styles.actionButtonDescription}>
                    Creates mood entries from today back to 6 days ago for testing
                  </Text>
                </TouchableOpacity>
                
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
                  <Text style={[styles.actionButtonText, styles.dangerText]}>🗑️ Clear Health Data</Text>
                  <Text style={styles.actionButtonDescription}>
                    Remove generated health data and insights only
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.dangerButton]} 
                  onPress={handleClearAllData}
                >
                  <Text style={[styles.actionButtonText, styles.dangerText]}>💥 Clear All Test Data</Text>
                  <Text style={styles.actionButtonDescription}>
                    Remove all mood entries, health data, and insights
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Privacy Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy & Sync</Text>
              
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
          </>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          
          <Text style={styles.infoText}>
            Your mood data is securely stored in the cloud and synced across your devices. 
            All data is encrypted and only accessible to you.
          </Text>
          
          <Text style={styles.infoText}>
            When offline, your data is stored locally and automatically synced when you come back online.
          </Text>

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

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.signOutButton]}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileInfo: {
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  editButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  editButtonText: {
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
  },
  editingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    marginBottom: 16,
  },
  editingButtons: {
    flexDirection: 'row',
    gap: 12,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '400',
    maxWidth: '60%',
    textAlign: 'right',
  },
  verified: {
    color: '#10b981',
  },
  unverified: {
    color: '#f59e0b',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  actions: {
    marginTop: 20,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
  },
  signOutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Settings styles
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
    marginBottom: 16,
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
});

export default ProfileScreen;