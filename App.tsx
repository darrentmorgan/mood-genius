import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Text, Platform} from 'react-native';
import ErrorBoundary from './src/components/ErrorBoundary';

import HomeScreen from './src/screens/HomeScreen';
import MoodEntryScreen from './src/screens/MoodEntryScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  console.log('🚀 App: Starting App component');
  console.log('📱 Platform:', Platform.OS);
  
  // Check for Hermes engine
  if (typeof HermesInternal !== 'undefined') {
    console.log('✅ Running on Hermes engine');
  } else {
    console.log('📱 Running on JSC engine');
  }
  
  try {
    console.log('📦 Creating Tab Navigator...');
    console.log('🏠 HomeScreen imported:', typeof HomeScreen);
    console.log('✨ MoodEntryScreen imported:', typeof MoodEntryScreen);
    console.log('📊 HistoryScreen imported:', typeof HistoryScreen);
    
    return (
      <ErrorBoundary>
        <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarIcon: ({focused, color, size}) => {
            let emoji;

            if (route.name === 'Home') {
              emoji = '🏠';
            } else if (route.name === 'Mood Entry') {
              emoji = '✨';
            } else if (route.name === 'History') {
              emoji = '📊';
            }

            return <Text style={{fontSize: size * 0.8, color}}>{emoji}</Text>;
          },
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Mood Entry" component={MoodEntryScreen} />
          <Tab.Screen name="History" component={HistoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ErrorBoundary>
  );
  } catch (error) {
    console.error('🚨 App: Error in App component:', error);
    throw error;
  }
};

export default App;