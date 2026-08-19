# Project Documentation Rules (Non-Obvious Only)

- **Repo is a DDD course project** ("Система управления разъездными сотрудниками"): strategic/tactical docs live in `work/` staged directories (`01-strategic` … `06-extra`), not in the code tree. `work/task.md` is the assignment spec.
- **`plans/` is a journal**: plan files use timestamp prefix `YYYY-MM-DDTHH-MM-SS-` (Europe/Moscow); reference/comparison material (e.g. field-analysis) goes in `work/<stage>/`, not `plans/`.
- **Documentation language is Russian** — README tables, ubiquitous-language glossary, and stage docs are all in Russian; match it in new docs.
- **`Coords/`, `Equipment/`, `Notification/`, `Users/` are scaffolding**: they define the bounded-context layout (`.Application/.Domain/.Host/.Infrastructure/.Integration`) but only `Tickets/` has implemented code.
- **Counterintuitive**: root `jest.config.js` references only `Tickets/jest.config.js`; there is no root `src/` — real source is under each context dir.
- **Diagrams in `work/01-strategic/`**: context maps and diagrams are `.drawio` files with `.png` exports (e.g. `карта_контекстов.drawio`).