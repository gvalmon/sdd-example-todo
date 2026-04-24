---
id: SPEC-001-TODO-MODEL
title: Todo Model
status: draft
priority: P0
dependencies: []
tags: [core, data-model]
last_updated: 2026-04-23
---

# Todo Model

## Overview

Defines the Todo entity — the atom of the app. A Todo represents a single task the user wants to remember. It has a human-readable title, a completion flag, and timestamps. Every other spec in the app refers back to this one; the rules here are what other specs assume without restating.

The model is intentionally flat: no due dates, no tags, no priorities, no subtasks (see `_constitution.md` § Non-Goals). Keeping the model small keeps the rest of the app small.

## Requirements

- THE SYSTEM SHALL represent each todo as an object with fields `id`, `title`, `completed`, `created_at`, and `updated_at`.
- WHEN a todo is created, THE SYSTEM SHALL assign a stable `id` that is unique for the lifetime of the list.
- WHEN a todo is created, THE SYSTEM SHALL set `created_at` and `updated_at` to the current time.
- WHEN any field of a todo is modified, THE SYSTEM SHALL update `updated_at` to the current time.
- THE SYSTEM SHALL treat `title` as a non-empty string after trimming leading and trailing whitespace.
- IF a request would leave a todo's `title` empty after trimming, THEN THE SYSTEM SHALL reject the modification and leave the existing todo unchanged.
- THE SYSTEM SHALL treat `completed` as a boolean — there are no intermediate states ("in progress", "snoozed", etc.).
- WHEN a toggle is applied to a todo whose `completed` value already matches the requested value, THE SYSTEM SHALL treat the operation as a no-op (idempotent).
- THE SYSTEM SHALL preserve a todo's `id` across reloads and across any future storage migrations.

## Behaviors

Scenario: Creating a new todo
  Given an empty list
  When the user creates a todo with title "Buy milk"
  Then the list contains one todo with title "Buy milk" and completed = false
  And the todo has a non-empty id
  And created_at and updated_at are set to the current time and are equal

Scenario: Editing a todo's title
  Given a list with one todo titled "Buy milk"
  When the user edits its title to "Buy oat milk"
  Then the todo's title is "Buy oat milk"
  And updated_at is newer than created_at
  And the todo's id is unchanged

Scenario: Rejecting an empty title
  Given a list with one todo titled "Buy milk"
  When the user edits its title to "   " (whitespace only)
  Then the todo's title remains "Buy milk"
  And updated_at is unchanged

Scenario: Toggling completion twice returns to the original state
  Given a list with one open todo
  When the user toggles its completion
  And the user toggles it again
  Then the todo's completed value matches its original value
  And updated_at reflects the last toggle

## Data Definitions

Machine-readable contract: [`todo-model.api.v1.yaml`](./todo-model.api.v1.yaml).

Owns: the `Todo` resource shape, field types, and validation rules. Any spec that references a Todo is describing the shape defined in that file.

## Open Questions

- Should `title` have a maximum length? Current lean: no hard cap, rely on UI truncation. Revisit if Phase 3 adds bulk import.
- Should `id` be a UUID, a counter, or a random short string? Current lean: implementation detail — the sidecar says "string, stable, unique", and `plan/` chooses. Phase 1 will likely use `crypto.randomUUID()`.
