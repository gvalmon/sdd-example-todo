# Spec-Driven Development Guide

Specs in this folder are the **source of truth** — write (or update) the spec first, then write code to match it. An ad-hoc fix in `code/` that doesn't make it back into a spec is a regression waiting to happen.

## Format

Markdown + YAML frontmatter. See [`_example_spec.md`](./_example_spec.md) for a complete template and [`_example_spec.api.v1.yaml`](./_example_spec.api.v1.yaml) for the sidecar skeleton.

## Folder Structure

```
spec/
  CLAUDE.md                      # This file
  _constitution.md               # Design pillars, non-goals, hard constraints
  _example_spec.md               # Template / reference spec
  _example_spec.api.v1.yaml      # Template / reference sidecar
  tracker/
    todo-model.spec.md
    todo-model.api.v1.yaml
    list-management.spec.md
    list-management.api.v1.yaml
  persistence/
    persistence.spec.md
  ui/
    interface.spec.md
```

Topic subdirectories group related specs (tracker, persistence, ui). Files use the `.spec.md` suffix. One spec per file.

## Sidecars

When a spec owns a machine-readable contract — an API shape, a DB schema, a tabular data catalog — the contract lives in a sibling YAML file next to the spec:

- `<name>.api.v1.yaml` — logical resource / endpoint shape (OpenAPI-flavored).
- `<name>.db.v1.yaml` — persistence schema.
- `<name>.data.yaml` — general tabular data (use for prose-free tuning / catalog data).

Rules:
- **Version breaking changes by filename.** A compatible evolution stays in `.v1.yaml`. A breaking change adds a `.v2.yaml` and a `plan/phase-*.md` bridges v1 → v2. Keep both until the plan finishes the migration.
- **One sidecar per spec per kind.** Don't split the resource shape across multiple files.
- **The spec's "Data Definitions" section points at the sidecar** — it doesn't restate values.
- **Sidecars are versioned with their spec.** Change both in the same commit.
- **Prose-only data stays in the spec markdown.** Only extract when the data is tabular, numeric, or machine-consumable.

## Key Principles

1. **Spec-first.** Write the spec before writing code. When canonizing an ad-hoc fix, the spec edit is the point of the commit.
2. **Living documents.** Update specs when designs change. Stale specs are worse than no specs.
3. **Start small, elaborate later.** A one-page spec is better than no spec.
4. **Implementation-agnostic.** Specs describe *what the user experiences*, not how the browser / runtime / storage achieves it. Instead of "localStorage key `todos-v1`", write "the list survives a page reload." Storage specifics belong in `plan/` or in a `.db.v1.yaml` sidecar.
5. **Final vision.** Specs describe the finished app, not intermediate scaffolding. Temporary hacks belong in `plan/` phase files.
6. **Testable.** Every requirement should be verifiable. Use EARS notation or Given/When/Then scenarios.
7. **Self-contained.** Each spec includes enough context to be understood without reading every other spec. Declare dependencies in frontmatter when you need to lean on another spec's rules.

## Frontmatter schema

```yaml
---
id: SPEC-NNN-SLUG                       # see "Spec IDs" below
title: Human-readable title
status: draft                           # draft | in-review | approved
priority: P0                            # P0 (critical) | P1 (high) | P2 (medium) | P3 (low)
dependencies: [SPEC-001-TODO-MODEL]     # other specs this one builds on; [] if none
tags: [category, area]
last_updated: YYYY-MM-DD
---
```

### Spec IDs

Format: `SPEC-NNN-SLUG`, e.g. `SPEC-001-TODO-MODEL`.

- `NNN` — zero-padded sequence number, allocated once when the spec is created. Never reused, never renumbered.
- `SLUG` — an UPPERCASE-KEBAB rendering of the spec's file basename (without the `.spec.md` suffix). Example: `todo-model.spec.md` → `TODO-MODEL`. The slug makes cross-references self-describing: a reader of `SPEC-003-PERSISTENCE` sees what it's about without opening the file.
- If a spec is renamed, rename the file and update the slug in the ID (the number stays). Treat the rename as a deliberate edit and mention the old slug in the commit message so inbound links can be grepped.
- A retired spec is marked `status: deprecated` and left in place with a pointer to its replacement.

## EARS Notation

| Pattern | Template | Example |
|---------|----------|---------|
| **Event-driven** | WHEN [event], THE SYSTEM SHALL [behavior] | WHEN the user submits the input form, THE SYSTEM SHALL append a new todo to the list |
| **State-driven** | WHILE [state], THE SYSTEM SHALL [behavior] | WHILE the active filter is "completed", THE SYSTEM SHALL hide all open todos |
| **Unwanted behavior** | IF [condition], THEN THE SYSTEM SHALL [response] | IF the user submits an empty title, THEN THE SYSTEM SHALL reject the submission |
| **Optional feature** | WHERE [feature], THE SYSTEM SHALL [behavior] | WHERE keyboard navigation is enabled, THE SYSTEM SHALL allow Delete to remove the focused todo |
| **Universal** | THE SYSTEM SHALL [behavior] | THE SYSTEM SHALL persist all state changes before the next page load |

## Given / When / Then

Use GWT scenarios for behaviors that involve more than one step or piece of state:

```
Scenario: Completed todo survives refresh
  Given a todo list with one open item
  When the user marks the item as done
  And the user refreshes the page
  Then the item is still shown as done
```

Scenario names should read as declarative outcomes ("Completed todo survives refresh"), not task descriptions ("Test that completed todos persist").
