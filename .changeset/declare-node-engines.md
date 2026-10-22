---
"@red_dial/rn-tooling-config": patch
---

Declare `engines.node` as `^20.9.0 || >=22.0.0`: the lower bound comes from ESLint 9 (`^18.18 || ^20.9 || >=21.1`) combined with `eslint-plugin-perfectionist` 5 (`^20 || >=22`), which rules out Node 18 and 21.
