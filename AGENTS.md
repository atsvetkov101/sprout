# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project rules (mandatory, from `.roo/rules/`)
- **Write in Russian.** Respond concisely and to the point.
- **Plan files** must be saved to `plans/` with a timestamp prefix `YYYY-MM-DDTHH-MM-SS-` (Europe/Moscow, UTC+3), e.g. `plans/2026-08-03T22-53-44-design.md`. Reference/comparison materials go in `work/<stage>/`, NOT in `plans/`.
- **Work directory**: all stage work lives under `work/` (`01-strategic` … `06-extra`). Task spec is `work/task.md`.
- **Never edit** files in `.codeassistantignore` (`.env`, `node_modules`, docker data, etc.).
- Communicate in Russian in UI/doc content too (README tables, domain comments are Russian).

## Repo layout
- **Monorepo of bounded contexts**, each self-contained with its own `package.json`/`jest.config.js`/`yarn.lock`: `Tickets/`, `Coords/`, `Equipment/`, `Notification/`, `Users/`.
- Each context follows **DDD hexagonal layout**: `<Context>.Application`, `.Domain`, `.Host`, `.Infrastructure`, `.Integration` directories under `src/`.
- **Root** `package.json` only orchestrates jest projects; all real scripts live in context `package.json` (e.g. `Tickets/package.json`).
- Main implemented context is `Tickets/` (NestJS + CQRS + Sequelize + PostgreSQL + RabbitMQ via `amqplib`).

## Commands
- **Root tests**: `yarn test` (runs jest projects from root `jest.config.js`).
- **Tickets context** (run from `Tickets/`): `yarn test`, `yarn test:watch`, `yarn test:cov`, `yarn build` (rimraf + nest build), `yarn lint`, `yarn format`.
- **Path alias**: `@/*` → `<rootDir>/src/*` (configured in both `Tickets/jest.config.js` `moduleNameMapper` and `Tickets/tsconfig.json` `paths`).

## Code conventions (discovered, non-obvious)
- **Test files**: `*.spec.ts`, colocated next to the source file (e.g. `vo/email.spec.ts`, `vo/work-hour.spec.ts`). `testMatch` is only `**/*.spec.ts`.
- **Identifiers**: brand types via `Brand<K,T>` with a `from()` factory + `isValid()` type guard (see `Tickets.Domain/entities/identifiers.ts`). Always build IDs through `XxxId.from(...)`.
- **DB/DTO fields use `snake_case`** (e.g. `external_id`, `assignee_id`, `created_time`, `wiki_link`, `is_service_change_available`) even though TS/JS conventions prefer camelCase.
- **Domain error messages are in Russian** (`throw new Error('Смена сервиса не доступна')`).
- **Domain events**: aggregates collect events via `addDomainEvent(event)` / `getDomainEvents()` / `clearDomainEvents()`. New events must implement `IDomainEvent` and extend `DomainEvent`.

## Gotchas
- Aggregate entities live in `Tickets/src/Tickets.Domain/entities/`, **not** in a root `src/entities` location; don't create a parallel structure.
- `Tickets/src/Tickets.Domain/entities/ticket-record.ts` references `TicketServiceChangedEvent` (line ~162) which has **no matching import/definition** in the domain — a pre-existing dangling reference; resolve it if you touch that method.
- Work/plan documentation is authored in Russian; match that language in new docs.