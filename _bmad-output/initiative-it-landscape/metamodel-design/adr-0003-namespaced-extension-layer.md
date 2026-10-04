# ADR-0003: Namespaced extension layer — расширения тем же механизмом, что и ядро

**Date**: 2026-10-04

**Status**: Accepted (Oleg, 2026-10-04 — ответы на OQ-1…OQ-6)

**Deciders**: Oleg (product owner), Stuart (architect)

## Context

Research (DI-5): отраслевая практика namespacing конвергентна — Backstage резервирует `backstage.io/` и требует доменных префиксов (`github.com/project-slug`) [D5]; Kubernetes namespaced labels/annotations с зарезервированными префиксами [D6]; SCIM адресует extension-схемы URN'ами, зарегистрированными в IANA [D6]. У референсов расширения (custom поля/типы/связи) делаются тем же механизмом, что и ядро: LeanIX custom fields с immutable ключами [D2], Ardoq поля/типы live [D3], Essential Classes/Slots [D4]. Отдельный «второсортный» механизм расширений (или plugin-код) — антипаттерн, удваивающий валидацию и UI.

## Problem

Как позволять организациям добавлять custom поля, типы сущностей и типы связей, не создавая коллизий с ядром и другими расширениями, не требуя кода и не строя параллельную «облегчённую» модель для custom-контента.

## Decision Drivers

- Отсутствие коллизий ключей при множестве независимых авторов расширений (insight 1: namespacing — общий знаменатель).
- Один механизм валидации/UI/API для core и custom (C3, DI-5) — иначе двойная работа.
- Расширения должны быть переносимыми/экспортируемыми (основа будущих вертикалей, DI-10).
- Audit и governance должны видеть расширения наравне с ядром.

## Considered Options

### Option 1: Глобальные custom-ключи без префиксов

**Description**: custom поля/типы создаются с любым уникальным ключом в общем пространстве имён.

**Pros**:
- Короткие ключи, минимум церемонии.

**Cons**:
- Коллизии между интеграциями/командами неизбежны (именно против этого построены k8s/Backstage/SCIM).
- Невозможно определить владельца расширения → нет сквозного audit/governance по автору.
- Экспорт «чужих» расширений для переиспользования не отделим от ядра.

### Option 2 (chosen): Namespace-реестр; расширения только в namespace владельца

**Description**: таблица `namespace(ns_key, owner, display_name, governance_mode)`; ключи расширений — `<ns>:<name>`; префиксы `core` и `sys` зарезервированы. Extension-`entity_type`/`relation_type`/`field_def` живут в тех же таблицах с `ns_key ≠ core` и теми же правилами (immutable ключ, additive-only, deprecation).

**Pros**:
- Коллизии исключены конструктивно; владелец расширения явен.
- Один валидатор, один UI, один API для всего.
- Расширение = данные → экспортируется как change set-пак (вертикали DI-10).

**Cons**:
- Многословные ключи (`finance:annual_cost`) — принятая плата экосистем (k8s, SCIM).
- Требуется UX для регистрации namespace (v1: admin-only, вручную).

### Option 3: Extension-плагины в коде (Backstage custom-kind стиль)

**Description**: расширения описываются кодом плагинов, поставляются с релизами.

**Pros**:
- Максимум возможностей (произвольная логика в процессорах).

**Cons**:
- Каждое расширение = разработка + релиз — нарушает C3/G1.
- У самого Backstage custom kind помечен как «very large impact» — аргумент против, а не за.

## Decision

**Chosen option**: Option 2.

Правила ключей: core — без префикса; расширения — строго `<ns>:<name>`; реестр namespace — данные, управляется change set'ами (операция `namespace.add` + `governance.set_mode`). Поле `is_core` в реестре отличает ядро; правила удаления для core и extension различаются (core — только deprecate; extension — hard delete с каскадным отчётом, C5).

### Positive Consequences

- Экосистема расширений масштабируется без координации имён.
- Валидация, UI, импорт/экспорт и audit работают с расширениями без спец-кейсов.
- Пак вертикали = change set + seed views — прямой путь к DI-10.

### Negative Consequences

- Лёгкий барьер для авторов расширений (регистрация namespace) — митигируется auto-предложением namespace в UI и режимом `off` (single-op auto-apply).

## Mitigations

- UX-подсказки при создании extension-элементов (автоген ключа из namespace).
- Отчёт валидации показывает все элементы по namespace — обзор спраула.

## Links

- Дизайн: `metamodel-technical-design.md` §11.6, §12 (ChangeSetOp), §24
- ADR-0001 (единый реестр), ADR-0004 (governance per namespace), ADR-0005 (change sets как носитель расширений)
- Research: DI-5, DI-10; insight 1; D6 (k8s/SCIM/Backstage паттерны)
