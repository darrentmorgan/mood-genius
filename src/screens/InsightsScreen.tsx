import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {AIInsight, HealthCorrelation, HealthData} from '../types/health';
import MockHealthService from '../services/MockHealthService';
import {getHealthSettings} from '../utils/healthSettings';
import {getMoodEmoji, getMoodLabel} from '../utils/moodUtils';

const { width: screenWidth } = Dimensions.get('window');

const InsightsScreen = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [healthData, setHealthData] = useState<HealthData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [useMockData, setUseMockData] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<FlatList>(null);

  const loadData = async () => {
    try {
      console.log('🔄 InsightsScreen: Loading data...');
      const settings = await getHealthSettings();
      setUseMockData(settings.useMockData);

      if (settings.useMockData) {
        const [insightsData, healthDataResult] = await Promise.all([
          MockHealthService.getAIInsights(),
          MockHealthService.getHealthData(),
        ]);
        console.log(`📊 Loaded ${insightsData.length} insights and ${healthDataResult.length} health entries`);
        setInsights(insightsData);
        setHealthData(healthDataResult);
      } else {
        // TODO: Implement real HealthKit data loading
        setInsights([]);
        setHealthData([]);
      }
    } catch (error) {
      console.error('❌ Error loading insights:', error);
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
    console.log('🤖 Starting insight generation...');
    try {
      setLoading(true);
      
      // First ensure we have health data - generate if missing
      console.log('📊 Checking for health data...');
      let healthDataResult = await MockHealthService.getHealthData();
      console.log(`Found ${healthDataResult.length} health entries`);
      
      if (healthDataResult.length === 0) {
        console.log('🏥 No health data found, generating fresh data...');
        healthDataResult = await MockHealthService.generateMockHealthData();
        console.log(`Generated ${healthDataResult.length} health entries`);
      }
      setHealthData(healthDataResult);
      
      // Generate fresh AI insights based on current mood and health data
      console.log('🧠 Generating AI insights...');
      const freshInsights = await MockHealthService.generateAIInsights();
      console.log(`Generated ${freshInsights.length} insights`);
      setInsights(freshInsights);
      
      if (freshInsights.length > 0) {
        Alert.alert(
          'Insights Generated! 🤖', 
          `Found ${freshInsights.length} personalized insights based on your mood and health patterns.`,
          [{ text: 'Great!', onPress: () => {} }]
        );
      } else {
        Alert.alert(
          'Need More Data 📊', 
          'Add a few more mood entries to generate meaningful insights. We need at least 5 days of data.',
          [{ text: 'Got it', onPress: () => {} }]
        );
      }
    } catch (error) {
      console.error('❌ Error generating insights:', error);
      Alert.alert('Error', 'Failed to generate insights. Please try again.');
    } finally {
      console.log('✅ Insight generation complete');
      setLoading(false);
    }
  };

  const getInsightTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return '🔬';
      case 'correlation': return '📊';
      case 'recommendation': return '💡';
      default: return '🤖';
    }
  };

  const getInsightTypeColor = (type: string) => {
    switch (type) {
      case 'research': return '#3b82f6';
      case 'correlation': return '#8b5cf6';
      case 'recommendation': return '#10b981';
      default: return '#6366f1';
    }
  };

  const onScroll = (event: any) => {
    const slideSize = screenWidth - 40; // Account for total padding and margins
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentIndex(index);
  };

  const goToSlide = (index: number) => {
    carouselRef.current?.scrollToIndex({ index, animated: true });
  };

  const renderInsight = ({ item: insight, index }: { item: AIInsight; index: number }) => (
    <View style={[styles.insightCard, { width: screenWidth - 60 }]}>
        <View style={styles.insightHeader}>
          <View style={styles.insightTitleContainer}>
            <Text style={styles.insightTypeIcon}>{getInsightTypeIcon(insight.type)}</Text>
            <Text style={styles.insightTitle}>{insight.title}</Text>
          </View>
          <View style={[
            styles.confidenceBadge,
            {backgroundColor: getInsightTypeColor(insight.type) + '20'}
          ]}>
            <Text style={[
              styles.confidenceText,
              {color: getInsightTypeColor(insight.type)}
            ]}>
              {insight.confidence}%
            </Text>
          </View>
        </View>
        
        <Text style={styles.insightDescription}>{insight.description}</Text>
        
        {insight.correlations && insight.correlations.length > 0 && (
          <View style={styles.correlationsSection}>
            <Text style={styles.correlationsTitle}>Personal Data:</Text>
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
          <View style={[
            styles.recommendationSection,
            {backgroundColor: getInsightTypeColor(insight.type) + '10'}
          ]}>
            <Text style={[
              styles.recommendationTitle,
              {color: getInsightTypeColor(insight.type)}
            ]}>
              {insight.type === 'research' ? '🔬 Research Says:' : 
               insight.type === 'correlation' ? '📊 Your Pattern:' : '💡 Recommendation:'}
            </Text>
            <Text style={[
              styles.recommendationText,
              {color: getInsightTypeColor(insight.type)}
            ]}>
              {insight.recommendation}
            </Text>
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
          ? 'Log a few moods first, then generate personalized insights based on research-backed health correlations!'
          : 'Connect your health data to start seeing personalized insights.'
        }
      </Text>
      {useMockData && (
        <>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateInsights}>
            <Text style={styles.generateButtonText}>Generate Insights</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.generateButton, {backgroundColor: '#f59e0b', marginTop: 10}]} 
            onPress={() => {
              console.log('🧪 Creating test insights for carousel...');
              const testInsights = [
                {
                  id: 'test1',
                  type: 'research',
                  title: 'Test Sleep Insight',
                  description: 'This is a test insight to verify the carousel is working.',
                  confidence: 85,
                  actionable: true,
                  recommendation: 'This is a test recommendation.',
                },
                {
                  id: 'test2',
                  type: 'correlation',
                  title: 'Test Activity Insight',
                  description: 'This is another test insight for the carousel.',
                  confidence: 92,
                  actionable: true,
                  recommendation: 'Another test recommendation.',
                }
              ];
              setInsights(testInsights);
            }}
          >
            <Text style={styles.generateButtonText}>🧪 Test Carousel</Text>
          </TouchableOpacity>
        </>
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

  const renderPaginationDots = () => (
    <View style={styles.paginationContainer}>
      {insights.map((_, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.paginationDot,
            currentIndex === index && styles.paginationDotActive
          ]}
          onPress={() => goToSlide(index)}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View 
        style={[
          styles.headerSection, 
          { maxHeight: insights.length > 0 ? 250 : '100%' }
        ]}
      >
        {insights.length === 0 ? (
          // Only show scrollable header when no carousel
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {!useMockData && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>⚠️ Real Data Mode</Text>
                <Text style={styles.warningText}>
                  Real health data integration is not yet implemented. Enable mock data in Settings to test AI insights.
                </Text>
              </View>
            )}

            {useMockData && renderHealthSummary()}
          </ScrollView>
        ) : (
          // Static header when carousel is active
          <>
            {!useMockData && (
              <View style={styles.warningCard}>
                <Text style={styles.warningTitle}>⚠️ Real Data Mode</Text>
                <Text style={styles.warningText}>
                  Real health data integration is not yet implemented. Enable mock data in Settings to test AI insights.
                </Text>
              </View>
            )}

            {useMockData && renderHealthSummary()}
            
            <View style={styles.header}>
              <Text style={styles.headerTitle}>🤖 AI Insights</Text>
              <Text style={styles.headerSubtitle}>
                Personalized insights based on your mood and health patterns
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Carousel or Empty State */}
      {insights.length === 0 ? (
        <ScrollView
          style={styles.emptyScrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={styles.content}>
            {renderEmptyState()}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.carouselContainer}>
          <FlatList
            ref={carouselRef}
            data={insights}
            renderItem={renderInsight}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={onScroll}
            snapToInterval={screenWidth - 40}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
            getItemLayout={(data, index) => ({
              length: screenWidth - 40,
              offset: (screenWidth - 40) * index,
              index,
            })}
            keyExtractor={(item) => item.id}
            scrollEventThrottle={16}
            directionalLockEnabled={true}
            alwaysBounceVertical={false}
            alwaysBounceHorizontal={false}
            bounces={false}
            removeClippedSubviews={false}
            disableIntervalMomentum={true}
            disableScrollViewPanResponder={false}
            nestedScrollEnabled={false}
          />
          
          {insights.length > 1 && renderPaginationDots()}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  emptyScrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  carouselContainer: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  carouselContent: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 40,
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
    paddingBottom: 10,
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
    marginBottom: 10,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 10,
    marginBottom: 10,
    flex: 1,
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
    marginBottom: 8,
  },
  insightTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  insightTypeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  insightTitle: {
    fontSize: 16,
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
    fontSize: 14,
    color: '#374151',
    lineHeight: 18,
    marginBottom: 8,
  },
  correlationsSection: {
    marginBottom: 6,
  },
  correlationsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  correlationItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  correlationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  correlationIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  correlationMetric: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
    flex: 1,
    minWidth: 0,
  },
  correlationTrend: {
    fontSize: 14,
    marginLeft: 4,
  },
  correlationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
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
    padding: 10,
  },
  recommendationTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 6,
  },
  recommendationText: {
    fontSize: 12,
    color: '#1e40af',
    lineHeight: 16,
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
  refreshContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  refreshButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 60,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d1d5db',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#6366f1',
    width: 12,
    height: 8,
    borderRadius: 4,
  },
});

export default InsightsScreen;