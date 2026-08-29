// OPT-IN — not part of the default export. Only import this if the project
// actually depends on `expo`; a bare React Native CLI project has nothing to
// gain from it.
//
// Source: eslint-config-expo/expo.js. Deliberately minimal and scoped to
// only what could be directly confirmed from Expo's own config during the
// survey (a browser-globals override for `*.web.*` files, since Expo
// projects commonly ship a web target via react-native-web). Extend as
// Expo-Router / Metro-specific needs come up rather than guessing ahead.
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.web.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
];
