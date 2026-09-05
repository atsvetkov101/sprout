# AGENTS.md

Этот файл содержит рекомендации для агентов при работе с кодом в этом репозитории.

## Правила проекта (обязательные, из `.roo/rules/`)
- **Пишите по-русски** — и в ответах, и в содержимом UI/документации (таблицы в README, комментарии в домене). Отвечайте кратко и по существу.
- **Файлы планов** должны сохраняться в `plans/` с префиксом-меткой времени `YYYY-MM-DDTHH-MM-SS-` (Europe/Moscow, UTC+3), например `plans/2026-08-03T22-53-44-design.md`. Справочные/сравнительные материалы размещаются в `work/<stage>/`, а НЕ в `plans/`.
- **Рабочий каталог**: все материалы этапов лежат в `work/` (`01-strategic` … `06-extra`). Техническое задание — `work/task.md`.
- **Никогда не редактируйте** файлы из `.codeassistantignore` (`.env`, `node_modules`, данные docker и т. п.).

## Структура репозитория
- **Монорепозиторий ограниченных контекстов**: `Tickets/`, `Coords/`, `Equipment/`, `Notification/`, `Users/`.
- Полностью реализован и самодостаточен только **`Tickets/`** — он имеет собственные `package.json`/`jest.config.js`/`yarn.lock`. Остальные контексты (`Coords/`, `Equipment/`, `Notification/`, `Users/`) пока являются пустыми заготовками: внутри `src/` только каталоги `<Context>.*` без кода и конфигурации.
- Каждый контекст следует **DDD-гексагональной структуре**: каталоги `<Context>.Application`, `.Domain`, `.Host`, `.Infrastructure`, `.Integration` внутри `src/`.
- **Корневой** `package.json` оркестрирует jest-проекты (`test`, `test:watch`, `test:cov`); реальные скрипты приложения живут в `package.json` контекста (`Tickets/package.json`).
- Контекст `Tickets/`: NestJS + CQRS + Sequelize + PostgreSQL + RabbitMQ через `amqplib`.

## Команды
- **Тесты из корня**: `yarn test` (запускает jest-проекты из корневого `jest.config.js`; сейчас там подключён только проект `Tickets/`).
- **Контекст Tickets** (запускать из `Tickets/`): `yarn test`, `yarn test:watch`, `yarn test:cov`, `yarn build` (rimraf + nest build), `yarn lint`, `yarn format`.
- **Алиас путей**: `@/*` → `<rootDir>/src/*` (настроен и в `Tickets/jest.config.js` (`moduleNameMapper`), и в `Tickets/tsconfig.json` (`paths`)).

## Соглашения о коде (выявленные, неочевидные)
- **Тестовые файлы**: `*.spec.ts`, располагаются рядом с исходным файлом (например, `vo/email.spec.ts`, `vo/work-hour.spec.ts`). В `testMatch` только `**/*.spec.ts`.
- **Идентификаторы**: brand-типы через `Brand<K,T>` с фабрикой `from()` + type-guard `isValid()` (см. `Tickets.Domain/entities/identifiers.ts`). Всегда создавайте ID через `XxxId.from(...)`.
- **Поля БД/DTO используют `snake_case`** (например, `external_id`, `assignee_id`, `created_time`, `wiki_link`, `is_service_change_available`), даже если соглашения TS/JS предпочитают camelCase.
- **Сообщения об ошибках домена на русском** (`throw new Error('Смена сервиса не доступна')`).
- **События домена**: агрегаты собирают события через `addDomainEvent(event)` / `getDomainEvents()` / `clearDomainEvents()`. Новые события должны реализовывать `IDomainEvent` и наследовать `DomainEvent`.

## Подводные камни
- Сущности агрегатов живут только в `Tickets/src/Tickets.Domain/entities/`.