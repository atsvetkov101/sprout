# Агрегаты «Заявка» (TicketRecord) и «Работа над заявкой» (TicketWork)

> Раздел «Тактическое проектирование ядра» (Этап 2). Документ описывает проектное решение по двум **коррелирующим агрегатам** Core-контекста «Заявки»: «Заявка» (`TicketRecord`) и «Работа над заявкой» (`TicketWork`), их границы, внутренние сущности и value objects, инварианты и бизнес-методы.
>
> Документ приведён в соответствие с Event Storming (`work/02-tactical/README.md`), картой контекстов и Единым языком (`work/01-strategic/context-map.md`, `work/01-strategic/ubiquitous-language.md`) и **фактическим кодом** домена в `Tickets/src/Tickets.Domain/`. Это дизайн-документ: код в `Tickets/src/` в рамках этого этапа **не изменяется**.

## 0. Исходная точка: модель из Event Storming

В соответствии с «Полезными замечаниями» и Матрицей Команд и Событий (`work/02-tactical/README.md`):

- **«Заявка» и «Работа над заявкой» имеют собственные команды и события** (отдельные агрегаты).
- Соотношение сущностей — **1 : n**: одна Заявка связана с несколькими «Работами над заявкой» (история работ по циклам «открытие → закрытие → переоткрытие»).
- Заявка может быть **переоткрыта несколько раз** — в результате создаётся несколько экземпляров «Работы над заявкой».
- **В один момент времени Заявка связана ровно с одной активной «Работой над заявкой»** (`count(activeWorks) <= 1`).
- **Изменения в объекте «Заявка» применяются к объекту «Работа над заявкой» по событию**; и **в обратную сторону** — изменения в «Работе над заявкой» применяются к «Заявке» по событию (двустороннее применение изменений, eventual consistency).
- **«Заявка» — агрегат, «Работа над заявкой» — агрегат.** Обе сущности — **самостоятельные корни агрегатов**, а не внутренние сущности друг друга.
- **«Заявка» хранит ссылку по идентификатору на «Работу над заявкой»; «Работа над заявкой» хранит ссылку по идентификатору на «Заявку»** (перекрёстные ссылки по ID).

Терминология закреплена в Едином языке (`work/01-strategic/ubiquitous-language.md`): **«Заявка»** — зарегистрированный запрос на выполнение работ; **«Работа над заявкой»** — процесс выполнения работ (результат — заполненный чек-лист). Эти понятия **не являются синонимами**.

## 1. Решение по Aggregate Roots

### 1.1. Принятое решение

Домен содержит **два коррелирующих агрегата** в отношении **1 : n**:

1. **«Заявка» (`TicketRecord`)** — корень агрегата Заявки (объект/запрос на обслуживание).
2. **«Работа над заявкой» (`TicketWork`)** — **самостоятельный корень агрегата** Работы (процесс исполнения). Не является внутренней сущностью Заявки.

Фактические агрегаты расположены в `Tickets/src/Tickets.Domain/entities/` (`ticket-record.ts`, `ticket-work.ts`).

```
АГРЕГАТ «Заявка» — корень                АГРЕГАТ «Работа над заявкой» — корень
TicketRecord (1)  ◄── 1 : n ──►  TicketWork (n)
• id: TicketRecordId                    • id: TicketWorkId
• external_id: string                   • status: TicketWorkStatus
• assignee_id: number                   • plannedOrder: number
• status: TicketRecordStatus            • start_date: Date
• service: string                       • service: string
• created_by, created_time, deadline    • user_events: UserEvent[]
• act_type, wiki_link                   • coords_list: Coords[]
• is_service_change_available: boolean  • act_id?, act_type?, deadline?, wiki_link?
```

### 1.2. Обоснование

