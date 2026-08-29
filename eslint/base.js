// Source: eslint-config-expo/core.js (Expo) — the one config in the survey
// already shipped as an isolated, React-agnostic file. Cross-checked against
// @react-native/eslint-config and @callstack/eslint-config for eslint-comments
// hygiene, which both include and Expo's core.js doesn't.
import js from '@eslint/js';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  comments.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.es2022,
        ...globals.node,
        __DEV__: 'readonly',
      },
    },
    rules: {
      // Expo core.js: smart equality, no var, but unused vars stay a warning
      // rather than an error — noisy during refactors, not worth blocking on.
      eqeqeq: ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-dupe-class-members': 'error',
      'no-unreachable': 'error',
      curly: ['error', 'multi-line'],
      'no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
  {
    // Metro/Babel config files run under plain Node, not the RN runtime.
    files: ['metro.config.js', 'babel.config.js', '*.config.js', '*.config.mjs'],
    languageOptions: {
      globals: { ...globals.node },
      sourceType: 'commonjs',
    },
  },
];
