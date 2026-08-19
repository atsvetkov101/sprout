# Этап 4 — Асинхронность, базы данных и интеграция

Цель: связать контексты между собой, обеспечив надёжность и согласованность данных.

## Задачи

1. **Domain & Integration Events** — событие из агрегата; трансформация в Integration Event для брокера (Kafka/RabbitMQ); структура JSON payload.
2. **Transactional Outbox** — решение проблемы Dual Write; инструмент чтения Outbox (Debezium/CDC, Kafka Connect, Polling Publisher).
3. **Saga** — шаги саги для процесса минимум из 3 контекстов; компенсирующая транзакция.
4. **Проектирование хранилища** — выбор СУБД; DDL/JSON для сохранения всего агрегата.
5. **Топология брокера** — RabbitMQ: Exchanges/Routing Keys/Queues; Kafka: Topics, партиции, Partition Key, Consumer Groups.

## Артефакты (план)

- `events.md` / `src/domain-events/*`, `src/integration-events/*` — события и payload.
- `outbox.md` — алгоритм Transactional Outbox.
- `saga.md` — шаги саги и компенсации.
- `storage.md` / `ddl/*.sql` — DDL-скрипты.
- `broker.md` — топология брокера.

См. также существующие доменные события в `Tickets/src/Tickets.Domain/domain-events/`.