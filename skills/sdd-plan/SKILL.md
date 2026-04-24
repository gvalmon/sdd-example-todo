---
name: sdd-plan
description: Create or improve Spec-Driven Development (SDD) plan files in plan/ from specs, user input, project status, or existing code in the repo root or code/. Use when the user invokes $sdd-plan, asks to draft a new phase, improve phase plans, reverse-plan implemented code, resolve plan inconsistencies, update plan/status.md, or translate spec/ requirements into implementation-specific phased work before using $sdd-implement.
---

# SDD Plan

## Overview

Create and refine the iterative `plan/` layer for an SDD repo. The skill turns stable specs, user intent, and observed implementation state into concrete phase files, integration notes, verification checklists, and project status updates.

Invocation input is optional. It may be a phase idea, a spec or feature reference, a request to plan the next phase, a path to existing code, or a request to audit/improve the current plan.

## Preparation

Before editing:

1. Read the repo's top-level guidance, `plan/status.md`, `plan/AGENTS.md`, `plan/_example_phase.md`, `spec/_constitution.md`, and the relevant `spec/**/*.spec.md` files.
2. Inventory existing plans with `rg --files plan`, excluding examples unless needed for formatting.
3. Determine the source material:
   - If the user provided a phase goal, use it as the primary source.
   - If the user referenced specs, read those specs and declared dependencies.
   - If the user referenced existing code, inspect the named paths first.
   - If no path is given and reverse-planning is requested, inspect `code/` when present, then root-level application files.
4. Preserve the boundary: `spec/` owns user-visible behavior and durable contracts; `plan/` owns stack choices, phase sequencing, implementation artifacts, integration points, temporary scaffolding, and verification.

## Source Modes

### Spec-to-plan mode

Use when the user asks to draft a phase, plan the next phase, or translate specs into implementation work.

1. Identify the target specs and the smallest runnable increment that can satisfy them end-to-end.
2. Choose phase boundaries that keep every phase human-testable.
3. Create or update `phase-N-*.md` with concrete deliverables, integration points, implementation notes, automated test ideas, manual testing steps, and explicit out-of-scope items.
4. Update `plan/status.md` only when the phase index, current phase, stack, architecture decisions, or known deviations need to change.

### User-input mode

Use when the user describes implementation preferences, sequencing, constraints, or a desired phase.

1. Extract stack-specific decisions, constraints, risks, and acceptance needs.
2. Check each item against `spec/_constitution.md` and the relevant specs.
3. Put product behavior gaps in `spec/` only if the user explicitly asks to expand scope; otherwise record them as plan risks or open questions and suggest `$sdd-specify`.
4. Keep phase deliverables implementation-shaped, with spec references instead of restating product requirements.

### Reverse-plan mode

Use when code exists but `plan/` is missing, stale, or too thin.

1. Inspect the implementation architecture, file layout, runtime assumptions, storage choices, state boundaries, event wiring, test setup, and manual run path.
2. Separate deliberate architecture from incidental code shape. Do not enshrine accidental complexity as a plan decision without evidence.
3. Update completed phase files and `plan/status.md` to describe what shipped and how future phases should build on it.
4. Record uncodified product behavior as a possible spec gap instead of hiding it in plan prose.

### Improve-existing mode

Use when plans already exist and the user asks to improve, audit, clarify, or resolve inconsistencies.

1. Read related phase files, `plan/status.md`, referenced specs, and relevant code if the plan claims something has shipped.
2. Find gaps: stale phase status, missing manual testing, deliverables that restate specs, missing integration points, vague implementation notes, outdated architecture decisions, duplicate phase ownership, and known deviations that should be canonized or resolved.
3. Resolve open plan questions only when supported by specs, current implementation, phase history, or explicit user input.
4. Preserve shipped phase history unless the user explicitly asks to rewrite it.

## Drafting Phase Files

Use `plan/_example_phase.md` as the shape:

- `Status`: `Not started`, `In progress`, or `Complete`.
- `Specs`: spec IDs and titles this phase implements or supports.
- `Goal`: the end-to-end capability this phase delivers.
- `Deliverables`: implementation artifacts, each with spec references where relevant.
- `Integration Points`: concrete wiring such as imports, DOM ids, storage keys, module boundaries, state shape changes, and run commands.
- `Implementation Notes`: stack-specific decisions, constants, temporary scaffolding, gotchas, and patterns for implementers.
- `E2E Tests`: verification scenarios linked to spec scenarios when possible.
- `Manual Testing (Success Path)`: exact steps a human can run after implementation.
- `Out of Scope for This Phase`: spec-backed or tempting work intentionally deferred.

For new phases, number by scanning existing `phase-N-*.md` files and choosing the next logical number unless the user explicitly asks to revise unshipped phase sequencing.

## Status Updates

Update `plan/status.md` when plan work changes:

- Current phase state.
- Stack, runtime, package manager, persistence, or test strategy.
- Durable architecture decisions.
- Art direction or UX implementation direction.
- Phase index entries and status values.
- Known deviations, especially ad-hoc implementation changes that still need `$sdd-canonize`.

Do not use `plan/status.md` as a dump for details that belong in a phase file.

## Consistency Checks

Before editing and again after editing, check:

- Every phase ends in a runnable, human-testable state.
- Deliverables name implementation artifacts rather than product behavior.
- Product behavior is referenced by spec ID instead of restated.
- Integration points are concrete enough for `$sdd-implement` to start without rediscovering architecture.
- Manual testing steps are executable in the current stack.
- Phase status agrees with `plan/status.md`.
- Completed phase descriptions agree with the current code.
- The plan does not smuggle in constitution non-goals or unapproved spec changes.

## Editing Policy

For straightforward requests to create or improve plans, edit the relevant `plan/` files directly after summarizing the intended changes. Ask the user before editing only when:

- The work would require changing `spec/_constitution.md` or product scope in `spec/`.
- Phase sequencing is ambiguous and several reasonable breakdowns would lead to different implementation paths.
- The requested plan would overwrite shipped phase history.
- The user explicitly asks for a proposal first.

Do not edit implementation code as part of this skill. If code changes are needed after planning, hand off to `$sdd-implement`. If durable product behavior is missing, hand off to `$sdd-specify`.

## Commit

If committing is requested, stage only the plan-related files and skill metadata needed for this task, then commit with:

```text
sdd-plan: <concise summary>
```

If committing is not requested, leave the working tree edited and report changed files plus any remaining open questions.
