import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../theme';

const ScreenContainer = ({ 
  children, 
  safeArea = true, 
  backgroundColor = theme.colors.background.secondary,
  padding = theme.spacing[4],
  edges = ['top', 'left', 'right'],
  style = {},
  testID,
  ...props 
}) => {
  const containerStyle = [
    styles.container,
    {
      backgroundColor,
      padding,
    },
    style,
  ];
  
  if (safeArea) {
    return (
      <SafeAreaView 
        style={containerStyle} 
        edges={edges}
        testID={testID}
        {...props}
      >
        {children}
      </SafeAreaView>
    );
  }
  
  return (
    <View 
      style={containerStyle} 
      testID={testID}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScreenContainer;