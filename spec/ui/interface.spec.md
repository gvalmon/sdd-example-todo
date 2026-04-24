---
id: SPEC-004-INTERFACE
title: User Interface
status: draft
priority: P0
dependencies: [SPEC-001-TODO-MODEL, SPEC-002-LIST-MANAGEMENT]
tags: [ui, ux, keyboard, accessibility]
last_updated: 2026-04-23
---

# User Interface

## Overview

Defines the interface a user sees and interacts with — implementation-agnostic. Nothing here is about React or vanilla DOM; it is about what is on screen, how it is arranged, and how keyboard and mouse drive it. The app is a single view (no routes, no modals) whose layout is: an input row at the top, the list of todos in the middle, a footer with count and filter controls at the bottom.

The constitution's "keyboard-first, mouse-fine" pillar is the driving design force here: every verb from SPEC-002-LIST-MANAGEMENT must have a keyboard path that does not require the mouse.

## Requirements

### Layout

- THE SYSTEM SHALL present a single main view with three regions, in this vertical order: input row, list region, footer.
- THE SYSTEM SHALL render the input row at the top of the view, containing a single text input and no other controls.
- THE SYSTEM SHALL render the list region directly below the input row, showing the visible set defined by the active filter.
- THE SYSTEM SHALL render the footer at the bottom of the view, containing (left to right) the active count, the filter controls, and a "clear completed" action.

### Input row

- WHEN the user types in the input and presses Enter, THE SYSTEM SHALL add a new todo with the typed title.
- WHEN a new todo is added via the input, THE SYSTEM SHALL clear the input and keep focus on the input.
- IF the input's value is empty or whitespace-only when Enter is pressed, THEN THE SYSTEM SHALL NOT add a todo and SHALL keep the input focused.
- THE SYSTEM SHALL focus the input on initial page load so the user can start typing without a click.

### List region

- THE SYSTEM SHALL render one row per visible todo, showing (in reading order) a completion checkbox, the title, and a delete affordance.
- THE SYSTEM SHALL visually distinguish completed todos from open todos — color alone is never sufficient; titles SHALL also render with strike-through or equivalent non-color treatment.
- WHEN the user activates the completion checkbox, THE SYSTEM SHALL toggle the todo's completion.
- WHEN the user double-clicks or double-activates a todo's title, THE SYSTEM SHALL enter edit mode for that todo, presenting an editable text input pre-filled with the current title.
- WHEN the user presses Enter while in edit mode, THE SYSTEM SHALL commit the edited title (subject to SPEC-001-TODO-MODEL's validation).
- WHEN the user presses Escape while in edit mode, THE SYSTEM SHALL discard the edit and restore the previous title.
- WHEN the user activates a todo's delete affordance, THE SYSTEM SHALL delete that todo with no confirmation prompt.
- IF the visible set is empty, THEN THE SYSTEM SHALL render an empty-state placeholder appropriate to the active filter (e.g. "Nothing to do." for `all`, "No open todos." for `active`).

### Footer

- THE SYSTEM SHALL render the active count as text, pluralizing correctly (e.g. "1 item left", "3 items left").
- THE SYSTEM SHALL render three filter controls labeled All, Active, Completed, with the current filter visually marked as active.
- WHEN the user activates a filter control, THE SYSTEM SHALL set the active filter accordingly.
- THE SYSTEM SHALL render a "clear completed" action that is visible only when at least one completed todo exists.

### Keyboard navigation

- WHERE keyboard navigation is enabled, THE SYSTEM SHALL allow Tab to move focus through input → list rows → footer controls in DOM order.
- WHERE keyboard navigation is enabled, THE SYSTEM SHALL treat Space on a focused todo row as a toggle of its completion.
- WHERE keyboard navigation is enabled, THE SYSTEM SHALL treat Delete or Backspace on a focused todo row (not in edit mode) as a delete.
- WHERE keyboard navigation is enabled, THE SYSTEM SHALL allow the keys `1`, `2`, `3` (when no input is focused) to switch to the All, Active, and Completed filters respectively.

### Accessibility

- THE SYSTEM SHALL label all interactive controls so that a screen reader announces their purpose without relying on visual context.
- THE SYSTEM SHALL never use color as the sole signal of state (completion, current filter, etc.).
- THE SYSTEM SHALL maintain visible focus indicators on every focusable element.

## Behaviors

Scenario: Typing and adding a todo
  Given the app has just loaded with an empty list
  Then focus is in the input
  When the user types "Buy milk" and presses Enter
  Then the list shows "Buy milk"
  And the input is empty
  And focus is still in the input

Scenario: Attempting to add a blank todo
  Given focus is in the input
  When the user presses Enter with no text typed
  Then the list is unchanged
  And focus remains in the input

Scenario: Editing a todo with double-click and Escape
  Given a list with one todo titled "Buy milk"
  When the user double-clicks the title
  Then an editable input appears pre-filled with "Buy milk"
  When the user types " (organic)" and presses Escape
  Then the todo's title remains "Buy milk"
  And edit mode is dismissed

Scenario: Filter control marks itself active
  Given a list with three todos
  When the user activates the "Active" filter
  Then the "Active" control is visually marked as active
  And only open todos are visible
  And the footer count still reflects the count of open todos

Scenario: Clear-completed visibility
  Given a list with no completed todos
  Then the clear-completed action is not visible
  When the user completes one todo
  Then the clear-completed action becomes visible

Scenario: Keyboard-only path for completing a todo
  Given a list with three open todos and focus in the input
  When the user presses Tab
  Then focus moves to the first todo row
  When the user presses Space
  Then the first todo is marked completed
  And focus remains on the same row

## Data Definitions

None owned by this spec. UI strings (empty-state text, button labels, pluralization rules) are intentionally left to the implementation for now; if copywriting starts to matter we'll extract an `interface.data.yaml`.

## Open Questions

- Should filter switching live in the URL (hash or query)? Current lean: no — the constitution says single-user / single-device, and deep-linking isn't a user need for a flat list.
- Edit-mode affordance (double-click vs dedicated edit button): spec permits either activation as a double-activation; plan phase may add a visible edit button if testing shows double-click is undiscoverable.
