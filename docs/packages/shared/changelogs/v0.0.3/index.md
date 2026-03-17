# v0.0.3

Tighten `ensure` export ergonomics so assertion-style consumers do not need local type aliases just to satisfy TypeScript.

## Notes

- export `ensure` as a direct assertion function with merged helpers
- keep `ensure.nonNull` and `ensure.nonEmpty` behavior unchanged
