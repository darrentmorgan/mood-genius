import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

const MoodButton = ({ 
  mood, 
  label, 
  emoticon, 
  selected = false, 
  onPress, 
  size = 'medium',
  disabled = false,
  style = {},
  testID,
  ...props 
}) => {
  const scaleAnim = new Animated.Value(1);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          width: 50,
          height: 65,
          emoticonSize: 24,
          labelSize: theme.typography.fontSize.xs,
        };
      case 'large':
        return {
          width: 75,
          height: 95,
          emoticonSize: 32,
          labelSize: theme.typography.fontSize.sm,
        };
      default: // medium
        return {
          width: 60,
          height: 80,
          emoticonSize: 28,
          labelSize: theme.typography.fontSize.sm,
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const moodColor = theme.colors.mood[label] || theme.colors.primary[400];
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePress = () => {
    if (disabled) return;
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    onPress && onPress({ mood, label, emoticon });
  };
  
  const buttonStyle = [
    styles.button,
    {
      width: sizeStyles.width,
      height: sizeStyles.height,
    },
    selected && {
      backgroundColor: moodColor,
      transform: [{ scale: 1.05 }],
      ...theme.shadows.md,
    },
    disabled && styles.disabled,
    style,
  ];
  
  const labelStyle = [
    styles.label,
    {
      fontSize: sizeStyles.labelSize,
    },
    selected && styles.selectedLabel,
    disabled && styles.disabledText,
  ];
  
  const emoticonStyle = [
    styles.emoticon,
    {
      fontSize: sizeStyles.emoticonSize,
    },
  ];
  
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={buttonStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
        {...props}
      >
        <Text style={emoticonStyle}>{emoticon}</Text>
        <Text style={labelStyle}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
    ...theme.shadows.sm,
  },
  emoticon: {
    marginBottom: theme.spacing[1],
  },
  label: {
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  selectedLabel: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.gray[100],
  },
  disabledText: {
    color: theme.colors.gray[400],
  },
});

export default MoodButton;