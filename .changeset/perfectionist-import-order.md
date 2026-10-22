---
"@red_dial/rn-tooling-config": minor
---

Replace `eslint-plugin-simple-import-sort` with `eslint-plugin-perfectionist` (`sort-imports`, `sort-named-imports`, `sort-exports`, `sort-named-exports`). Imports are now grouped as: react / react-native / expo (one block, in that order), libraries, `@/`/`~/` aliases, parent files, sibling files; blocks are separated by a blank line and sorted alphabetically.

`eslint/imports` also exports `createImportsConfig({ groups, internalPattern })` and `defaultGroups`: blocks are keyed by priority (10, 20, 30, 40, 50), so consumers can insert their own (e.g. `{ 15: ['^@react-navigation/'] }`), replace or remove one without rewriting the rest.

**Breaking for consumers:** the `eslint-plugin-simple-import-sort` peer dependency is replaced by `eslint-plugin-perfectionist` `^5.0.0`.
