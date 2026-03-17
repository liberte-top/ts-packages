# TS-Packages AGENTS Guide

## Purpose
- `ts-packages/` is the TypeScript package repository for `liberte-top`.
- It exists to host runtime-neutral TS package assets and their release pipeline.
- Package distribution is an outcome, not the defining purpose of the repository.

## Current Scope
- `@liberte-top/components` is the shared Svelte component package for web consumers.
- The initial migration target is `@liberte-top/shared`.
- Add more packages only after the release and consumption flow is proven with `shared`.

## Repository Boundaries
- Keep this repo focused on TypeScript package source, versioning, and publishing.
- Do not add service-specific application code, deployment manifests, or infra logic here.
- Prefer runtime-neutral primitives over app-specific glue.
- Framework-specific shared packages are acceptable when they are durable cross-repo building blocks, not app-local UI code.

## Directory Layout
- `packages/` contains the publishable packages; each package owns its own `package.json` and source tree.
- `packages/<package-dir>/` should stay small and predictable: `package.json`, package source, and only package-local metadata that is required for publishing or development.
- `packages.registry.json` is the package registry of record for automation; workflows and docs should derive package identity from it instead of duplicating mappings.
- `docs/` is the unified package docs hub built with VitePress.
- `docs/packages/<package-key>/` is the package namespace for docs, release notes, and future package-specific pages.
- `docs/packages/<package-key>/changelogs/vX.Y.Z/` is the required stable-release changelog location.
- `.github/workflows/` contains the three release/docs workflows: beta publish, stable publish, and docs deployment.
- `scripts/release/validate-tag.mjs` is the single source of truth for tag parsing and release gating.

## Package Directory Contract
- A package's `package.json`, `packages.registry.json` entry, docs namespace, and release tag key must stay aligned.
- For `shared`, that means: package key `shared`, package name `@liberte-top/shared`, package directory `packages/shared`, and docs directory `docs/packages/shared/`.
- Renaming a package key, package directory, or docs directory is release-automation work, not a cosmetic refactor.

## Package Design Rules
- Keep public APIs small and explicit.
- Only add abstractions after they are proven in consuming apps.
- Prefer contract-first and transport-neutral patterns.
- Keep packages TS-first and avoid speculative build layers.
- Svelte packages may publish source-first exports when the consuming apps are already Svelte-native and the source contract is intentional.

## Release Principle
- `shared` is the first package to run through the full independent release chain.
- `components` is the second migration target now that `shared` release and consumption flow is stable.

## Distribution Principle
- Prefer GitHub Packages release plumbing for TS packages here.
- Keep registry-specific configuration minimal and package-local where possible.
- Do not couple package source structure to any single runtime or hosting platform.

## Scope Naming
- Use the npm scope `@liberte-top/*` for packages published from this repository.
- GitHub Packages npm publishing is owner-scoped, so package names must align with the GitHub owner namespace instead of an arbitrary npm scope.

## Release Workflow
- Keep package release automation package-aware via `<package-key>/vX.Y.Z` and `<package-key>/vX.Y.Z-beta.N` tags.
- Stable tags must match the package manifest version, be greater than prior stable tags for that package, and have a matching changelog directory at `docs/packages/<package-key>/changelogs/vX.Y.Z/`.
- Beta tags skip changelog and version-order checks, but still must map cleanly to a known package and manifest version.
- `release-beta.yml` publishes beta tags to GitHub Packages with the `beta` dist-tag.
- `release-stable.yml` publishes stable tags to GitHub Packages from commits reachable from `main`.
- `docs-pages.yml` builds and deploys the unified docs site from package tags to GitHub Pages.

## Tag Creation Rules
- Valid stable tag example: `shared/v1.2.3`
- Valid beta tag example: `shared/v1.2.3-beta.1`
- Invalid: `shared/1.2.3`, `@liberte-top/shared/v1.2.3`, `shared/v1.2.3-rc.1`
- Use the package key from `packages.registry.json`, not the npm package name, in tag names.

