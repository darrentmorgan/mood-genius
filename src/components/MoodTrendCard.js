import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoodTrendCard = ({ trend }) => {
  const getTrendIcon = (direction) => {
    const icons = {
      improving: '📈',
      declining: '📉',
      stable: '➡️',
      insufficient_data: '❓'
    };
    return icons[direction] || '❓';
  };

  const getTrendColor = (direction) => {
    const colors = {
      improving: '#10b981',
      declining: '#ef4444',
      stable: '#6b7280',
      insufficient_data: '#9ca3af'
    };
    return colors[direction] || '#9ca3af';
  };

  const formatDirection = (direction) => {
    return direction.charAt(0).toUpperCase() + direction.slice(1);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text 
          style={[styles.icon, { color: getTrendColor(trend.direction) }]}
          testID={`trend-icon-${trend.direction}`}
        >
          {getTrendIcon(trend.direction)}
        </Text>
        <Text style={styles.title}>
          Mood Trend: {formatDirection(trend.direction)}
        </Text>
      </View>
      
      <Text style={styles.description}>
        {trend.description}
      </Text>
      
      <View style={[styles.strengthIndicator, { backgroundColor: getTrendColor(trend.direction) }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  strengthIndicator: {
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
});

export default MoodTrendCard;