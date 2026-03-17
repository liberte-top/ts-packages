# TS-Packages AGENTS Guide

## Purpose
- `ts-packages/` is the TypeScript package repository for `liberte-top`.
- It exists to host runtime-neutral TS package assets and their release pipeline.
- Package distribution is an outcome, not the defining purpose of the repository.

## Current Scope
- The initial migration target is `@liberte-top/shared`.
- Add more packages only after the release and consumption flow is proven with `shared`.

## Repository Boundaries
- Keep this repo focused on TypeScript package source, versioning, and publishing.
- Do not add service-specific application code, deployment manifests, or infra logic here.
- Prefer runtime-neutral primitives over app-specific glue.

## Package Design Rules
- Keep public APIs small and explicit.
- Only add abstractions after they are proven in consuming apps.
- Prefer contract-first and transport-neutral patterns.
- Keep packages TS-first and avoid speculative build layers.

## Release Principle
- `shared` is the first package to run through the full independent release chain.
- Other packages should not move here until the `shared` migration is stable.

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
