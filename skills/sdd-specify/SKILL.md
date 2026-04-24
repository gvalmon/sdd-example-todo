---
name: sdd-specify
description: Create or improve Spec-Driven Development (SDD) specs in spec/ from user input, product intent, or existing code in the repo root or code/. Use when the user invokes $sdd-specify, asks to draft specs, reverse-spec existing code, fill gaps in spec/, resolve open questions, find inconsistencies between specs and implementation, or prepare source-of-truth requirements before planning or implementation.
---

# SDD Specify

## Overview

Create and refine the stable `spec/` source of truth for an SDD repo. The skill converts product intent and observed code behavior into implementation-agnostic requirements, behaviors, data contracts, and open questions.

Invocation input is optional. It may be a plain-English product description, a feature request, a path to existing code, or a request to improve the current specs.

## Preparation

Before editing:

1. Read the repo's top-level guidance, `plan/status.md`, `spec/_constitution.md`, and `spec/AGENTS.md`.
2. Inventory existing specs with `rg --files spec`, excluding examples unless they are needed for formatting.
3. Determine the source material:
   - If the user provided requirements, treat them as the primary source.
   - If the user referenced existing code, inspect the named paths first.
   - If no path is given, inspect `code/` when present, then root-level application files.
4. Keep `spec/` implementation-agnostic. Put stack, file layout, runtime, migration, and phase details in `plan/` only when the user explicitly asks for plan updates.

## Source Modes

### User-input mode

Use when the user describes desired behavior, product goals, constraints, or open decisions.

1. Extract durable product rules, user-visible behavior, data invariants, non-goals, and unresolved questions.
2. Check each extracted rule against `spec/_constitution.md`.
3. Map each rule to an existing spec or to a proposed new spec.
4. If the request conflicts with the constitution or current specs, call out the conflict and choose the smaller correction that preserves the constitution unless the user explicitly asks to amend it.

### Reverse-spec mode

Use when the repo has behavior in code but missing or thin specs.

1. Inspect the app's observable behavior, state shape, validation rules, persistence behavior, accessibility behavior, and external contracts.
2. Separate intentional behavior from likely implementation accidents. Do not canonize code quirks as requirements without evidence.
3. Prefer existing user-facing copy, tests, and docs over incidental implementation details.
4. Record uncertain inferred intent in `Open Questions` instead of pretending certainty.

### Improve-existing mode

Use when specs already exist and the user asks to improve, audit, clarify, or resolve them.

1. Read all directly related specs, their sidecars, and declared dependencies.
2. Find gaps: missing EARS requirements, missing Given/When/Then scenarios, stale open questions, vague language, duplicate ownership, broken dependency declarations, and sidecars that drift from prose.
3. Resolve open questions only when the answer is supported by user input, constitution, current spec consensus, plan decisions, or clearly intentional code behavior.
4. Preserve existing spec IDs and filenames unless a rename is necessary.

## Drafting Specs

Create one spec per durable capability or contract. Use the existing format:

```yaml
---
id: SPEC-NNN-SLUG
title: Human-readable title
status: draft
priority: P0
dependencies: []
tags: [category, area]
last_updated: YYYY-MM-DD
---
```

Number new specs by scanning existing `SPEC-NNN-*` IDs and choosing the next unused number. Use the current date for `last_updated`.

Each spec should include:

- `Overview`: scope, user value, and ownership boundaries.
- `Requirements`: EARS-style rules grouped with short headings when useful.
- `Behaviors`: Given/When/Then scenarios for multi-step or stateful behavior.
- `Data Definitions`: sidecar links when the spec owns a machine-readable contract, otherwise `None owned by this spec.`
- `Open Questions`: unresolved decisions with the current lean and evidence, or `None.`

Create a sidecar only when the spec owns a machine-readable contract such as resource shapes, operation inputs, enums, schemas, or tabular data. Keep prose-only details in the spec.

## Consistency Checks

Before editing and again after editing, check:

- Every new or changed requirement is testable and observable.
- Requirements avoid implementation terms, framework names, file paths, storage backends, and phase scaffolding.
- Dependencies reference existing spec IDs and avoid circular dependencies.
- Sidecar filenames and links follow `spec/AGENTS.md`.
- The spec does not add constitution non-goals such as accounts, sync, due dates, reminders, tags, projects, priorities, analytics, or network dependencies unless the user explicitly asks to revise the constitution.
- Open questions are reduced when evidence supports an answer, and retained when the answer would be guesswork.

## Editing Policy

For straightforward requests to create or improve specs, edit the relevant `spec/` files directly after summarizing the intended changes. Ask the user before editing only when:

- The change would alter `spec/_constitution.md`.
- The source evidence is contradictory and there is no conservative choice.
- The requested scope would create many specs and the grouping is ambiguous.
- The user explicitly asks for a proposal first.

Do not edit implementation code as part of this skill. If code changes are needed after specification, hand off to `$sdd-implement`.

## Commit

If committing is requested, stage only the specification-related files and commit with:

```text
sdd-specify: <concise summary>
```

If committing is not requested, leave the working tree edited and report changed files plus any remaining open questions.