## Iteration Flow
- Start package work on a branch, not on `main`; `main` is PR-only and has no bypass actors.
- Keep package version changes intentional. For any release tag, the checked-in package manifest version must already equal the exact version being tagged.
- For prerelease smoke tests, bump the package to `X.Y.Z-beta.N`, push the branch, then create the matching `<package-key>/vX.Y.Z-beta.N` tag after the branch state is ready.
- For stable releases, first land the release branch through PR, including the manifest version bump and `docs/packages/<package-key>/changelogs/vX.Y.Z/`, then create the matching stable tag from the merged `main` commit.
- After changing release rules, package naming, or docs structure, rerun the local validation path: `node scripts/release/validate-tag.mjs ...`, `pnpm docs:build`, and `npm publish --dry-run` from the package directory.
- Treat GitHub Packages publishing and GitHub Pages deployment as part of the same release surface; a release is not done until both the package and docs workflows are green.
- Do not treat a repo-local code fix as complete just because one consumer builds again. For shared-package changes, the iteration only closes after the package is released and at least one real consumer has upgraded to that released version and passed its own validation.
- Prefer fixing shared-package ergonomics at the package boundary instead of normalizing one-off consumer workarounds. If a consumer needs a local shim purely to satisfy package typing or API shape, treat that as a package issue first.

## Release Checklist
- Beta: update `packages/<package-dir>/package.json` to the exact `X.Y.Z-beta.N` version, validate locally, land via PR, tag `main` with `<package-key>/vX.Y.Z-beta.N`, then confirm both `release-beta.yml` and `docs-pages.yml` succeed.
- Stable: update `packages/<package-dir>/package.json` to `X.Y.Z`, add `docs/packages/<package-key>/changelogs/vX.Y.Z/index.md`, validate locally, land via PR, tag the merged `main` commit with `<package-key>/vX.Y.Z`, then confirm both `release-stable.yml` and `docs-pages.yml` succeed.
- After first publish of a new package, or after any registry/auth change, verify a real install using the scoped GitHub Packages config.
- For package bug fixes or API ergonomics fixes, complete the full loop: reproduce in a real consumer, patch the package, release beta if needed, validate the consumer on the released package, then promote to stable only after consumer validation passes.

## Main Branch Rules
- `main` is PR-only. Direct pushes are not part of the normal flow.
- Approval count is `0`, so PRs are for safety and traceability, not for team review gating.
- Self-merge is acceptable when checks pass and the branch is ready.
- Tags are the release trigger; do not treat merge-to-main as the release event by itself.

## Consumption
- Consumers must configure `@liberte-top` to use `https://npm.pkg.github.com`.
- Consumers need an auth token with package read access for installs.
- Treat a machine-level `~/.npmrc` with registry mapping and a long-lived read token as the default local developer setup; do not commit per-repo `.npmrc` files just to consume these packages.
- Do not rely on ad hoc `gh auth token` shell substitutions for normal package installs.
- Minimal `.npmrc` shape:
  - `@liberte-top:registry=https://npm.pkg.github.com`
  - `//npm.pkg.github.com/:_authToken=<token>`

## Common Issues
- GitHub Packages npm publishing is owner-scoped. Packages from this repo must use `@liberte-top/*`, not an arbitrary npm scope.
- The published GitHub Packages package slug is the package name without the scope path segment, so `@liberte-top/shared` appears in GitHub Packages as `shared`.
- `GITHUB_TOKEN` is sufficient for workflow publishing only when the workflow repository is the package owner/repository and the job has `packages: write` permission.
- Consumers must map `@liberte-top` to `https://npm.pkg.github.com`; installs will fail or drift to the wrong registry without that scope mapping.
- `packages.registry.json` must be updated whenever a package is added or renamed; drift between registry metadata and package/docs paths breaks release automation.
- Beta manifest versions must exactly match the beta tag being published; stable manifest versions must be clean `X.Y.Z` versions before tagging.
- Stable tags fail fast when the changelog directory is missing or when the version does not increase relative to prior stable tags for that package.
- Stable changelog directories are expected to contain at least an `index.md` that explains what changed in that version.
- GitHub Pages deployments require the repository Pages source to be `workflow` and the `github-pages` environment to allow the tag pattern used by release workflows.
- GitHub Actions currently warns that some Pages actions still run on Node 20; watch for upstream action upgrades before the deprecation deadline becomes disruptive.
- Beta and stable GitHub Packages flows have already been smoke-tested successfully and should be treated as the default release path.
