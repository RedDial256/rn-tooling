---
"@red_dial/rn-tooling-config": patch
---

Widen peerDependencies ranges for `eslint-plugin-react-hooks` (was `^5.0.0`, now also allows `^6.0.0`/`^7.0.0`) and `eslint-plugin-simple-import-sort` (was `^12.0.0`, now also allows `^13.0.0`/`^14.0.0`) — the pinned ranges had fallen behind the packages' actual current majors, causing spurious "incorrect peer dependency" warnings on install even though nothing was actually broken.