1. **Два независимых жизненных цикла.** Заявка (объект) и Работа над заявкой (процесс) — самостоятельные агрегаты: у каждой своя статусная модель (`TicketRecordStatus` / `TicketWorkStatus`), свои команды и события (см. Матрицу Команд и Событий в README).
2. **1 : n, а не 1 : 1.** Одна Заявка связана со многими «Работами над заявкой» (по одному экземпляру на цикл). Заявка может быть переоткрыта несколько раз — каждый раз создаётся новый экземпляр `TicketWork`.
3. **Одна активная работа.** В любой момент времени Заявка связана ровно с одной активной «Работой над заявкой»; остальные экземпляры — завершённые/архивные.
4. **Двусторонняя синхронизация по событиям.** Изменения между агрегатами применяются по событиям в обе стороны (eventual consistency, а не единая транзакционная граница). Это прямое следствие «Полезных замечаний» README.
5. **Единый язык.** «Заявка» и «Работа над заявкой» — самостоятельные термины контекста «Заявки»; смешивать их как синонимы запрещено.
6. **Существующий код.** В `Tickets/src/Tickets.Domain/entities/` `TicketRecord` и `TicketWork` — две **параллельные сущности без явного корня, без моделирования связи 1 : n и без перекрёстных ссылок**. Проектное решение вводит отношение 1 : n с перекрёстными ссылками по идентификаторам как целевое состояние, фиксируя разрывы в разделе 8.

### 1.3. Почему `TicketWork` является отдельным агрегатом

- Матрица Команд и Событий (`work/02-tactical/README.md`) указывает **`TicketWork` как агрегат** (например, для команд `ChangeTicketServiceByDoer`, `ClosingTicketByDoer`).
- У `TicketWork` собственная статусная модель (`TicketWorkStatus`), собственные команды/события и собственная согласованность (метод `applyChangeStatusChanges`).
- «Работа над заявкой» **имеет ссылку по идентификатору на Заявку** и вправе применять изменения к Заявке по событию — признак отдельного агрегата, а не внутренней сущности.

### 1.4. Что НЕ входит в агрегаты (внешние ссылки / смежные контексты)

В соответствии с картой контекстов (`work/01-strategic/context-map.md`) смежные понятия **отражаются ссылками/событиями**, а не владением:

| Внешнее понятие | Представление в агрегате | Владелец (контекст) |
| :--- | :--- | :--- |
| Объект обслуживания | `service_object` в данных создания `TicketRecord` (адрес, координаты, телефон) | «Координаты» |
| Оборудование / Расходные материалы | ссылки/события чек-листа | «Склады и Оборудование» (upstream) |
| Координаты исполнителя | `Coords[]` (`coords_list`) внутри `TicketWork` как **значения-копии** (лог трекинга) | «Координаты» (downstream) |
| Документы (акт, подписи) | `act_id`/`act_type` в `TicketWork`; события закрытия | «Отчетные документы» (downstream) |
| Уведомления | порождаются по событиям агрегатов | «Уведомления» (downstream) |

**Важно по коду:** в текущей реализации `TicketRecord` хранит `service_object` как **встроенный набор данных** (в `vo/ticket-record-create-data.ts`: `address`, `name`, `search_code`, `coords`, `phone_number`), а не ссылку `ServiceObjectId`. Согласование с картой контекстов (объект как внешняя ссылка) — целевое состояние, разрыв отмечен в разделе 8.

## 2. Границы агрегатов (по фактическому коду)

**Агрегат «Заявка» (`TicketRecord`)**, `entities/ticket-record.ts`:
- Корень — `TicketRecord`.
- Состояние: `id: TicketRecordId`, `external_id`, `assignee_id`, `status: TicketRecordStatus`, `service`, `created_by`, `created_time`, `deadline`, `act_type`, `wiki_link`, `is_service_change_available`.
- События собираются в корне: `addDomainEvent` / `getDomainEvents` / `clearDomainEvents`.
- Внутренних коллекций Value Objects (`Coords[]`, `UserEvent[]`) **нет** — они принадлежат `TicketWork`.
- **Целевая ссылка** на активную `TicketWork` по идентификатору (`currentWorkId: TicketWorkId`) — из README; в коде **отсутствует** (раздел 8).

