// Default export: only what every React Native project has in common —
// JS hygiene, React, RN platform rules, import order. TypeScript and Expo
// are both opt-in (see ./typescript, ./typescript-strict, ./expo) since not
// every RN project uses either.
import base from './base.js';
import imports from './imports.js';
import react from './react.js';
import reactNative from './react-native.js';

/** @type {import('eslint').Linter.Config[]} */
export default [...base, ...react, ...reactNative, ...imports];
