// Source: react-native-reanimated's eslint.config.mjs + eslint-config-expo/react.js
// — the two most recent flat-config-native setups in the survey.
// rules-of-hooks / exhaustive-deps as "error" is the norm everywhere except
// react-native-screens' "warn" (the outlier, not the pattern to copy).
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import('eslint').Linter.Config[]} */
export default [
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'], // automatic JSX runtime, no `import React` needed
  {
    plugins: { 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // TypeScript (when the typescript.js/typescript-strict.js tier is
      // layered in) already covers prop typing.
      'react/prop-types': 'off',
      'react/display-name': 'off',
    },
  },
];
