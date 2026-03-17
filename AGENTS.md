# TS-Packages AGENTS Guide

## Purpose
- `ts-packages/` is the TypeScript package repository for `liberte-top`.
- It exists to host runtime-neutral TS package assets and their release pipeline.
- Package distribution is an outcome, not the defining purpose of the repository.

## Current Scope
- The initial migration target is `@liberte/shared`.
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
