# Этап 3 — Архитектура приложения и паттерны

Цель: инкапсулировать доменную модель и подготовить её к работе с внешним миром.

## Задачи

1. **Гексагональная архитектура (Ports and Adapters)** — структура директорий/пакетов; интерфейс исходящего порта (`IOrderRepository`) и входящего порта (Use Case / Application Service).
2. **Репозитории и Фабрики** — доменная фабрика создания сложного агрегата со всеми проверками.
3. **CQRS** — описать сценарий разделения Command и Query моделей; Read Model (DTO), выбор БД для Command и Query, механизм синхронизации.
4. **API Gateway / BFF (опционально)** — как Web/Mobile взаимодействуют с микросервисами; нужен ли единый Gateway или BFF.

## Артефакты (план)

- `hexagonal.md` / `src/ports/*` — порты и адаптеры.
- `repository.md` / `src/repositories/*` — интерфейсы репозиториев.
- `factory.md` / `src/factories/*` — фабрики.
- `usecase.md` / `src/usecases/*` — Use Cases.
- `cqrs.md` — дизайн CQRS, Read Model, DTO.
- `bff.md` — API Gateway / BFF.