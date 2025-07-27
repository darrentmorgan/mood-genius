import { initializeApp, getApps } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  // This configuration will be loaded from GoogleService-Info.plist (iOS) 
  // and google-services.json (Android) automatically
  // No need to manually specify config here when using React Native Firebase
};

// Initialize Firebase App (if not already initialized)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export Firebase services
export { auth, firestore };
export default app;