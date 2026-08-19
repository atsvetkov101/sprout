# Project Coding Rules (Non-Obvious Only)

- **snake_case for DB/DTO fields**: use `external_id`, `assignee_id`, `created_time`, `wiki_link`, `is_service_change_available` in DTOs and DB mappers even though TS prefers camelCase. Private domain fields mirror these names (see `ticket-record.ts`).
- **Branded identifiers**: build IDs only through `XxxId.from(...)` factories defined in `Tickets.Domain/entities/identifiers.ts` (`Brand<K,T>` + `isValid()` guard). Never cast raw strings directly.
- **Domain errors in Russian**: business-rule failures throw `new Error('Смена сервиса не доступна')` (Russian, no custom error class).
- **Domain events**: new events must implement `IDomainEvent` and extend `DomainEvent`. Aggregate methods push via `addDomainEvent(...)`; consumers read with `getDomainEvents()` and reset with `clearDomainEvents()`.
- **Value Objects**: implement structural equality via an `equals(other)` method + static `isValid()` guard; validate in the constructor and throw on invalid input (see `vo/email.ts`, `vo/work-hour.ts`).
- **Aggregates are rich, no public setters**: expose business methods (e.g. `applyChangeStatusChanges`, `setService`) that enforce invariants; use `fromdata()`/`fromDb()` static factories for construction.
- **Tests colocated as `*.spec.ts`** beside the source (e.g. `vo/email.spec.ts`); `testMatch` only matches `**/*.spec.ts`.
- **Path alias `@/*` → `<rootDir>/src/*`** works in both jest (`moduleNameMapper`) and tsconfig (`paths`); use it for cross-layer imports.
- **Domain layer is framework-free**: `Tickets.Domain` must not import NestJS/Sequelize; persistence lives in `.Infrastructure`, orchestration in `.Application`.
- Run per-context scripts from inside the context dir (`Tickets/`), not root — root `package.json` only runs jest projects.