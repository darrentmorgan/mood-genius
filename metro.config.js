const {getDefaultConfig} = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Optimize for Hermes
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
};

// Ensure proper module resolution
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'web'],
};

module.exports = config;