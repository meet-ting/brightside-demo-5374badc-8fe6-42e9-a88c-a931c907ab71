# Brightside standalone demo

This is a synthetic, fictional home-project consultancy demo exported from one
approved local session. It is **not a claim of deployment or live publication**.
No account credentials, campaign registry, chat/Slack records, containing
workspace, deployment workflow, or remote configuration is included.

## Local verification

Use Node 24 and pnpm 10.26.1:

```sh
pnpm install --frozen-lockfile
pnpm test
pnpm typecheck
pnpm build
pnpm dev
```

The package has one root and no workspace dependencies. The Vite and TypeScript
configs are portable and use relative paths; the app is mounted at `/`. The
pruned lock retains the approved Linux x64/glibc native-package restrictions.
Linux is the verified install/build platform. A different platform requires an
explicitly reviewed lock regeneration, not an assertion that absent native
package resolutions were verified. Dependency installation is not performed by
the exporter, and linking installed modules for its checks adds nothing to this
repository.

`pnpm test` runs the exported tests, including `tests/baseline.test.mjs` and the
generated provenance integrity test. For a patch, the session's baseline test
must have been deliberately updated for that patch; stale or failing assertions
block export. Existing test harnesses may exercise `/brightside/` prefix-safety
as well as the standalone root route.

## Identity and boundaries

`brightside-provenance.json` records the session, approved immutable commit and
baseline digest, exact source fingerprint, and file hashes. Its payload digest
covers every exported file except the two provenance JSON files (to avoid a
self-reference). `public/brightside-provenance.json` is the matching public build
identity marker; Vite copies it unchanged to `dist/brightside-provenance.json`.
No timestamp, machine path, campaign input content, owner label, or secret value
is written into provenance.

The outer export digest covers the complete sorted file inventory and identity,
including both provenance JSON files. Local verification uses unique private
staging/cache directories, then removes them. These are isolation boundaries,
not a security sandbox for arbitrary source or tests. This repository has no
automatic publish action. Any remote repository or deployment requires a
separate explicit authorization.