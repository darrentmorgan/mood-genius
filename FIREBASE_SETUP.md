# Firebase Setup for MoodGenius

This guide will help you set up Firebase Authentication and Firestore Database for the MoodGenius app.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Google/Firebase account
- Xcode (for iOS development)
- Android Studio (for Android development)

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "mood-genius")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In the Firebase console, navigate to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally enable **Google Sign-In** for additional authentication options

## Step 3: Set up Firestore Database

1. In the Firebase console, navigate to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" (you can configure security rules later)
4. Select a location for your database (choose one closest to your users)

## Step 4: Add iOS App to Firebase Project

1. In the Firebase console, click the iOS icon to add an iOS app
2. Enter your iOS bundle ID: `com.yourcompany.moodgenius` (or your preferred bundle ID)
3. Enter App nickname: "MoodGenius iOS"
4. Click "Register app"
5. Download the `GoogleService-Info.plist` file
6. Place the file in the root directory of your project (same level as `package.json`)

## Step 5: Add Android App to Firebase Project

1. In the Firebase console, click the Android icon to add an Android app
2. Enter your Android package name: `com.yourcompany.moodgenius` (must match iOS bundle ID)
3. Enter App nickname: "MoodGenius Android"
4. Click "Register app"
5. Download the `google-services.json` file
6. Place the file in the root directory of your project (same level as `package.json`)

## Step 6: Update app.json Configuration

Update your `app.json` file with your actual bundle ID/package name:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.yourcompany.moodgenius"
    },
    "android": {
      "package": "com.yourcompany.moodgenius"
    }
  }
}
```

## Step 7: Development Build Setup

Since this app uses Firebase native modules, you cannot use Expo Go. You need to create a development build:

### For iOS:
```bash
npx expo prebuild --clean
npx expo run:ios
```

### For Android:
```bash
npx expo prebuild --clean
npx expo run:android
```

## Step 8: Firestore Security Rules (Production)

For production, update your Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Users can access their own subcollections
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## File Structure

After setup, your project should have these Firebase configuration files:

```
mood-genius/
├── google-services.json          # Android configuration
├── GoogleService-Info.plist      # iOS configuration
├── google-services.json.template # Template (ignore)
├── GoogleService-Info.plist.template # Template (ignore)
└── src/
    ├── config/
    │   └── firebase.js           # Firebase configuration
    ├── services/
    │   ├── AuthService.js        # Authentication service
    │   └── FirestoreService.js   # Database service
    └── context/
        └── AuthContext.tsx       # Authentication context
```

## Database Structure

The app creates the following Firestore collections:

### Users Collection
```
users/{userId}
├── uid: string
├── email: string
├── displayName: string
├── createdAt: timestamp
└── updatedAt: timestamp
```

### Mood Entries Subcollection
```
users/{userId}/moodEntries/{entryId}
├── mood: number (1-5)
├── notes: string
├── date: string
├── timestamp: string
└── createdAt: timestamp
```

### Health Data Subcollection
```
users/{userId}/healthData/{entryId}
├── id: string
├── date: string
├── timestamp: string
├── sleep: object
├── steps: object
├── heartRate: object
└── createdAt: timestamp
```

### AI Insights Subcollection
```
users/{userId}/aiInsights/{insightId}
├── id: string
├── type: string
├── title: string
├── description: string
├── confidence: number
├── recommendation: string
└── createdAt: timestamp
```

## Features

- **Offline Support**: The app works offline and syncs when reconnected
- **Real-time Updates**: Uses Firestore real-time listeners for instant updates
- **User Isolation**: Each user's data is completely isolated and secure
- **Cross-Platform**: Same codebase works on iOS and Android
- **Cloud Backup**: All data is automatically backed up to Firebase

## Troubleshooting

### Common Issues:

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Ensure `google-services.json` and `GoogleService-Info.plist` are in the root directory
   - Run `npx expo prebuild --clean` to regenerate native code

2. **"Auth module not found"**
   - Make sure you ran `npx expo prebuild` after installing Firebase packages
   - Cannot use Expo Go - must use development build

3. **"Permission denied" on Firestore**
   - Check your Firestore security rules
   - Ensure user is authenticated before accessing data

4. **iOS build issues**
   - Make sure `useFrameworks: "static"` is in your `expo-build-properties` plugin
   - Clear Xcode derived data if build fails

## Support

For additional help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [React Native Firebase](https://rnfirebase.io/)

## Security Best Practices

1. **Never commit Firebase config files to public repositories**
2. **Use environment variables for sensitive configuration**
3. **Implement proper Firestore security rules**
4. **Enable email verification for production**
5. **Monitor authentication events in Firebase console**
6. **Use Firebase App Check for additional security**