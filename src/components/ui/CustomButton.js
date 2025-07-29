import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme';
import * as Haptics from 'expo-haptics';

const CustomButton = ({ 
  title,
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onPress,
  style = {},
  textStyle = {},
  gradient = false,
  testID,
  children,
  ...props 
}) => {
  const scaleAnim = new Animated.Value(1);
  
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[4],
          fontSize: theme.typography.fontSize.sm,
        };
      case 'large':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[8],
          fontSize: theme.typography.fontSize.lg,
        };
      default: // medium
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[6],
          fontSize: theme.typography.fontSize.base,
        };
    }
  };
  
  const sizeStyles = getSizeStyles();
  const variantStyle = theme.variants.button[variant] || theme.variants.button.primary;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
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
    if (disabled || loading) return;
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    onPress && onPress();
  };
  
  const buttonStyle = [
    styles.button,
    variantStyle,
    {
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
    },
    disabled && styles.disabled,
    style,
  ];
  
  const textStyles = [
    styles.text,
    {
      color: variantStyle.color,
      fontSize: sizeStyles.fontSize,
    },
    disabled && styles.disabledText,
    textStyle,
  ];
  
  const buttonContent = (
    <Text style={textStyles}>
      {loading ? 'Loading...' : title || children}
    </Text>
  );
  
  const ButtonComponent = ({ children, style }) => (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={style}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        testID={testID}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
  
  // Use gradient if specified and variant is primary
  if (gradient && variant === 'primary') {
    return (
      <ButtonComponent style={[buttonStyle, { backgroundColor: 'transparent' }]}>
        <LinearGradient
          colors={[theme.colors.primary[400], theme.colors.primary[600]]}
          style={[
            StyleSheet.absoluteFill,
            { borderRadius: variantStyle.borderRadius },
          ]}
        />
        {buttonContent}
      </ButtonComponent>
    );
  }
  
  return (
    <ButtonComponent style={buttonStyle}>
      {buttonContent}
    </ButtonComponent>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  text: {
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: theme.colors.gray[200],
  },
  disabledText: {
    color: theme.colors.gray[400],
  },
});

export default CustomButton;