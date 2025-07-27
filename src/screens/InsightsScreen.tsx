import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AIInsight, HealthCorrelation, HealthData} from '../types/health';
import MockHealthService from '../services/MockHealthService';
import {getHealthSettings} from '../utils/healthSettings';
import {getMoodEmoji, getMoodLabel} from '../utils/moodUtils';

const InsightsScreen = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);

  const loadData = async () => {
    try {
      const settings = await getHealthSettings();
      setUseMockData(settings.useMockData);

      if (settings.useMockData) {
        const [insightsData, healthDataResult] = await Promise.all([
          MockHealthService.getAIInsights(),
          MockHealthService.getHealthData(),
        ]);
        setInsights(insightsData);
        setHealthData(healthDataResult);
      } else {
        // TODO: Implement real HealthKit data loading
        setInsights([]);
        setHealthData([]);
      }
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (useMockData) {
      await MockHealthService.generateAIInsights();
    }
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const getCorrelationIcon = (correlation: HealthCorrelation) => {
    if (correlation.metric === 'Sleep Duration') return '😴';
    if (correlation.metric === 'Daily Steps') return '🚶‍♂️';
    if (correlation.metric === 'Resting Heart Rate') return '❤️';
    return '📊';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong': return '#10b981';
      case 'moderate': return '#f59e0b';
      case 'weak': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'positive': return '📈';
      case 'negative': return '📉';
      case 'neutral': return '➡️';
      default: return '➡️';
    }
  };

  const handleGenerateInsights = async () => {
    try {
      setLoading(true);
      await MockHealthService.refreshMockData();
      await loadData();
      Alert.alert('Success', 'New insights generated based on your latest data!');
    } catch (error) {
      Alert.alert('Error', 'Failed to generate insights. Please try again.');
    }
  };

  const renderInsight = (insight: AIInsight) => (
    <View key={insight.id} style={styles.insightCard}>
      <View style={styles.insightHeader}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>{insight.confidence}%</Text>
        </View>
      </View>
      
      <Text style={styles.insightDescription}>{insight.description}</Text>
      
      {insight.correlations && insight.correlations.length > 0 && (
        <View style={styles.correlationsSection}>
          <Text style={styles.correlationsTitle}>Correlations:</Text>
          {insight.correlations.map((corr, index) => (
            <View key={index} style={styles.correlationItem}>
              <View style={styles.correlationHeader}>
                <Text style={styles.correlationIcon}>{getCorrelationIcon(corr)}</Text>
                <Text style={styles.correlationMetric}>{corr.metric}</Text>
                <Text style={styles.correlationTrend}>{getTrendIcon(corr.trend)}</Text>
              </View>
              <View style={styles.correlationDetails}>
                <View style={[
                  styles.strengthBadge,
                  {backgroundColor: getStrengthColor(corr.strength) + '20'}
                ]}>
                  <Text style={[
                    styles.strengthText,
                    {color: getStrengthColor(corr.strength)}
                  ]}>
                    {corr.strength.toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.correlationPercent}>
                  {Math.abs(corr.correlation * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
      
      {insight.recommendation && (
        <View style={styles.recommendationSection}>
          <Text style={styles.recommendationTitle}>💡 Recommendation:</Text>
          <Text style={styles.recommendationText}>{insight.recommendation}</Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>🤖</Text>
      <Text style={styles.emptyTitle}>No Insights Yet</Text>
      <Text style={styles.emptyText}>
        {useMockData 
          ? 'Add some mood entries and generate mock health data to see AI insights!'
          : 'Connect your health data to start seeing personalized insights.'
        }
      </Text>
      {useMockData && (
        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateInsights}>
          <Text style={styles.generateButtonText}>Generate Insights</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderHealthSummary = () => {
    if (healthData.length === 0) return null;
    
    const recentData = healthData.slice(-7); // Last 7 days
    const avgSleep = recentData.reduce((sum, h) => sum + h.sleep.duration, 0) / recentData.length;
    const avgSteps = recentData.reduce((sum, h) => sum + h.steps.count, 0) / recentData.length;
    const avgHR = recentData.reduce((sum, h) => sum + h.heartRate.resting, 0) / recentData.length;

    return (
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>📊 7-Day Health Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>😴</Text>
            <Text style={styles.summaryValue}>{avgSleep.toFixed(1)}h</Text>
            <Text style={styles.summaryLabel}>Avg Sleep</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>🚶‍♂️</Text>
            <Text style={styles.summaryValue}>{Math.round(avgSteps).toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Avg Steps</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryIcon}>❤️</Text>
            <Text style={styles.summaryValue}>{Math.round(avgHR)}</Text>
            <Text style={styles.summaryLabel}>Resting HR</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Analyzing your data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.content}>
        
        {!useMockData && (
          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>⚠️ Real Data Mode</Text>
            <Text style={styles.warningText}>
              Real health data integration is not yet implemented. Enable mock data in Settings to test AI insights.
            </Text>
          </View>
        )}

        {useMockData && renderHealthSummary()}
        
        {insights.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🤖 AI Insights</Text>
              <Text style={styles.headerSubtitle}>
                Personalized insights based on your mood and health patterns
              </Text>
            </View>
            
            {insights.map(renderInsight)}
            
            {useMockData && (
              <TouchableOpacity style={styles.refreshButton} onPress={handleGenerateInsights}>
                <Text style={styles.refreshButtonText}>🔄 Refresh Insights</Text>
              </TouchableOpacity>
            )}
          </>
        )}
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
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  summaryCard: {
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
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af',
  },
  insightDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  correlationsSection: {
    marginBottom: 16,
  },
  correlationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
  },
  correlationItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  correlationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  correlationIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  correlationMetric: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
  },
  correlationTrend: {
    fontSize: 16,
  },
  correlationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  correlationPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  recommendationSection: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  generateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  generateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
});

export default InsightsScreen;