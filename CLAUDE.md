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

### Development
- `npx expo start`: Start development server
- `npx expo start --clear`: Start with cleared cache
- `npx expo run:ios`: Build and run on iOS (requires dev client)
- `npx expo run:android`: Build and run on Android (requires dev client)
- `npx expo prebuild --clean`: Generate native directories with clean build
- `npx expo install <package>`: Install Expo-compatible packages

### Code Quality
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript checker

### Testing (TDD Workflow)
- `npm test`: Run all tests once
- `npm run test:watch`: Run tests in watch mode (recommended for TDD)
- `npm run test:unit`: Run unit tests only
- `npm run test:integration`: Run integration tests
- `npm run test:components`: Run component tests
- `npm run test:coverage`: Generate test coverage report
- `npm run test:e2e`: Run end-to-end tests (requires simulator)

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

## Test-Driven Development (TDD) Guidelines

### Core TDD Workflow
1. **🔴 Red**: Write a failing test that describes the desired functionality
2. **🟢 Green**: Write the minimal code to make the test pass
3. **🔵 Refactor**: Improve the code while keeping tests passing
4. **🔄 Repeat**: Continue cycle for each new feature or bug fix

### Testing Framework Setup
```bash
# Install testing dependencies
npm install --save-dev jest @testing-library/react-native @testing-library/jest-native
npm install --save-dev react-test-renderer @react-native-firebase/firestore-testing
npm install --save-dev detox # For E2E testing
```

### Test Categories & Priorities

#### 1. Unit Tests (Highest Priority)
- **Utils & Services**: Test pure functions and business logic
- **Custom Hooks**: Test `useAuth`, health data processing
- **Mock Data Generation**: Test correlation algorithms
- **Date Utilities**: Test mood entry date calculations

#### 2. Component Tests (High Priority)
- **Authentication Forms**: Login/SignUp validation and submission
- **Mood Entry Components**: Slider interaction and data submission
- **Navigation Flows**: AuthWrapper behavior and route protection
- **Settings Management**: Health settings toggle and persistence

#### 3. Integration Tests (Medium Priority)
- **Firebase Operations**: Auth flows and Firestore CRUD operations
- **Offline Sync**: Data persistence and sync when coming online
- **Health Data Correlation**: Mock data generation with mood patterns
- **Context Providers**: AuthContext state management

#### 4. End-to-End Tests (Lower Priority)
- **Complete User Flows**: Signup → Mood Entry → View History → Insights
- **Cross-Screen Navigation**: Tab navigation and stack navigation
- **Data Persistence**: Full app lifecycle with data retention

### Testing Specific Features

#### Firebase Authentication Testing
```javascript
// Test structure for auth flows
describe('AuthService', () => {
  beforeEach(() => {
    // Reset Firebase auth state
    // Use Firebase testing utilities
  });
  
  it('should create user account with email/password', async () => {
    // Test user creation
  });
  
  it('should handle authentication errors gracefully', async () => {
    // Test error states and user feedback
  });
});
```

#### Component Testing Best Practices
```javascript
// Test React Native components
import { render, fireEvent, waitFor } from '@testing-library/react-native';

describe('MoodEntryScreen', () => {
  it('should save mood entry and navigate to home', async () => {
    // Test mood selection, note entry, and save action
  });
  
  it('should show validation errors for incomplete entries', () => {
    // Test form validation
  });
});
```

#### Health Data & Mock Testing
```javascript
describe('MockHealthService', () => {
  it('should generate realistic health data correlating with mood', () => {
    // Test mood-health correlation algorithms
  });
  
  it('should create 7 days of consistent mock data', () => {
    // Test data generation consistency
  });
});
```

### Test File Organization
```
__tests__/
  unit/
    services/
      AuthService.test.js
      MockHealthService.test.js
      FirestoreService.test.js
    utils/
      storage.test.js
      healthSettings.test.js
      dateUtils.test.js
  integration/
    auth-flow.test.js
    data-sync.test.js
    mock-health-correlation.test.js
  components/
    AuthWrapper.test.js
    MoodEntryScreen.test.js
    ProfileScreen.test.js
  e2e/
    complete-user-journey.test.js
```

