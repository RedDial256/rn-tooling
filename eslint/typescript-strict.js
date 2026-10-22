// OPT-IN — not part of the default export, and not meant to be combined
// with ./typescript.js (pick one tier).
//
// Type-checked tier: keeps type information for the bug classes that
// actually matter, but relaxes the rules that in practice fire mostly
// against untyped third-party RN libraries rather than real bugs.
//
// Source: react-native-reanimated's eslint.config.mjs — the most complete
// type-checked setup in the survey, and the first to explicitly turn the
// whole no-unsafe-* family off rather than leaving it at "recommended".
// Cross-checked: react-native-paper (@callstack/eslint-config overlay)
// reaches the identical relaxation list independently; react-native-gesture-handler
// is a third, earlier confirmation of the same idea (there expressed as
// "warn", not "off" — a fallback if a consumer wants the stricter middle
// ground).
import tseslint from 'typescript-eslint';

export default tseslint.config(...tseslint.configs.recommendedTypeChecked, {
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
  rules: {
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    // Not in recommendedTypeChecked (strict-only); catches `{...someFn}`,
    // `{...promise}` and `[...string]` when spreading props/styles.
    '@typescript-eslint/no-misused-spread': 'error',
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      { minimumDescriptionLength: 10, 'ts-expect-error': 'allow-with-description' },
    ],
  },
});