**Агрегат «Работа над заявкой» (`TicketWork`)**, `entities/ticket-work.ts`:
- Корень — `TicketWork`.
- Состояние: `id: TicketWorkId`, `status: TicketWorkStatus`, `plannedOrder`, `start_date`, `service`, `user_events: UserEvent[]`, `coords_list: Coords[]`, `act_id?`, `act_type?`, `deadline?`, `wiki_link?`, `checklist_id?` (ссылка на сущность `CheckList`).
- Внутренние коллекции Value Objects: `coords_list: Coords[]`, `user_events: UserEvent[]` (`UserEvent` — из `vo/ticket-work-create-data.ts`).
- События собираются в корне: `addDomainEvent` / `getDomainEvents` / `clearDomainEvents`.
- **Целевая ссылка** на Заявку по идентификатору (`ticketRecordId: TicketRecordId`) — из README; в коде **отсутствует** (раздел 8).

**Связь между агрегатами:** перекрёстные ссылки по идентификаторам; согласованность поддерживается **по событиям** (двусторонне), а не единой транзакционной границей.

### 2.1. Идентификаторы (Value Objects-фабрики)

Идентификаторы определены в `entities/identifiers.ts` через брендовый тип `Brand<K, T>` с фабрикой `from()` и type guard `isValid()`:

- `TicketRecordId` — `TicketRecordId.from(...)`, `TicketRecordId.isValid(...)`.
- `TicketWorkId` — `TicketWorkId.from(...)`, `TicketWorkId.isValid(...)`.
- `ServiceObjectId` — `ServiceObjectId.from(...)`, `ServiceObjectId.isValid(...)`.

В агрегатах ID создаются только через фабрики: `this.id = TicketRecordId.from(data.id)` (в `ticket-record.ts`) и `this.id = TicketWorkId.from(data.id)` (в `ticket-work.ts`).

### 2.2. Статусы (закрытые множества)

- `TicketRecordStatus` (`vo/ticket-record-status.ts`): `New`, `Assigned`, `InProgress`, `Done`, `Canceled`, `Closed`.
- `TicketWorkStatus` (`vo/ticket-work-status.ts`): `Pending`, `InProgress`, `Done`, `Canceled`, `Closed`.

## 3. Инварианты агрегатов

### 3.1. Инварианты «Заявки» (`TicketRecord`)

Реализованные в `ticket-record.ts`:

1. **Идентичность корня уникальна** — `TicketRecordId` не изменяется в течение жизни агрегата; создаётся через `TicketRecordId.from(...)`.
2. **Статус заявки** принадлежит закрытому множеству `TicketRecordStatus`; перевод контролируется `statusChangeAllowed(newStatus)`.
3. **Нельзя перевести заявку в тот же статус** — `statusChangeAllowed` возвращает `false` при `this.status === newStatus`.
4. **Из статуса `Done` нет переходов** — `statusChangeAllowed` возвращает `false` для `this.status === Done`. (В README переоткрытие извне — исключение, реализуемое на уровне Use Case, см. раздел 5.)
5. **Смена сервиса** допустима только если `is_service_change_available === true` и на **отличающийся** сервис — `setService(newService)`; иначе бросает ошибку «Смена сервиса не доступна» / «Для изменения сервиса новое значение должно отличаться от текущего» (сообщения на русском).
6. **Закрытие** определяется `isClosing(newStatus)` для статусов `Closed`/`Canceled` («Закрытие заявки» в Едином языке).
7. **Валидность времени** — `created_time` и `deadline` проверяются на валидность ISO-даты при создании.
8. **События** собираются в корне и очищаются после публикации (`clearDomainEvents`).

### 3.2. Инварианты «Работы над заявкой» (`TicketWork`)

Реализованные в `ticket-work.ts`:

1. **Идентичность корня уникальна** — `TicketWorkId` не изменяется; создаётся через `TicketWorkId.from(...)`.
2. **Статус работы** принадлежит закрытому множеству `TicketWorkStatus`; перевод контролируется `statusChangeAllowed(newStatus)`; нельзя перевести в тот же статус; из `Done` нет переходов.
3. **Смена сервиса** допустима только на **отличающийся** сервис — `setService(newService)` (проверка «новое значение должно отличаться от текущего»).
4. **Закрытие** определяется `isClosing(newStatus)` для статусов `Closed`/`Canceled`.
5. **События** собираются в корне и очищаются после публикации (`clearDomainEvents`).

### 3.3. Инварианты связи 1 : n (целевое состояние из README)

