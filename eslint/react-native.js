// Source: @callstack/eslint-config's react-native.flat.js — the broadest,
// most actively maintained RN-specific bundle in the survey, already in
// production on two Callstack repos (not a personal config).
// Globals injected directly rather than via a plugin, matching Expo's
// approach in eslint-config-expo.
import reactNative from 'eslint-plugin-react-native';

export default [
  {
    plugins: { 'react-native': reactNative },
    languageOptions: {
      globals: {
        __DEV__: 'readonly',
        ErrorUtils: 'readonly',
      },
    },
    rules: {
      'react-native/no-unused-styles': 'error',
      // Flagged as a warning rather than banned outright: Meta's own
      // @react-native/eslint-config defaults it the same way, and disables
      // it entirely inside Jest files.
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-single-element-style-arrays': 'warn',
    },
  },
  {
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/__tests__/**'],
    rules: {
      'react-native/no-inline-styles': 'off',
    },
  },
];
