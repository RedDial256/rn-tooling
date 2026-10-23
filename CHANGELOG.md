# @red_dial/rn-tooling-config

## 0.2.0-alpha.2

### Patch Changes

- 95c13ed: Add `author`, `repository`, `homepage`, `bugs` and `keywords` to `package.json` so the npm page links to the GitHub repo and its issues.

## 0.2.0-alpha.1

### Minor Changes

- 1b6ffe0: Add `@typescript-eslint/consistent-type-imports` (`warn`) to the fast `typescript` tier (it was already in `typescript-strict`) and `@typescript-eslint/no-misused-spread` (`error`) to `typescript-strict`. The latter is strict-only upstream and catches spreading functions, Promises or strings into props/styles.
- 1b6ffe0: Replace `eslint-plugin-simple-import-sort` with `eslint-plugin-perfectionist` (`sort-imports`, `sort-named-imports`, `sort-exports`, `sort-named-exports`). Imports are now grouped as: react / react-native / expo (one block, in that order), libraries, `@/`/`~/` aliases, parent files, sibling files; blocks are separated by a blank line and sorted alphabetically.

  `eslint/imports` also exports `createImportsConfig({ groups, internalPattern })` and `defaultGroups`: blocks are keyed by priority (10, 20, 30, 40, 50), so consumers can insert their own (e.g. `{ 15: ['^@react-navigation/'] }`), replace or remove one without rewriting the rest.

  **Breaking for consumers:** the `eslint-plugin-simple-import-sort` peer dependency is replaced by `eslint-plugin-perfectionist` `^5.0.0`.

### Patch Changes

- b60e3b9: Declare `engines.node` as `^20.9.0 || >=22.0.0`: the lower bound comes from ESLint 9 (`^18.18 || ^20.9 || >=21.1`) combined with `eslint-plugin-perfectionist` 5 (`^20 || >=22`), which rules out Node 18 and 21.
- 73147d1: Widen peerDependencies ranges for `eslint-plugin-react-hooks` (was `^5.0.0`, now also allows `^6.0.0`/`^7.0.0`) and `eslint-plugin-simple-import-sort` (was `^12.0.0`, now also allows `^13.0.0`/`^14.0.0`) — the pinned ranges had fallen behind the packages' actual current majors, causing spurious "incorrect peer dependency" warnings on install even though nothing was actually broken.

## 0.2.0-alpha.0

### Minor Changes

- alpha-1
- Initial ESLint + Prettier config for React Native
