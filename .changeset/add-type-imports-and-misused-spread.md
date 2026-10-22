---
"@red_dial/rn-tooling-config": minor
---

Add `@typescript-eslint/consistent-type-imports` (`warn`) to the fast `typescript` tier (it was already in `typescript-strict`) and `@typescript-eslint/no-misused-spread` (`error`) to `typescript-strict`. The latter is strict-only upstream and catches spreading functions, Promises or strings into props/styles.