1. **Единственная активная работа.** В любой момент времени у Заявки существует не более одной активной «Работы над заявкой»: `count(activeWorks) <= 1`. Создание нового экземпляра Работы допускается только при отсутствии активной работы.
2. **Переоткрытие только из финального статуса.** `ReopeningTicketExternally` применимо только когда Заявка в финальном статусе; при этом **создаётся новый экземпляр** `TicketWork`.
3. **Двустороннее применение изменений.** Изменения в Заявке применяются к активной Работе **по событию**; изменения в Работе применяются к Заявке **по событию**.

> Инварианты 3.3 относятся к **целевому** проектированию связи 1 : n по README; в текущем коде они не реализованы (нет перекрёстных ссылок) — см. раздел 8.

## 4. Команды и события (по Матрице Команд и Событий)

Матрица из `work/02-tactical/README.md`:

| Команда | Событие (матрица) | Актор | Агрегат (target) | Политика | Инвариант |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ChangeTicketAssignee` | `TicketAssigneeСhanged` | Менеджер/координатор | Работа над заявкой (`TicketWork`) | Инженерам рассылаются уведомления | Статус Заявки позволяет применить изменение |
| `ChangeTicketServiceExternally` | `TicketServiceExtСhanged` | Внешняя система | Работа над заявкой (`TicketWork`) | Инженеру отправляется уведомление | Сервис установлен для Заявки; статус Заявки позволяет применить изменение |
| `ChangeTicketServiceByDoer` | `TicketServiceByEngineerСhanged` | Исполнитель | Заявка (`TicketRecord`) | Во внешнюю систему отправляется уведомление | Сервис установлен для Работы над заявкой; статус Работы позволяет применить изменение |
| `ClosingTicketByDoer` | `TicketByDoerClosed` | Исполнитель | Заявка (`TicketRecord`) | — | Статус Работы позволяет применить изменение; сохраняем чек-лист, если закрываем как выполненная |
| `ClosingTicketExternally` | `TicketExternallyClosed` | Внешняя система | Работа над заявкой (`TicketWork`) | — | Статус Заявки позволяет применить изменение |
| `ReopeningTicketExternally` | `TicketExternallyReopened` | Внешняя система | Работа над заявкой (`TicketWork`) | Новая Работа появляется в «Активных заявках» у Исполнителя; Исполнителю уведомление | Статус Заявки позволяет применить изменение; создаётся новый экземпляр Работы |

> **Двустороннее применение.** Целевой агрегат команды указан в столбце «Агрегат (target)»: команды, направленные на `TicketWork`, в итоге влияют и на `TicketRecord`, и наоборот — изменения применяются по событию в обе стороны.

## 5. Бизнес-методы агрегатов (по фактическому коду)

> Бизнес-методы защищают инварианты из раздела 3. Прямые сеттеры наружу **не выставляются** — состояние изменяется только через методы агрегата. Изменения, затрагивающие смежный агрегат, передаются **по событию** (целевое состояние README).

### 5.1. `TicketRecord` (`entities/ticket-record.ts`)

- **`statusChangeAllowed(newStatus): boolean`** — допустим ли перевод в `newStatus` (не тот же статус; не из `Done`). Инвариант 3.1 (2–4).
- **`isClosing(newStatus): boolean`** — является ли `newStatus` закрытием (`Closed`/`Canceled`).
- **`setService(newService: string): void`** — смена сервиса Заявки: проверяет `is_service_change_available` и отличие от текущего сервиса; при успехе фиксирует `service` и порождает событие. Инвариант 3.1 (5).
- **`applyChangeStatusChanges(newStatus, newService?): void`** — применяет перевод статуса (через `statusChangeAllowed`) и, при передаче `newService`, смену сервиса. Порождает `TicketRecordStatusInternallyChangedEvent`.

Псевдокод (целевое переоткрытие из README):

```
reopenExternally(createData):
  assert isFinal(this.status)              // переоткрытие только из финального статуса
  assert not hasActiveWork                 // инвариант «единственная активная работа»
  const newWork = TicketWork.create(createData)   // НОВЫЙ экземпляр
  this.currentWorkId = newWork.id          // ссылка по идентификатору на новую работу
  this.status = Reopened                   // перевод из финального
  addEvent(TicketExternallyReopenedEvent(ticketId, newWork.id))
