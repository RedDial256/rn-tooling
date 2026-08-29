// Source: react-native-reanimated + react-native-gesture-handler — the only
// place in the survey where two unrelated Software Mansion repos converge on
// the exact same mechanism (simple-import-sort) instead of
// eslint-plugin-import's order rule. Simpler to configure, one mechanism
// instead of two.
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
];
