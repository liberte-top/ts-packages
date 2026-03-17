# v0.0.4

Expand the shared auth surface with richer generic actor/context types and auth snapshot lifecycle helpers.

## Notes

- add abstract actor/context types with principal type and email support
- add reset and auth-failure helpers for reusable auth snapshot handling
- keep the package business-agnostic and free of service-specific scope names
