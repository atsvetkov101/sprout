```
src/
└── modules/
    └── order/                                # Наш Bounded Context (Управление заказами)
        ├── # 1. СЛОЙ ПРЕДСТАВЛЕНИЯ (Inbound Adapters / Входящие адаптеры)
        ├── presentation/
        │   ├── http/
        │   │   ├── OrderController.ts        # Принимает HTTP POST, дергает Use Case
        │   │   └── dtos/
        │   │       └── CreateOrderReq.ts     # JSON-контракт API
        │   └── messaging/
        │       └── PaymentKafkaListener.ts   # Слушает Kafka, дергает Use Case
        │
        ├── # 2. СЛОЙ ПРИЛОЖЕНИЯ (Application Core / Порты и Use Cases)
        ├── application/
        │   ├── use-cases/
        │   │   └── CreateOrderUseCase.ts     # Оркестратор: загружает из БД, вызывает домен, сохраняет
        │   └── ports/
        │       ├── in/                       # Входящие порты (что мы предоставляем контроллерам)
        │       │   └── ICreateOrder.ts       # Интерфейс для CreateOrderUseCase
        │       └── out/                      # Исходящие порты (что нам нужно от инфраструктуры)
        │           ├── IOrderRepository.ts   # Порт для работы с базой
        │           └── IPaymentGateway.ts    # Порт для внешнего API оплаты
        │
        ├── # 3. ДОМЕННЫЙ СЛОЙ (Application Core / Чистое ядро)
        ├── domain/
        │   ├── entities/
        │   │   └── Order.ts                  # Агрегат (содержит бизнес-логику расчета и статусов)
        │   ├── value-objects/
        │   │   ├── OrderId.ts
        │   │   └── Money.ts                  # VO для денег
        │   ├── events/
        │   │   └── OrderCreatedEvent.ts      # Доменное событие
        │   └── exceptions/
        │       └── InvalidOrderStatus.ts     # Бизнес-ошибка (никаких HTTP 400 здесь!)
        │
        └── # 4. ИНФРАСТРУКТУРНЫЙ СЛОЙ (Outbound Adapters / Исходящие адаптеры)
            └── infrastructure/
                ├── persistence/              # Работа с БД
                │   ├── postgres/
                │   │   ├── OrderPostgresRepo.ts # РЕАЛИЗАЦИЯ порта IOrderRepository (SQL-запросы тут)
                │   │   └── OrderOrmEntity.ts # Класс с аннотациями TypeORM / Hibernate
                │   └── redis/
                │       └── OrderCacheAdapter.ts
                └── external-services/        # Интеграции
                    └── StripePaymentAdapter.ts # РЕАЛИЗАЦИЯ порта IPaymentGateway (HTTP-запросы)
```


