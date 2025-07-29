import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, Platform} from 'react-native';
import { NativeBaseProvider } from 'native-base';
import 'react-native-reanimated';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AuthProvider } from './src/context/AuthContext';
import AuthWrapper from './src/components/AuthWrapper';
import { theme } from './src/theme';

import TestScreen from './src/screens/TestScreen';

const Tab = createBottomTabNavigator();

// Main App Tabs (authenticated users)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({route}) => ({
      tabBarIcon: ({focused, color, size}) => {
        let emoji;

        if (route.name === 'Test') {
          emoji = '🧪';
        }

        return <Text style={{fontSize: size * 0.8, color}}>{emoji}</Text>;
      },
      tabBarActiveTintColor: '#4ADE80',
      tabBarInactiveTintColor: '#9CA3AF',
      headerStyle: {
        backgroundColor: '#4ADE80',
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    })}>
      <Tab.Screen name="Test" component={TestScreen} />
    </Tab.Navigator>
);

const App = () => {
  console.log('🚀 App: Starting App component with Firebase authentication');
  console.log('📱 Platform:', Platform.OS);
  
  // Check for Hermes engine
  if (typeof HermesInternal !== 'undefined') {
    console.log('✅ Running on Hermes engine');
  } else {
    console.log('📱 Running on JSC engine');
  }
  
  try {
    return (
      <NativeBaseProvider>
        <NavigationContainer>
          <MainTabs />
        </NavigationContainer>
      </NativeBaseProvider>
    );
  } catch (error) {
    console.error('🚨 App: Error in App component:', error);
    throw error;
  }
};

export default App;