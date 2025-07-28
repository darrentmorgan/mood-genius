# MoodGenius - AI-Powered Mood & Health Tracking App

## Project Overview
MoodGenius is a React Native Expo app that tracks mood patterns and correlates them with health data (sleep, steps, heart rate, HRV) to provide AI-powered insights for mental wellness.

## Tech Stack
- **Frontend**: React Native with Expo SDK 53
- **Navigation**: React Navigation
- **State Management**: React Context/useState
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Health Data**: Apple HealthKit integration (future)
- **Storage**: AsyncStorage (transitioning to Firestore)
- **AI Integration**: OpenAI API for insights

## Bash Commands
- `npx expo start`: Start development server
- `npx expo start --clear`: Start with cleared cache
- `npx expo run:ios`: Build and run on iOS (requires dev client)
- `npx expo run:android`: Build and run on Android (requires dev client)
- `npx expo prebuild --clean`: Generate native directories with clean build
- `npx expo install <package>`: Install Expo-compatible packages
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript checker

## Code Style Guidelines
- Use ES modules (import/export) syntax, not CommonJS (require)
- Destructure imports when possible: `import { useState } from 'react'`
- Use TypeScript for all new files
- Follow React Native naming conventions (PascalCase for components)
- Use functional components with hooks
- Prefer const over let where possible
- Use descriptive variable names

## File Structure
```
src/
  screens/           # Main app screens
    HomeScreen.js    # Dashboard with today's mood + quick insights
    MoodEntryScreen.js  # Mood input with 1-10 slider + notes
    HistoryScreen.js    # Past mood entries with health data
    ProfileScreen.js    # User settings and preferences
  components/        # Reusable UI components
    MoodSlider.js    # Interactive mood rating slider
    MoodChart.js     # Data visualization charts
    HealthCard.js    # Health metrics display
  services/          # API and data services
    FirebaseService.js  # Firebase auth and Firestore operations
    HealthService.js    # Health data fetching and processing
    MockHealthService.js  # Mock data for testing
  utils/             # Helper functions
    storage.js       # AsyncStorage utilities
    dateUtils.js     # Date formatting and calculations
```

## Testing Instructions
- Run `npx expo start` and test in Expo Go for basic functionality
- For Firebase features, build development client with `npx expo run:ios`
- Test mood entry flow: Home → Add Mood → Save → View in History
- Verify health data correlations display correctly
- Test offline functionality with network disabled

## Firebase Configuration
- Uses React Native Firebase (not Firebase JS SDK)
- Requires `expo-dev-client` for native modules
- Config files: `google-services.json` (Android), `GoogleService-Info.plist` (iOS)
- Authentication: Email/password + Google Sign-In
- Database: Firestore with offline persistence

## Health Data Integration
- Currently uses mock data service for development
- Future: Apple HealthKit integration (requires paid Apple Developer account)
- Mock data includes: sleep hours, steps, heart rate, HRV
- Data correlations: mood vs sleep, activity levels, stress indicators

## AI Insights System
- OpenAI API integration for personalized recommendations
- Correlation analysis: "Your mood is 65% better when you sleep 7+ hours"
- Evidence-based insights from sleep/mood research
- Adaptive suggestions based on user patterns

## Development Workflow
1. **Planning**: Always read relevant files first, don't code immediately
2. **Implementation**: Make changes incrementally with testing
3. **Testing**: Verify functionality after each major change
4. **Commit**: Use descriptive commit messages
5. **Firebase**: Run `npx expo prebuild --clean` after Firebase changes

## Important Notes
- **Cannot use Expo Go** with Firebase features - requires development build
- **iOS requires** `"useFrameworks": "static"` in app.json
- **Always run typecheck** after making code changes
- **Clear cache frequently** with `npx expo start --clear` if issues arise
- **Mock data first**: Build features with mock data before real API integration

## Known Issues & Warnings
- Hermes engine can cause `require doesn't exist` errors - use ES6 imports
- Firebase JS SDK not compatible with Expo SDK 53 - use React Native Firebase
- Large files (>18k lines) may cause memory issues in development
- Metro bundler package exports enabled by default - may affect some libraries

## Repository Guidelines
- **Branch naming**: feature/mood-tracking, fix/login-bug
- **Commits**: Use conventional commits (feat:, fix:, docs:)
- **PRs**: Include screenshots for UI changes
- **Code review**: Test Firebase auth flow before approving
- **Deployment**: Always test on physical device before release

## Environment Setup
- Node.js 20+ required (Node 18 EOL)
- Expo CLI latest version
- For iOS: Xcode 15.2+ required
- For Android: Android Studio with SDK 34+
- Firebase project configured with authentication enabled

## Common Debugging Steps
1. Clear cache: `npx expo start --clear`
2. Rebuild: `npx expo prebuild --clean`
3. Check logs: Look for Firebase auth errors
4. Verify internet connection for Firebase
5. Ensure development build includes Firebase modules

## Future Roadmap
- [ ] Apple HealthKit integration (pending Developer account)
- [ ] Advanced AI insights with pattern recognition  
- [ ] Social features for mood sharing
- [ ] Wearable device integration
- [ ] Professional therapist dashboard
- [ ] Export data for healthcare providers