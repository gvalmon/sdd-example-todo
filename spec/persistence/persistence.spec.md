---
id: SPEC-003-PERSISTENCE
title: Persistence
status: draft
priority: P0
dependencies: [SPEC-001-TODO-MODEL, SPEC-002-LIST-MANAGEMENT]
tags: [core, persistence, reliability]
last_updated: 2026-04-23
---

# Persistence

## Overview

Defines what survives a page reload. The constitution's second pillar — "state never surprises" — is enforced by this spec. Every user action that changes visible state must be durable before the next reload; anything the user can see at reload time must match what they did before leaving. No save button, no confirmation, no data loss on refresh.

This spec describes the *contract*. The choice of storage mechanism (in-memory, localStorage, IndexedDB, a future backend) is a plan concern and is owned by whatever `plan/phase-N-*.md` is currently live.

## Requirements

- WHEN the user adds, edits, toggles, deletes, bulk-toggles, or clears-completed any todo, THE SYSTEM SHALL persist the resulting list state before the next page load.
- WHEN the user changes the active filter, THE SYSTEM SHALL persist the new filter before the next page load.
- WHEN the app boots, THE SYSTEM SHALL restore the most recently persisted list state and filter.
- IF no persisted state exists (first ever run, or storage cleared), THEN THE SYSTEM SHALL boot with an empty list and the `all` filter.
- IF persisted state exists but cannot be parsed (corruption, incompatible schema, malformed JSON), THEN THE SYSTEM SHALL fall back to an empty list, SHALL NOT overwrite the corrupt payload automatically, and SHALL surface a non-blocking message to the user noting that saved data could not be loaded.
- THE SYSTEM SHALL store a schema version alongside persisted state, so that future migrations can detect old payloads.
- THE SYSTEM SHALL NOT require any network access to persist or restore state.

## Behaviors

> Scenario adapted from the canonical SDD example (see `/Users/agentic/Downloads/SDD.pdf` page 7).

Scenario: Completed todo survives refresh
  Given a todo list with one open item
  When the user marks the item as done
  And the user refreshes the page
  Then the item is still shown as done

Scenario: Filter choice survives refresh
  Given a list with a mix of open and completed todos
  And the active filter is "completed"
  When the user refreshes the page
  Then the active filter is still "completed"
  And only completed todos are visible

Scenario: Empty first run
  Given the app has never been used in this browser
  When the user opens the app
  Then the list is empty
  And the active filter is "all"
  And no error message is shown

Scenario: Corrupt payload does not destroy the app
  Given persisted state exists but is malformed
  When the user opens the app
  Then the app boots with an empty list
  And a non-blocking notice informs the user that saved data could not be loaded
  And the corrupt payload is not overwritten until the user makes a change

Scenario: Deleted todo does not reappear after refresh
  Given a list with three todos
  When the user deletes one
  And the user refreshes the page
  Then the list contains the two remaining todos in their original order

## Data Definitions

Prose-only for now. The persisted payload is a JSON object with two fields:

- `schema_version` — integer, currently `1`.
- `state` — a [`ListState`](../tracker/list-management.api.v1.yaml#/components/schemas/ListState) as defined by SPEC-002-LIST-MANAGEMENT.

When a concrete storage backend is chosen by `plan/`, its storage-key naming, serialization format, or DB schema would be captured in a `persistence.db.v1.yaml` sidecar added next to this file.

## Open Questions

- Should the app debounce writes, write synchronously per action, or both? Current lean: write synchronously per mutation for simplicity; add debouncing only if a phase finds it necessary.
- On schema-version mismatch during a future migration, should the app attempt to migrate forward, refuse to load, or snapshot-and-reset? Current lean: migrate forward when the diff is safe; otherwise preserve old payload and surface a message.
