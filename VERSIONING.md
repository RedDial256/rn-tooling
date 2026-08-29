# Versioning

`@rn-tooling/config` follows [Semantic Versioning](https://semver.org/) (`MAJOR.MINOR.PATCH`), with one standard pre-1.0 caveat: while the version stays `0.x.y`, a breaking change bumps **MINOR**, not MAJOR — `0.x` signals "still unstable" under semver itself, so MAJOR is reserved for the first `1.0.0` and beyond.

- **MAJOR** — a change that breaks an existing consumer's config: a rule's default severity changes in a way that fails CI, an export is removed or renamed, a peer dependency floor moves up (e.g. dropping ESLint 9 support).
- **MINOR** — backwards-compatible additions: a new rule enabled at `warn`, a new optional subpath export, support for a newer ESLint/Prettier major added alongside the existing one. Also used for breaking changes while the version is still `0.x`.
- **PATCH** — bug fixes: a rule value that didn't match its stated rationale, a dependency bump that doesn't move a peer requirement, wording/comment fixes.

## Release channels

Every release goes through the same four stages before anything lands on the default install. Each stage maps to its own npm [dist-tag](https://docs.npmjs.com/cli/v10/commands/npm-dist-tag), so nothing pre-release ever reaches a consumer who just runs `npm install @rn-tooling/config`.

| Channel | Version shape | npm tag | Install with | Meaning |
|---|---|---|---|---|
| **alpha** | `x.y.z-alpha.N` | `alpha` | `npm i @rn-tooling/config@alpha` | Early and unstable. Rule sets can still change shape between alpha releases. For dogfooding on a real RN project before wider testing. |
| **beta** | `x.y.z-beta.N` | `beta` | `npm i @rn-tooling/config@beta` | Feature-complete for the target version — exports and rule shape are frozen. Further changes are refinements from real-project feedback, not structural changes. |
| **rc** | `x.y.z-rc.N` | `rc` | `npm i @rn-tooling/config@rc` | Release candidate. No known open issues; final verification only. If nothing breaks, the next publish is stable. |
| **stable** | `x.y.z` | `latest` | `npm i @rn-tooling/config` | What consumers get by default. |

A version only ever moves forward through this list for a given release — there's no publishing a `beta` after an `rc` for the same target version.

## Tooling: Changesets

Releases are driven by [`@changesets/cli`](https://github.com/changesets/changesets), already installed as a dev dependency and initialized under `.changeset/`. Changesets was chosen over fully-automated tools like `semantic-release` specifically because it keeps a human decision point at every stage transition — nothing enters beta or graduates to stable without someone explicitly running the command for it.

`.changeset/config.json` has `"access": "public"` set explicitly — `@rn-tooling/config` is a scoped package name, and npm treats scoped packages as private by default, which would otherwise make the first publish fail without a paid npm org.

### Day-to-day: recording a change

Every change worth mentioning in the changelog gets its own changeset:

```bash
npx changeset
```

This prompts for a bump type (patch/minor/major) and a one-line description, then writes a small Markdown file under `.changeset/`. Commit that file along with the change itself. Changesets don't need to be consumed one at a time — several can accumulate before the next `version` run, and their bump types combine (the highest one wins).

### Moving through the channels

Each stage transition is the same three-command pattern: enter or switch the pre-release mode, bump the version, publish. `changeset publish` reads the version string itself and applies the matching npm dist-tag automatically — there's no need to pass `--tag` by hand.

```bash
# Enter alpha
npx changeset pre enter alpha
npx changeset version      # e.g. 0.1.0 -> 0.2.0-alpha.0
npx changeset publish      # tag: alpha

# ...more alpha releases: repeat `changeset` + `version` + `publish`
# (version climbs alpha.0 -> alpha.1 -> alpha.2 ...)

# Move to beta
npx changeset pre exit
npx changeset pre enter beta
npx changeset version      # -> 0.2.0-beta.0
npx changeset publish      # tag: beta

# Move to release candidate
npx changeset pre exit
npx changeset pre enter rc
npx changeset version      # -> 0.2.0-rc.0
npx changeset publish      # tag: rc

# Graduate to stable
npx changeset pre exit
npx changeset version      # -> 0.2.0
npx changeset publish      # tag: latest
```

After each `changeset publish`, push the commit and the git tag it created:

```bash
git push --follow-tags
```

### Prerequisites

- `npm login`, and ownership of (or publish access to) the `@rn-tooling` scope on npm — required before the first `changeset publish` will succeed.
- A clean, committed working tree before running `version` is recommended (not enforced by Changesets) so the version bump and changelog update are their own reviewable commit.

## Which channel should a change go through?

- Internal restructuring, a new rule file, anything that changes what the config actually lints/formats: start at **alpha**.
- Once the shape feels settled and there's nothing left to structurally change: promote the *same* target version to **beta** rather than starting a new one.
- Once a beta has run against a couple of real projects with no issues: promote to **rc**.
- An `rc` with no reported problems after a reasonable soak period graduates straight to **stable** — no new changeset needed just for the graduation itself, since no code changes at that step.
