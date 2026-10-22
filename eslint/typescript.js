// OPT-IN — not part of the default export. Not every RN project is
// TypeScript; react-native-screens and react-native-executorch both stay on
// plain JS-shaped linting.
//
// Fast tier: no `project`/`projectService`, so no type-checking cost.
// Source: eslint-config-expo/typescript.js — already shaped exactly like
// this tier, warn-heavy by design. Cross-checked against react-native-screens'
// plain `@typescript-eslint/recommended` override.
//
// For the type-aware tier (slower, catches more, relaxed unsafe-* family),
// see ./typescript-strict.js instead — the two are not meant to be combined.
import tseslint from 'typescript-eslint';

export default tseslint.config(...tseslint.configs.recommended, {
  rules: {
    'no-undef': 'off', // deferred to tsc, which already checks this
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/array-type': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'warn',
    // Needs no type information, so it belongs in this tier too; same
    // setting as ./typescript-strict.js.
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-extra-non-null-assertion': 'warn',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { minimumDescriptionLength: 10, 'ts-expect-error': 'allow-with-description' },
    ],
  },
});
