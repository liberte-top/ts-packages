# ts-packages

TypeScript package repository for `liberte-top`.

Current scope:

- `@liberte-top/components`
- `@liberte-top/shared`

Release tags:

- stable: `<package-key>/vX.Y.Z`
- beta: `<package-key>/vX.Y.Z-beta` or `<package-key>/vX.Y.Z-beta.N`

Documentation lives under `docs/packages/<package-key>/` and stable releases require
`docs/packages/<package-key>/changelogs/vX.Y.Z/` to exist.

Distribution:

- GitHub Packages npm registry publishing
- `@liberte-top/*` is the dedicated scope because GitHub Packages requires the owner namespace

Install:

```ini
@liberte-top:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```
