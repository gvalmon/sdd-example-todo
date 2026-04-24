---
id: SPEC-002-LIST-MANAGEMENT
title: List Management
status: draft
priority: P0
dependencies: [SPEC-001-TODO-MODEL]
tags: [core, operations, filtering]
last_updated: 2026-04-23
---

# List Management

## Overview

Defines the operations a user can perform on the list of todos: add, edit, toggle completion, delete, clear all completed, and filter the visible set. This spec is the surface area of the app — everything the user can *do* lives here. The Todo entity itself is defined in [SPEC-001-TODO-MODEL](./todo-model.spec.md); this spec is about the collection and the verbs.

## Requirements

### Collection membership

- WHEN the user adds a todo with a valid title, THE SYSTEM SHALL append it to the list.
- WHEN the user deletes a todo, THE SYSTEM SHALL remove it from the list.
- WHEN the user clears completed todos, THE SYSTEM SHALL remove every todo whose `completed` is true and preserve every todo whose `completed` is false.
- THE SYSTEM SHALL preserve insertion order. Newer todos appear after older todos.

### Mutation

- WHEN the user edits a todo's title, THE SYSTEM SHALL apply the change as specified in SPEC-001-TODO-MODEL (including rejection of empty titles after trim).
- WHEN the user toggles a todo's completion, THE SYSTEM SHALL flip its `completed` value.
- WHEN the user toggles completion on every todo at once, THE SYSTEM SHALL set all todos to completed if at least one was open, and set all todos to open otherwise.

### Filtering

- THE SYSTEM SHALL expose exactly three filter modes: `all`, `active`, `completed`.
- WHILE the active filter is `all`, THE SYSTEM SHALL include every todo in the visible set.
- WHILE the active filter is `active`, THE SYSTEM SHALL include only todos whose `completed` is false.
- WHILE the active filter is `completed`, THE SYSTEM SHALL include only todos whose `completed` is true.
- THE SYSTEM SHALL treat the filter as a view concern: changing the filter SHALL NOT modify any todo.

### Counts

- THE SYSTEM SHALL expose a count of active (not-completed) todos to the UI at all times.
- THE SYSTEM SHALL update the active count immediately when any todo is added, deleted, toggled, or bulk-toggled.

## Behaviors

Scenario: Adding three todos in sequence
  Given an empty list
  When the user adds "A", then "B", then "C"
  Then the list is [A, B, C] in that order
  And the active count is 3

Scenario: Toggling one todo updates the active count
  Given a list with three open todos
  When the user toggles the second todo
  Then the active count is 2
  And the second todo is completed
  And the first and third todos are still open

Scenario: Clearing completed removes only completed todos
  Given a list of five todos with three completed and two open
  When the user clears completed
  Then the list contains only the two open todos in their original order
  And the active count is 2

Scenario: Filter is a view, not a mutation
  Given a list of three todos, one completed
  When the user switches the filter to "active"
  Then the visible set has two todos
  And the underlying list still has three todos
  When the user switches the filter back to "all"
  Then the visible set has three todos in original order

Scenario: Toggle-all flips all todos when any is open
  Given a list of three todos, one of which is completed
  When the user toggles all
  Then all three todos are completed
  And the active count is 0

Scenario: Toggle-all reopens all todos when all are completed
  Given a list of three todos, all completed
  When the user toggles all
  Then all three todos are open
  And the active count is 3

## Data Definitions

Machine-readable contract: [`list-management.api.v1.yaml`](./list-management.api.v1.yaml).

Owns: the operation names, their input shapes, and the filter enum. Does not own the Todo shape (that is SPEC-001-TODO-MODEL).

## Open Questions

- Reordering (drag to reposition) — is this in scope? Current lean: not for the initial example; list order is insertion order only. Could be a later phase if the plan stays small.
- Edit-in-place vs. edit modal — phrased as "edit a todo's title"; the UI mechanics are SPEC-004's concern, not this one's.
