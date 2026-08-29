// Prettier 3.x settings for React Native projects.
//
// Field names match oxfmt's config schema too — see ./oxfmt.json for the
// identical values in the format `.oxfmtrc.json` expects, for consumers who
// prefer the Rust-based, faster oxfmt engine over classic Prettier.
//
// Values are the majority choice from a 15-repo survey (Meta, Expo,
// Software Mansion, Callstack, Shopify, Infinite Red) — see the project's
// lint/format field guide for the full per-option breakdown and tallies.
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  arrowParens: 'always',
  // Minority in the raw count (5/15) but concentrated in Meta, Expo, and
  // 3 of Software Mansion's 4 repos — precisely the RN/JSX-authoring
  // cluster. Inert on non-JSX files, so no downside to defaulting it on
  // for a config whose every consumer writes RN/JSX.
  bracketSameLine: true,
  // Not majority (only Meta sets it explicitly) — added deliberately to
  // avoid CRLF/LF diff churn between Windows, macOS, and Linux contributors.
  endOfLine: 'lf',
};
