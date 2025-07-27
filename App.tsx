import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {Text, Platform} from 'react-native';
import ErrorBoundary from './src/components/ErrorBoundary';
import { AuthProvider } from './src/context/AuthContext';
import AuthWrapper from './src/components/AuthWrapper';

import HomeScreen from './src/screens/HomeScreen';
import MoodEntryScreen from './src/screens/MoodEntryScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import InsightsScreen from './src/screens/InsightsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Auth Stack for login/signup
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// Main App Tabs (authenticated users)
const MainTabs = () => (
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
        } else if (route.name === 'Insights') {
          emoji = '🤖';
        } else if (route.name === 'Profile') {
          emoji = '👤';
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
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <ErrorBoundary>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {/* Auth Stack */}
              <Stack.Screen name="Auth" component={AuthStack} />
              {/* Main App wrapped with auth protection */}
              <Stack.Screen name="Main">
                {() => (
                  <AuthWrapper>
                    <MainTabs />
                  </AuthWrapper>
                )}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('🚨 App: Error in App component:', error);
    throw error;
  }
};

export default App;