### TDD-Specific Commands
```bash
# Run tests
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run with coverage report
npm run test:unit          # Run only unit tests
npm run test:integration   # Run only integration tests
npm run test:e2e          # Run E2E tests (requires device/simulator)

# Test-specific scripts to add to package.json
"test:unit": "jest __tests__/unit",
"test:integration": "jest __tests__/integration",
"test:components": "jest __tests__/components",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage"
```

### Firebase Testing Configuration
```javascript
// jest.config.js additions for Firebase testing
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'node',
  // Mock Firebase for unit tests
  moduleNameMapping: {
    '@react-native-firebase/auth': '<rootDir>/__mocks__/firebase-auth.js',
    '@react-native-firebase/firestore': '<rootDir>/__mocks__/firebase-firestore.js',
  },
};
```

### TDD Integration with Development Workflow
1. **Before New Features**: Write tests first, then implement
2. **Bug Fixes**: Write test reproducing bug, then fix
3. **Refactoring**: Ensure all tests pass before and after changes
4. **Code Review**: Require tests for all new functionality
5. **CI/CD**: Run full test suite before merging/deploying

### Testing Critical User Flows
#### Priority 1 (Must Test)
- User authentication (signup, login, logout)
- Mood entry creation and persistence
- Offline data storage and sync
- Navigation between authenticated/unauthenticated states

#### Priority 2 (Should Test)
- Health settings management (mock data toggle)
- Sample data generation for testing
- Profile management and updates
- Form validation and error handling

#### Priority 3 (Nice to Test)
- UI component rendering and styling
- Performance optimizations
- Analytics tracking
- Error boundary behavior

### Mock Strategy for External Dependencies
- **Firebase**: Use Firebase testing utilities and mocks
- **Health Data**: Use deterministic mock data for consistent tests
- **Navigation**: Mock React Navigation for isolated component tests
- **AsyncStorage**: Use in-memory storage for fast test execution

### Testing Project-Specific Features

#### Health Data Correlation Algorithm Testing
```javascript
describe('Health-Mood Correlations', () => {
  it('should generate sleep data that correlates with mood entries', () => {
    const moodEntries = [
      { mood: 8, date: '2024-01-01' },
      { mood: 4, date: '2024-01-02' }
    ];
    const healthData = MockHealthService.generateCorrelatedData(moodEntries);
    
    expect(healthData['2024-01-01'].sleep).toBeGreaterThan(7);
    expect(healthData['2024-01-02'].sleep).toBeLessThan(6);
  });
  
  it('should maintain realistic health metric ranges', () => {
    // Test that generated data stays within human physiological ranges
  });
});
```

#### Firebase Integration Testing
```javascript
describe('Firebase Integration', () => {
  beforeEach(async () => {
    // Use Firebase testing utilities to reset state
    await firebase.clearFirestoreData({ projectId: 'test-project' });
  });
  
  it('should sync mood entries to Firestore when online', async () => {
    // Test online sync behavior
  });
  
  it('should store data locally when offline and sync when reconnected', async () => {
    // Test offline/online data synchronization
  });
});
```

#### AI Insights Testing
```javascript
describe('AI Insights Generation', () => {
  it('should generate appropriate insights based on mood-health patterns', () => {
    const mockData = {
      mood: [7, 8, 9, 6, 5],
      sleep: [8, 8.5, 9, 6, 5.5],
      steps: [8000, 9000, 10000, 4000, 3000]
    };
    
    const insights = generateInsights(mockData);
    expect(insights).toContain('sleep');
    expect(insights).toContain('activity');
  });
});
```

### Continuous Integration Setup
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test -- --coverage
      - run: npm run test:integration
```

### TDD Quick Reference Patterns

#### Testing Custom Hooks
```javascript
import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../context/AuthContext';

