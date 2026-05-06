# Spec-Driven Development Guide

Specs are the **source of truth**: write or update the spec first, then write code to match it. An ad-hoc fix in `code/` that does not make it back into a spec is a regression waiting to happen.

## Format

Markdown + YAML frontmatter. See `_example_spec.md` for a complete template and `_example_spec.api.v1.yaml` for the sidecar skeleton.

## Folder Structure

```text
spec/
  AGENTS.md
  _constitution.md
  _example_spec.md
  <topic>/
    <name>.spec.md
    <name>.<kind>.yaml   # optional sidecar
```

Topic subdirectories group related specs. Files use the `.spec.md` suffix. One spec per file.

## Sidecars

A spec's machine-readable contract lives in a sibling YAML file:

- `<name>.api.v1.yaml` — logical resource / endpoint shape.
- `<name>.db.v1.yaml` — persistence schema.
- `<name>.data.yaml` — general tabular data.

Rules:

- **Version breaking changes by filename.** Compatible evolution stays in `.v1.yaml`; a breaking change adds `.v2.yaml` and a `plan/phase-*.md` bridges v1 → v2.
- **One sidecar per spec per kind.** Do not split one resource shape across files.
- **The spec's "Data Definitions" section points at the sidecar**, not restates values.
- **Sidecars are versioned with their spec.** Change both in the same commit.
- **Prose-only data stays in the spec markdown.** Extract only when the data is tabular, numeric, or machine-consumable.

## Key Principles

1. **Spec-first.** When canonizing an ad-hoc fix, the spec edit is the point of the commit.
2. **Living documents.** Update specs when designs change.
3. **Start small, elaborate later.** A one-page spec beats no spec.
4. **Implementation-agnostic.** Describe what the user experiences, not how the runtime achieves it.
5. **Final vision.** Describe the finished app, not intermediate scaffolding.
6. **Testable.** Every requirement is verifiable via EARS or Given/When/Then.
7. **Self-contained.** Each spec carries enough context to be understood alone; declare cross-spec needs in frontmatter.

## Frontmatter

Required fields: `id`, `title`, `status` (`draft` | `in-review` | `approved`), `priority` (`P0`–`P3`), `dependencies`, `tags`, `last_updated`. See `_example_spec.md` for the full block.

## Spec IDs

Format: `SPEC-NNN-SLUG` (e.g. `SPEC-001-DRAWING-CANVAS`). `NNN` is allocated once and never reused; `SLUG` is the file basename in UPPERCASE-KEBAB. Renaming updates the slug; the number stays. Retired specs are marked `status: deprecated` with a pointer to the replacement.

## EARS Notation

| Pattern | Template |
|---|---|
| Event-driven | WHEN [event], THE SYSTEM SHALL [behavior] |
| State-driven | WHILE [state], THE SYSTEM SHALL [behavior] |
| Unwanted behavior | IF [condition], THEN THE SYSTEM SHALL [response] |
| Optional feature | WHERE [feature], THE SYSTEM SHALL [behavior] |
| Universal | THE SYSTEM SHALL [behavior] |

## Given / When / Then

Use GWT for behaviors spanning more than one step or piece of state. Scenario names read as declarative outcomes, not task descriptions. See `_example_spec.md § Behaviors` for the shape.
