# Shared auth boundary

`@liberte-top/shared/auth` exists for reusable auth mechanics and contracts, not for service-specific auth product data.

## In scope

- auth context and snapshot types
- generic actor/auth-type/scopes contracts
- scope predicate helpers
- unauthorized redirect helpers
- auth refresh and auth-aware client mechanics

## Out of scope

- concrete scope names
- service-specific profile models
- token-management workflows
- route names, page actions, or UI view models

## Rule

If a type or helper only makes sense for `service.auth` business flows, keep it in `service.auth` until a second consumer proves it is truly shared.
