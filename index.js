import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

console.log('🚀 Index.js: Starting app initialization...');
console.log('📱 Platform detected:', Platform.OS);
console.log('🌍 Environment:', __DEV__ ? 'Development' : 'Production');
console.log('📛 App name from app.json:', appName);

// Check for Hermes
console.log('🔍 Checking JS Engine...');
if (typeof HermesInternal === 'undefined') {
  console.log('✅ Hermes NOT detected - using JSC');
} else {
  console.log('✅ Hermes detected - optimized for performance');
}

console.log('📦 App component type:', typeof App);
console.log('📋 Registering app component as:', appName);

// Register the app component
AppRegistry.registerComponent(appName, () => {
  console.log('🏗️ App component factory called for:', appName);
  return App;
});

// Also register as 'main' for backwards compatibility
AppRegistry.registerComponent('main', () => {
  console.log('🏗️ App component factory called for: main');
  return App;
});

console.log('✅ App registered successfully as both:', appName, 'and main');

// For web
if (Platform.OS === 'web') {
  console.log('🌐 Running web version...');
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root') || document.getElementById('main')
  });
}

console.log('🎉 Index.js: Initialization complete!');