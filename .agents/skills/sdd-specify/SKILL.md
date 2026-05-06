---
name: sdd-specify
description: Create or improve Spec-Driven Development (SDD) specs in spec/ from user input, product intent, or existing code in the repo root or code/. Use when the user invokes $sdd-specify, asks to draft initial specs for a new or empty repo, reverse-spec existing code, fill gaps in spec/, find inconsistencies between specs and implementation.
---

# SDD Specify

## Overview

Create and refine the stable `spec/` source of truth for an SDD repo. The skill converts product intent and observed code behavior into implementation-agnostic requirements, behaviors, data contracts, and open questions.

Invocation input is optional. It may be a plain-English product description, a feature request, a path to existing code, or a request to improve the current specs.

The repo may be partially initialized. Missing `plan/status.md`, `spec/_constitution.md`, `spec/AGENTS.md`, or even `spec/` itself is a context gap or possible output, not a blocker.

## Preparation

Before editing:

1. Read the repo's top-level guidance. Read `plan/status.md`, `spec/_constitution.md`, and `spec/AGENTS.md` when present.
2. Inventory existing specs with `find spec -type f` when `spec/` exists, excluding examples unless they are needed for formatting.
3. Choose the specification mode and source material:
   - **Initial-spec mode:** No real specs exist, `spec/` is missing or empty, or the user asks for a full initial spec set. Source: user intent plus README/docs/code/plan signals when present. Missing `spec/_constitution.md` is an output candidate, not a blocker.
   - **User-input mode:** The user describes desired behavior, product goals, constraints, or open decisions. Source: user input plus current specs.
   - **Reverse-spec mode:** The repo has behavior in code but missing or thin specs. Source: code, tests, docs, and observable app behavior, with named paths inspected first.
   - **Improve-existing mode:** Specs already exist and the user asks to improve, audit, clarify, or resolve them. Source: current specs and direct dependencies.
4. Keep `spec/` implementation-agnostic. Put stack, file layout, runtime, migration, and phase details in `plan/` only when the user explicitly asks for plan updates.

## Source Modes

Use the mode chosen in Preparation. If the constitution is missing, validate against top-level guidance, established specs, user-provided constraints, and existing product behavior instead of stopping.

### Initial-spec Mode

Use when no real specs exist, `spec/` is missing or empty, or the user asks for a full initial spec set.

1. Ask a concise clarification pass before generating specs unless the user explicitly says to choose reasonable defaults or not to pause. Prioritize questions that materially affect product boundaries: target user, core workflow, MVP capabilities, durable non-goals, data entities, persistence/sync expectations, external integrations, and success criteria.
2. Keep the question set small. Ask only what would change the initial spec structure or constitution; carry lesser uncertainty into `Open Questions`.
3. Read lightweight repo signals after or alongside the clarification pass: README, top-level docs, existing code/root app files, tests, and plan files if present. Do not require `plan/status.md`.
4. If `spec/_constitution.md` is missing, draft it from confirmed product identity, design pillars, non-goals, hard constraints, and governance. Mark uncertain boundaries as open questions instead of inventing hard rules.
5. Create a small coherent initial spec set for the durable capabilities already supported by the source material. Prefer fewer specs with clear ownership over a large speculative taxonomy.
6. If the answers are too sparse to choose product boundaries, stop after the clarification questions and generate specs only after the user responds.

### User-input mode

Use when the user describes desired behavior, product goals, constraints, or open decisions.

1. Extract durable product rules, user-visible behavior, data invariants, non-goals, and unresolved questions.
2. Check each extracted rule against `spec/_constitution.md` when present.
3. Map each rule to an existing spec or to a proposed new spec.
4. If the request conflicts with the constitution or current specs, call out the conflict and choose the smaller correction that preserves the constitution unless the user explicitly asks to amend it. If no constitution exists, record the boundary as an assumption or open question.

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

If `spec/AGENTS.md` or existing examples are absent, use this default format and keep sidecars simple and obvious. Do not fail solely because formatting guidance is missing.

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
- Sidecar filenames and links follow `spec/AGENTS.md` when present, or the simplest local convention when absent.
- If a constitution exists, the spec does not add constitution non-goals such as accounts, sync, due dates, reminders, tags, projects, priorities, analytics, or network dependencies unless the user explicitly asks to revise the constitution.
- If no constitution exists, product boundaries are documented in `spec/_constitution.md`, spec assumptions, or open questions.
- Open questions are reduced when evidence supports an answer, and retained when the answer would be guesswork.

## Editing Policy

For straightforward requests to create or improve specs, edit the relevant `spec/` files directly after summarizing the intended changes.

Initial-spec mode is the exception: ask the clarification questions before generating specs. After the user answers, summarize assumptions and create or update `spec/` and `spec/_constitution.md` as needed. If the user explicitly delegates the missing decisions, proceed and record those assumptions.

Ask the user before editing only when:

- The change would alter an existing `spec/_constitution.md`.
- The source evidence is contradictory and there is no conservative choice.
- The requested scope would create many specs and the grouping is ambiguous.
- The user explicitly asks for a proposal first.

Do not edit implementation code as part of this skill. If code changes are needed after specification, hand off to `$sdd-implement`.

## Commit

Unless the user asked not to commit, stage only the specification-related files and commit with:

```text
specify: <concise summary>
```

If committing is declined, leave the working tree edited and report changed files plus any remaining open questions.
