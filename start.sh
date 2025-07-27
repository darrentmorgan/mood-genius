#!/bin/bash

echo "🧹 Cleaning up file watchers and cache..."

# Clear any existing watches
watchman watch-del-all

# Clear Metro cache
rm -rf $TMPDIR/metro-*

echo "🚀 Starting MoodGenius app..."

# Restart your project
npx expo start --clear