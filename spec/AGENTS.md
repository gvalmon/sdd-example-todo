# Spec-Driven Development Guide

Specs in this folder are the **source of truth**: write or update the spec first, then write code to match it. An ad-hoc fix in `code/` that does not make it back into a spec is a regression waiting to happen.

## Format

Markdown + YAML frontmatter. See `_example_spec.md` for a complete template and `_example_spec.api.v1.yaml` for the sidecar skeleton.

## Folder Structure

```text
spec/
  AGENTS.md
  CLAUDE.md
  _constitution.md
  _example_spec.md
  _example_spec.api.v1.yaml
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

Topic subdirectories group related specs. Files use the `.spec.md` suffix. One spec per file.

## Sidecars

When a spec owns a machine-readable contract, the contract lives in a sibling YAML file next to the spec:

- `<name>.api.v1.yaml` - logical resource / endpoint shape.
- `<name>.db.v1.yaml` - persistence schema.
- `<name>.data.yaml` - general tabular data.

Rules:

- **Version breaking changes by filename.** A compatible evolution stays in `.v1.yaml`. A breaking change adds a `.v2.yaml` and a `plan/phase-*.md` bridges v1 -> v2.
- **One sidecar per spec per kind.** Do not split one resource shape across multiple files.
- **The spec's "Data Definitions" section points at the sidecar.** It does not restate values.
- **Sidecars are versioned with their spec.** Change both in the same commit.
- **Prose-only data stays in the spec markdown.** Only extract when the data is tabular, numeric, or machine-consumable.

## Key Principles

1. **Spec-first.** Write the spec before writing code. When canonizing an ad-hoc fix, the spec edit is the point of the commit.
2. **Living documents.** Update specs when designs change.
3. **Start small, elaborate later.** A one-page spec is better than no spec.
4. **Implementation-agnostic.** Specs describe what the user experiences, not how the browser, runtime, or storage achieves it.
5. **Final vision.** Specs describe the finished app, not intermediate scaffolding.
6. **Testable.** Every requirement should be verifiable. Use EARS notation or Given/When/Then scenarios.
7. **Self-contained.** Each spec includes enough context to be understood without reading every other spec. Declare dependencies in frontmatter when needed.

## Frontmatter Schema

```yaml
---
id: SPEC-NNN-SLUG
title: Human-readable title
status: draft
priority: P0
dependencies: [SPEC-001-TODO-MODEL]
tags: [category, area]
last_updated: YYYY-MM-DD
---
```

## Spec IDs

Format: `SPEC-NNN-SLUG`, e.g. `SPEC-001-TODO-MODEL`.

- `NNN` - zero-padded sequence number, allocated once when the spec is created.
- `SLUG` - an UPPERCASE-KEBAB rendering of the spec's file basename without the `.spec.md` suffix.
- If a spec is renamed, rename the file and update the slug in the ID. The number stays.
- A retired spec is marked `status: deprecated` and left in place with a pointer to its replacement.

## EARS Notation

| Pattern | Template |
|---|---|
| Event-driven | WHEN [event], THE SYSTEM SHALL [behavior] |
| State-driven | WHILE [state], THE SYSTEM SHALL [behavior] |
| Unwanted behavior | IF [condition], THEN THE SYSTEM SHALL [response] |
| Optional feature | WHERE [feature], THE SYSTEM SHALL [behavior] |
| Universal | THE SYSTEM SHALL [behavior] |

## Given / When / Then

Use GWT scenarios for behaviors that involve more than one step or piece of state:

```text
Scenario: Completed todo survives refresh
  Given a todo list with one open item
  When the user marks the item as done
  And the user refreshes the page
  Then the item is still shown as done
```

Scenario names should read as declarative outcomes, not task descriptions.
