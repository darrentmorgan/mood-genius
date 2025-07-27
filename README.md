# MoodGenius 📱✨

A beautiful React Native mood tracking app that helps you monitor your emotional well-being with data persistence and modern design.

## Features ✅

- **📊 Mood Tracking**: Rate your mood from 1-10 with intuitive slider and emoji feedback
- **📝 Notes System**: Add context to your mood entries with optional notes
- **📈 History View**: Browse all your past mood entries with dates and times
- **💾 Data Persistence**: All entries automatically saved using AsyncStorage
- **🏠 Smart Home Screen**: View today's mood and quick access to features
- **📱 Cross-Platform**: Works on iOS, Android, and Web
- **⚡ Hermes Engine**: Optimized performance with Hermes JavaScript engine
- **🎨 Modern UI**: Clean, intuitive design with emoji navigation

## Screenshots 📸

*(Add screenshots here when available)*

## Tech Stack 🛠️

- **React Native** 0.79.5
- **Expo** SDK 53
- **React Navigation** v6 (Bottom Tabs)
- **AsyncStorage** for data persistence
- **TypeScript** for type safety
- **Hermes** JavaScript engine
- **Metro** bundler

## Getting Started 🚀

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Expo Go app (for testing on device)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mood-genius.git
   cd mood-genius
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run expo
   ```

4. **Run on device**
   - Install Expo Go on your phone
   - Scan the QR code displayed in terminal
   - The app will load directly on your device!

### Alternative Run Commands

```bash
# Start with cache clearing (recommended)
npm run expo

# Web browser testing
npx expo start --web

# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Clean start (if issues)
npm run clean-start
```

## Project Structure 📁

```
mood-genius/
├── src/
│   ├── components/
│   │   └── ErrorBoundary.tsx     # Error handling component
│   ├── screens/
│   │   ├── HomeScreen.tsx        # Today's mood + quick actions
│   │   ├── MoodEntryScreen.tsx   # Mood input with slider & notes
│   │   └── HistoryScreen.tsx     # Past mood entries list
│   └── utils/
│       └── storage.ts            # AsyncStorage utilities
├── App.tsx                       # Main navigation setup
├── index.js                      # App registration & entry point
├── app.json                      # Expo configuration
├── package.json                  # Dependencies & scripts
└── README.md                     # This file
```

## Features Deep Dive 🔍

### Home Screen
- Displays today's current mood entry
- Quick action buttons for new entries and viewing history
- Greeting message based on time of day
- Recent mood entries preview

### Mood Entry Screen
- Interactive 1-10 slider with real-time emoji feedback
- Optional notes input for context
- Visual mood indicators (😢 → 😄)
- Save functionality with timestamp

### History Screen
- Chronological list of all mood entries
- Date and time stamps for each entry
- Notes preview when available
- Pull-to-refresh functionality
- Empty state messaging

## Development 👨‍💻

### Key Implementation Details

- **Hermes Compatibility**: All imports use ES6 modules for Hermes optimization
- **Error Boundaries**: Comprehensive error handling with detailed logging
- **Data Structure**: Mood entries include ID, mood value, notes, timestamp, and date
- **Navigation**: Bottom tab navigation with emoji icons
- **Responsive Design**: Works on various screen sizes

### Troubleshooting

If you encounter issues:

1. **Clear caches**: `npm run expo` (includes cache clearing)
2. **Check Metro logs**: Look for detailed error messages in terminal
3. **Hermes compatibility**: Ensure all imports use ES6 syntax
4. **Component registration**: Verify AppRegistry setup in index.js

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- Built with [Expo](https://expo.dev/)
- Navigation by [React Navigation](https://reactnavigation.org/)
- Icons and UI inspiration from modern mobile design patterns

---

**Made with ❤️ and React Native**

*Track your mood, improve your well-being!* 🌟