```

### 5.2. `TicketWork` (`entities/ticket-work.ts`)

- **`statusChangeAllowed(newStatus): boolean`** — допустим ли перевод (не тот же статус; не из `Done`).
- **`isClosing(newStatus): boolean`** — является ли `newStatus` закрытием (`Closed`/`Canceled`).
- **`setService(newService: string): void`** — смена сервиса Работы: проверяет отличие от текущего сервиса.
- **`applyChangeStatusChanges(newData: TicketWorkUpdateData): void`** — применяет перевод статуса (через `statusChangeAllowed`) и, при передаче `service` в `newData`, смену сервиса. Порождает `TicketWorkStatusChangedEvent`.

Псевдокод (целевое закрытие исполнителем из README):

```
closeByEngineer(result):
  assert not this.currentWork().isClosed      // статус активной работы
  this.currentWork().checklist = result       // сохранение чек-листа как выполненной
  this.status = Done                          // перевод корня в финальный статус
  this.currentWork().status = Done
  addEvent(TicketByDoerClosedEvent(ticketId))
```

> В фактическом коде поле «чек-лист» отсутствует (есть только `act_id`/`act_type`); проверка инварианта «сохраняем чек-лист» — целевое состояние, разрыв в разделе 8.

## 6. Доменные события

### 6.1. Фактически реализованные события (`domain-events/`)

Все события наследуют `DomainEvent` (реализует `IDomainEvent`: `EventId`, `OccurredAt`) и создаются с `eventId`/`occurredAt`:

| Событие | Файл | Данные |
| :--- | :--- | :--- |
| `TicketRecordStatusInternallyChangedEvent` | `ticket-record-status-internally-changed-event.ts` | `ticketId`, `newStatus` |
| `TicketRecordStatusExternallyChangedEvent` | `ticket-record-status-externally-changed-event.ts` | `ticketId`, `newStatus` |
| `TicketWorkStatusChangedEvent` | `ticket-work-status-changed-event.ts` | `ticketId`, `newStatus` |
| `TicketRecordAssigneeChangedEvent` | `ticket-record-assignee-changed-event.ts` | `ticketId`, `newAssignee` |

Сбор событий — через `addDomainEvent`, чтение — `getDomainEvents()`, очистка — `clearDomainEvents()`.

### 6.2. Соответствие событий Матрице Команд и Событий

| Команда (README) | Событие (README) | Статус в коде |
| :--- | :--- | :--- |
| `ChangeTicketAssignee` | `TicketAssigneeСhanged` | `TicketRecordAssigneeChangedEvent` — реализован |
| перевод статуса изнутри | (внутренний) | `TicketRecordStatusInternallyChangedEvent` — реализован |
| перевод статуса извне | (внешний) | `TicketRecordStatusExternallyChangedEvent` — реализован |
| перевод статуса работы | (статус работы) | `TicketWorkStatusChangedEvent` — реализован |
| `ChangeTicketServiceExternally` / `ChangeTicketServiceByDoer` | `TicketServiceExtСhanged` / `TicketServiceByEngineerСhanged` | **не реализованы**; в коде — dangling-ссылка `TicketServiceChangedEvent` (раздел 7) |
| `ClosingTicketByDoer` | `TicketByDoerClosed` | не реализован |
| `ClosingTicketExternally` | `TicketExternallyClosed` | не реализован |
| `ReopeningTicketExternally` | `TicketExternallyReopened` | не реализован |

## 7. Известные дефекты в коде

> Статус дефектов обновлён `2026-08-20` после выполнения шагов 1–4 плана
> [`plans/2026-08-20T10-08-15-tickets-next-step.md`](../plans/2026-08-20T10-08-15-tickets-next-step.md).

1. **Dangling-ссылка `TicketServiceChangedEvent`** — ✅ **устранена**: создан класс
   `TicketServiceChangedEvent extends DomainEvent` в `domain-events/ticket-service-changed-event.ts`, добавлен импорт
   в `TicketRecord.setService()` (см. [`ticket-service-changed-event.ts`](../Tickets/src/Tickets.Domain/domain-events/ticket-service-changed-event.ts:10),
   [`ticket-record.ts`](../Tickets/src/Tickets.Domain/entities/ticket-record.ts:200)). Проектное направление на отдельные
   `TicketServiceExtСhangedEvent` / `TicketServiceByEngineerСhangedEvent` по Матрице сохранено как последующая доработка.
2. **`TicketRecord.setService` бросает ошибку при одинаковом сервисе** — это согласовано с инвариантом «смена только на отличающийся сервис» (сообщение на русском). Логика остаётся на уровне инварианта агрегата.
3. **Моделирование связи 1 : n** — ✅ **устранено**: `TicketRecord` держит коллекцию `works: TicketWork[]`, метод `addWork()`
   и понятие активной работы `currentWork()` с инвариантом «одна активная работа»; добавлены перекрёстные ссылки по ID
   `current_work_id` (в `TicketRecord`) и `ticket_record_id` (в `TicketWork`)
   (см. [`ticket-record.ts`](../Tickets/src/Tickets.Domain/entities/ticket-record.ts:24),
   [`ticket-record.ts`](../Tickets/src/Tickets.Domain/entities/ticket-record.ts:153),
   [`ticket-work.ts`](../Tickets/src/Tickets.Domain/entities/ticket-work.ts:23)).
4. **История работ, переоткрытие и двустороннее применение изменений по событиям** — 🟡 **частично**: коллекция работ и понятие
   активной работы реализованы; команда переоткрытия (создание нового экземпляра Работы) и двустороннее применение изменений
   между агрегатами по событиям — целевое состояние (направления последующей доработки).
5. **`service_object` как встроенные данные** — ✅ **устранено**: `TicketRecordCreateData.service_object` заменён на ссылку
   `service_object_id`; `TicketRecord` хранит/отдаёт `ServiceObjectId`; добавлена публичная фабрика `ServiceObject.from()`
   для восстановления по ID; `fromDb()` синхронизирован
   (см. [`ticket-record-create-data.ts`](../Tickets/src/Tickets.Domain/vo/ticket-record-create-data.ts:31),
   [`service-object.ts`](../Tickets/src/Tickets.Domain/entities/service-object.ts:31),
   [`ticket-record.ts`](../Tickets/src/Tickets.Domain/entities/ticket-record.ts:61)).
6. **«Чек-лист»** — ✅ **устранено**: добавлена сущность `CheckList` (`entities/check-list.ts`: элементы `items: ChecklistItem[]`, методы
   `addItem`/`completeItem`/`isCompleted`, фабрики `create`/`from`) и ссылка по ID `checklist_id` из `TicketWork`
   (`entities/ticket-work.ts:24`, геттер/сеттер `getChecklistId`/`setChecklistId`, поле `checklistId` в `TicketWorkCreateData`).
   Добавлены VО `ChecklistItem`/`ChecklistCreateData` и идентификатор `ChecklistId`. Покрыто юнит-тестами
   (`entities/check-list.spec.ts`, расширен `entities/ticket-work.spec.ts`).

## 8. Итоговое согласование с README и кодом

| Аспект | README (цель) | Фактический код | Статус |
| :--- | :--- | :--- | :--- |
| Количество агрегатов | два коррелирующих агрегата (Заявка, Работа) | `TicketRecord`, `TicketWork` | ✅ согласовано |
| Отношение | 1 : n | нет моделирования связи | ⚠️ целевое |
| Перекрёстные ссылки по ID | `TicketRecord` ↔ `TicketWork` | отсутствуют | ⚠️ целевое |
| Применение изменений по событиям | двустороннее | только сбор событий в корне | ⚠️ целевое |
| Идентификаторы | — | `Brand<K,T>` + `XxxId.from()` / `XxxId.isValid()` | ✅ согласовано |
| Статусы | — | `TicketRecordStatus`, `TicketWorkStatus` | ✅ согласовано |
| События | матрица README | 4 события + dangling `TicketServiceChangedEvent` | ⚠️ частично |

Итог: терминология, границы агрегатов, статусные модели, идентификаторы и механика сбора доменных событий приведены в соответствие с `work/02-tactical/README.md` и фактическим кодом `Tickets/src/Tickets.Domain/`. Разрывы между целевым проектированием связи 1 : n и текущей реализацией зафиксированы в разделах 7–8 как известные дефекты и направления доработки.