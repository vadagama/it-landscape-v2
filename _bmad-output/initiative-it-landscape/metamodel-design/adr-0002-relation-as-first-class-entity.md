# ADR-0002: Связь — first-class направленная типизированная сущность

**Date**: 2026-10-04

**Status**: Accepted (Oleg, 2026-10-04 — ответы на OQ-1…OQ-6)

**Deciders**: Oleg (product owner), Stuart (architect)

## Context

Research (DI-2, DI-3): три из четырёх референсов хранят атрибуты на связях — LeanIX (стоимость приложения на связи Application↔IT Component, immutable multiplicity) [D2], Ardoq (поля на references) [D3], Essential (связи реифицированы в классы, `ACTOR_TO_ROLE_RELATION (relationship class)`) [D4]; Backstage компенсирует отсутствие аннотациями на узлах [D5]. Реляционная модель «сущность + свойства» не выражает атрибуты на ребре. Ключевая ценность продукта — impact-анализ по графу связей.

## Problem

Как моделировать связи между сущностями: как свойства (FK/adjacency), как отдельную сущность-ребро или как реифицированные узлы — с учётом требований: атрибуты на связи, типизация и валидация троек, verb-лейблы на оба направления, multiplicity, обход графа.

## Decision Drivers

- Атрибуты на связи (стоимость, среда, CRUD-квалификатор) — подтверждённый всеми паттерн, без которого падает половина use-case'ов аналитика.
- Направление и семантика: `A depends-on B` ≠ `B depends-on A`; verb-лейблы на оба направления (LeanIX-паттерн).
- Multiplicity на типе связи, immutable после создания (DI-3).
- Impact-анализ — обход графа должен быть дешёвым.
- «Small»: без оверинжиниринга.

## Considered Options

### Option 1: Связь как свойство (FK / adjacency-колонки)

**Description**: `application.hosts_itc_id`, таблицы связующих колонок, без отдельной сущности связи.

**Pros**:
- Максимально просто; связи «бесплатны» в запросах по сущности.

**Cons**:
- Нет атрибутов на связи — стоимость/среду выразить негде.
- Нет каталога типов связей → нет валидации троек, нет verb-лейблов, нет governance (DI-6 невозможен).
- Каждый новый тип связи = изменение схемы = релиз (нарушает C3).
- Полиморфные концы (owns → 8 типов) выражаются колонками-заглушками.

### Option 2 (chosen): Отдельная таблица-ребро: `relation(oid, type_key, source_oid, target_oid, attributes)`

**Description**: связь — строка с собственным OID и JSONB-атрибутами; тип связи — запись реестра (`relation_type`: key, source_types[], target_types[], multiplicity, verb_forward/reverse, поля).

**Pros**:
- Атрибуты на связи, собственная идентичность (audit, ссылки, API `/v1/relations/{oid}`).
- Типизация троек + multiplicity + governance работают из коробки (DI-2, DI-3, DI-6).
- Обход графа — один запрос по `relation` с индексами source/target.
- Конвергентно с 3 из 4 референсов (insight 4).

**Cons**:
- Каждая связь — отдельная строка и API-ресурс: объём и лишний hop в UI-сценариях.
- Multiplicity требует write-time проверок (n:1 → unique(source)).

### Option 3: Реификация в узлы (Essential-стиль: связь = тоже entity)

**Description**: связь — полноценная сущность того же рода, что и узлы; возможны связи на связи.

**Pros**:
- Максимум выразительности: атрибуты, связи на связи, единый API.

**Cons**:
- Удвоение модели и UI-сложности; для «Small» оверинжиниринг.
- Ни один из практичных сценариев v1 не требует связей на связях.
- Essential платит за это fork'ом Protege — не наш путь.

## Decision

**Chosen option**: Option 2.

`relation_type` в реестре несёт: направленность, допустимые `source_types[]`/`target_types[]`, `multiplicity` (immutable после создания; смена = deprecate типа + новый тип, DI-3), `verb_forward`/`verb_reverse`, собственные `field_def`. Универсальный parent-child — системная связь на `parent_oid`, вне пользовательского каталога (DI-9). Уникальность `(type_key, source_oid, target_oid)` на таблице связей.

### Positive Consequences

- Полноценный impact-анализ и типизированный каталог связей с первого релиза.
- Governance-лестница работает на уровне троек (ADR-0004).
- Связи участвуют в audit и импорте/экспорте как равноправные объекты.

### Negative Consequences

- Смена multiplicity дорога by design (deprecate + новый тип + миграция) — осознанный обмен стабильности на гибкость.
- UI требует отдельного редактора связей (карточка связи с атрибутами) — заложено в S5.

## Mitigations

- Seed-каталог из 18 типов связей покрывает стартовые сценарии; расширение — change set'ом.
- Write-time проверка multiplicity + unique-индексы на стороне «1».

## Links

- Дизайн: `metamodel-technical-design.md` §11.2, §11.5, §24
- ADR-0004 (governance на тройках), ADR-0005 (эволюция каталога связей)
- Research: DI-2, DI-3, DI-9; insight 3, 4; D2, D3, D4, D5
