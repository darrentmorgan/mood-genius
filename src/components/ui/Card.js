import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const Card = ({ 
  children, 
  variant = 'default', 
  style = {}, 
  testID,
  ...props 
}) => {
  const cardStyle = theme.variants.card[variant] || theme.variants.card.default;
  
  return (
    <View 
      style={[styles.base, cardStyle, style]} 
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    // Base styles that apply to all card variants
    overflow: 'hidden',
  },
});

export default Card;