test('useAuth should handle login flow', async () => {
  const { result } = renderHook(() => useAuth());
  
  await act(async () => {
    await result.current.signIn('test@example.com', 'password');
  });
  
  expect(result.current.user).toBeTruthy();
});
```

#### Testing React Native Components
```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

test('MoodEntryScreen submits mood data', async () => {
  const mockNavigation = { navigate: jest.fn() };
  const { getByTestId } = render(<MoodEntryScreen navigation={mockNavigation} />);
  
  fireEvent.press(getByTestId('mood-button-8'));
  fireEvent.changeText(getByTestId('notes-input'), 'Feeling great today!');
  fireEvent.press(getByTestId('save-button'));
  
  await waitFor(() => {
    expect(mockNavigation.navigate).toHaveBeenCalledWith('Home');
  });
});
```

#### Testing Async Firebase Operations
```javascript
import firestore from '@react-native-firebase/firestore';

jest.mock('@react-native-firebase/firestore');

test('should save mood entry to Firestore', async () => {
  const mockCollection = jest.fn(() => ({
    doc: jest.fn(() => ({
      set: jest.fn().mockResolvedValue(true)
    }))
  }));
  
  firestore.mockReturnValue({ collection: mockCollection });
  
  await saveMoodEntry(8, 'Great day!');
  
  expect(mockCollection).toHaveBeenCalledWith('moodEntries');
});
```

## Development Workflow
1. **Planning**: Always read relevant files first, don't code immediately
2. **Test First**: Write failing tests before implementing features (TDD)
3. **Implementation**: Make changes incrementally with continuous testing
4. **Verification**: Ensure all tests pass before committing
5. **Integration Testing**: Test Firebase features with development client
6. **Commit**: Use descriptive commit messages with test coverage info
7. **Firebase**: Run `npx expo prebuild --clean` after Firebase changes

## Important Notes
- **TDD First**: Always write tests before implementing new features
- **Test Before Commit**: Run `npm test` and ensure all tests pass before committing
- **Cannot use Expo Go** with Firebase features - requires development build
- **iOS requires** `"useFrameworks": "static"` in app.json
- **Always run typecheck and tests** after making code changes
- **Clear cache frequently** with `npx expo start --clear` if issues arise
- **Mock data first**: Build features with mock data before real API integration
- **Test Coverage**: Maintain >80% test coverage for critical user flows

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

## Testing Roadmap (Immediate Priorities)

### Phase 1: Critical Path Testing
- [ ] AuthService unit tests (signup, login, logout, error handling)
- [ ] AuthWrapper component tests (navigation flow, loading states)
- [ ] MockHealthService correlation algorithm tests
- [ ] Firestore integration tests (offline sync, data persistence)

### Phase 2: User Flow Testing
- [ ] ProfileScreen settings integration tests
- [ ] MoodEntryScreen component tests (mood selection, note entry)
- [ ] Navigation flow tests (auth transitions, tab navigation)
- [ ] Form validation tests (login, signup, profile update)

### Phase 3: Advanced Feature Testing
- [ ] Health data correlation accuracy tests
- [ ] AI insights generation tests
- [ ] Performance tests for large datasets
- [ ] E2E user journey tests

### Recently Implemented Features Needing Tests
```javascript
// Priority tests for recent changes
describe('ProfileScreen Settings Integration', () => {
  it('should toggle mock data and update settings state', () => {
    // Test the settings functionality we just added
  });
  
  it('should generate sample mood data when requested', () => {
    // Test the sample data generation feature
  });
  
  it('should clear test data with proper confirmation', () => {
    // Test the data clearing functionality
  });
});
```

## Future Roadmap
- [ ] Complete Phase 1 testing implementation
- [ ] Set up CI/CD pipeline with automated testing
- [ ] Apple HealthKit integration (pending Developer account)
- [ ] Advanced AI insights with pattern recognition  
- [ ] Social features for mood sharing
- [ ] Wearable device integration
- [ ] Professional therapist dashboard
- [ ] Export data for healthcare providers