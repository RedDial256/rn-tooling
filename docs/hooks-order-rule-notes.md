# Notes: a "component body order" ESLint rule

Status: **not implemented here.** These are design notes for a custom rule
(or plugin) that enforces the order of statements inside a React component.
No existing rule does this: `react/sort-comp` only handles class components.

## Desired layout

Groups separated by one blank line; a group may contain several lines.

1. `useState` / `useReducer`
2. `useRef`
3. Hooks from libraries (e.g. `useNavigation`, `useQuery`)
4. Custom hooks (project code)
5. `useMemo`
6. `useCallback`
7. `useEffect`
8. Render-only consts: values not referenced by any hook, declared right
   before the JSX `return`

## What the rule has to do

| Concern | Approach | Difficulty |
|---|---|---|
| Find component bodies | Function (declaration, arrow, `memo`/`forwardRef` wrapper) that returns JSX | Easy |
| Classify a statement into a group | Callee name of the initialiser (`useState`, `useRef`, ...) | Easy |
| Library hook vs custom hook | Resolve the callee's binding to its `import`; a relative or configured alias source means custom, a package means library | Medium: needs a list of alias patterns, so make it an option |
| Blank lines between groups | Compare line numbers of adjacent statements through `sourceCode` | Easy |
| Render-only consts last | Scope analysis: a const is render-only if no hook callback references it (`context.sourceCode.getScope(node).references`) | Medium-hard |
| Order violations | Compare group index of consecutive statements | Easy |

## Pitfalls

- **Dependencies between statements.** A `useCallback` may use a const
  declared above it, and `const` has a temporal dead zone. Moving statements
  can break the component at runtime, so the group order has to yield to
  data dependencies. Decide whether a dependency violation is reported,
  ignored, or makes the whole component skip the check.
- **Autofix is risky.** Reordering is only safe if the rule proves there is
  no dependency between the statements it moves. Start with report-only, no
  fixer, and add a fixer later for the provably safe cases.
- **Unclassified statements** (plain consts, early returns, conditionals):
  hooks must not run after an early return, which `react-hooks/rules-of-hooks`
  already covers. Decide where plain statements fit, or ignore them.
- **Hooks from the wrong source.** `use` prefixed functions that are not hooks
  (or hooks without the prefix) need an escape hatch option.
- **Options.** Expose the group list as an option (array of group names or
  patterns) so projects can reorder or merge groups without forking the rule.

## Can it live in a separate project?

Yes, and it probably should.

- A rule is a plain object with `meta` and `create`, exported from a plugin:
  `export default { rules: { 'component-body-order': rule } }`.
- This repo then consumes it like any other plugin (as a peer dependency, the
  same way `eslint-plugin-react` is used) from `eslint/react.js` or a new
  opt-in file.
- Separate package benefits: independent versioning, its own tests, reuse by
  projects that do not want the rest of this config, and no new rule code in
  this repo's published `files` (`eslint`, `prettier`).
- Keeping it in this repo only makes sense if it stays small and tightly bound
  to the preset. A flat-config plugin local to the repo is also possible
  (`plugins: { local: { rules: { ... } } }`), but then it ships to every
  consumer.

## Testing

Use `RuleTester` from `eslint` (flat config, `languageOptions.parserOptions.ecmaFeatures.jsx: true`
plus the TypeScript parser for `.tsx` cases). Cover at least: correct order
passes, each swapped pair fails, blank-line missing/extra, dependency between
statements, `memo`/`forwardRef` wrapped components, and non-component
functions being ignored.
