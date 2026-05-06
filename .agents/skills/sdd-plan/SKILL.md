---
name: sdd-plan
description: Create or improve Spec-Driven Development (SDD) plan files in plan/ from approved specs, project status, explicit phase requests, or existing code in the repo root or code/. Use when the user invokes $sdd-plan, asks to draft phases, create a full initial plan from an empty plan/ directory, improve phase plans, resolve plan inconsistencies, update plan/status.md, or translate spec/ requirements into implementation-specific phased work before using $sdd-implement.
---

# SDD Plan

## Overview

Create and refine the iterative `plan/` layer for an SDD repo. The skill turns stable specs and observed implementation state into concrete phase files, implementation notes, verification checklists, and project status updates.

## Preparation

Before editing:

1. Read the repo's top-level guidance, `plan/status.md` when present, `plan/AGENTS.md`, `plan/_example_phase.md`, `spec/_constitution.md`, and the relevant `spec/**/*.spec.md` files.
2. Inventory existing plans with `find plan -type f`, excluding examples unless needed for formatting.
3. Choose the planning mode and source material:
   - **Initial-plan mode:** No real phase files and no implementation code exist, or the user asks for a full initial plan. Source: current spec set. Missing or empty `plan/status.md` is an output to create, not a blocker.
   - **Directed spec-to-plan mode:** The user asks for a new phase, next phase, phase goal, sequencing change, implementation preference, or spec reference. Source: user input + current plan + relevant specs.
   - **Implementation-informed mode:** Code exists with missing/stale/thin plans, or the user references implementation. Source: code + specs, with named paths inspected first.
   - **Plan-improvement mode:** The user asks to audit, clarify, or improve existing plans. Source: current phase files + `plan/status.md`; read specs/code only to resolve claims, status, or inconsistencies.
4. Preserve the boundary: `spec/` owns user-visible behavior and durable contracts; `plan/` owns stack choices, phase sequencing, implementation artifacts, implementation contracts, temporary scaffolding, and verification.

## Source Modes

Use the mode chosen in Preparation. User-provided implementation preferences, sequencing constraints, or desired phase details may refine any mode, but must be validated against `spec/_constitution.md` and the relevant specs. Record product behavior gaps as plan risks or open questions unless the user explicitly asks to expand scope with `$sdd-specify`.

### Initial-plan Mode

Use when no real phase files and no implementation code exist, or when the user asks for a full initial plan.

1. Treat the current non-example spec set as the primary source. `plan/status.md` may be missing or empty; create/populate it during this mode.
2. If the implementation stack is not already decided, propose one conservative stack immediately and ask the user to confirm or change it before editing plan files. Do not ask an open-ended stack question as the first response. Base the proposal on the specs, constitution constraints, repo guidance, and any existing implementation signals; include a concise rationale, the main tradeoff, and a clear confirmation question. State that confirmation starts the full initial plan. If the user explicitly asks the planner to choose without pausing, proceed with the recommended stack and record it as an assumption in `plan/status.md`.
3. Run a clarification pass for any remaining decisions that materially affect phase boundaries, sequencing, risks, or success criteria. Skip questions whose answers can be represented safely as plan assumptions, open questions, or out-of-scope notes.
4. Create `plan/status.md` with the current phase, stack assumptions/decisions, test strategy, durable architecture choices, phase index, and known open questions.
5. Create phase files for all phases currently required to implement the specs, up to 10 phases. If more than 10 phases seem necessary, create the first 10 and record the remaining backlog in `plan/status.md`.
6. Keep phases small and human-testable. Phase 1 is bootstrap only: build tool, language config, package manager, lint/typecheck, unit + e2e harness, CI wiring, and the thinnest runnable shell that proves the stack boots. Subsequent phases add one user-visible capability or cohesive subsystem each.
7. Future phases may be less implementation-dense than the next actionable phase, but every phase file still needs a goal, deliverables, implementation notes, E2E tests, manual testing steps, and out-of-scope items.

### Directed Spec-to-plan Mode

Use when plans exist and the user asks for a new phase, next phase, phase goal, sequencing change, implementation preference, or spec reference.

1. Identify the target specs, current plan position, requested outcome, and smallest runnable increment that satisfies the request end-to-end.
2. Run a concise clarification pass for decisions that materially affect phase boundaries, stack integration, sequencing, risks, or success criteria. Proceed without asking only when the specs/current plan already settle the decisions, the user explicitly asked not to pause, or the user asked the planner to choose reasonable defaults.
3. Convert answers into plan-level decisions, open questions, or out-of-scope notes. Do not smuggle new product behavior into `plan/`; suggest `$sdd-specify` when the answer changes durable product scope.
4. Create or update the targeted `phase-N-*.md` files and `plan/status.md` when the phase index, current phase, stack, architecture decisions, or known deviations change.

### Implementation-informed Mode

Use when code exists but `plan/` is missing, stale, or too thin, or when the user references implementation as planning source material.

1. Inspect the implementation architecture, file layout, runtime assumptions, storage choices, state boundaries, event wiring, test setup, and manual run path.
2. Separate deliberate architecture from incidental code shape. Do not enshrine accidental complexity as a plan decision without evidence.
3. Create or update completed phase files and `plan/status.md` to describe what shipped and how future phases should build on it.
4. Record uncodified product behavior as a possible spec gap instead of hiding it in plan prose.

### Plan-improvement Mode

Use when plans already exist and the user asks to improve, audit, clarify, or resolve inconsistencies.

1. Read related phase files, `plan/status.md`, referenced specs, and relevant code if the plan claims something has shipped.
2. Find gaps: stale phase status, missing manual testing, deliverables that restate specs, missing implementation contracts, vague implementation notes, outdated architecture decisions, duplicate phase ownership, and known deviations that should be canonized or resolved.
3. Resolve open plan questions only when supported by specs, current implementation, phase history, or explicit user-provided answers.
4. Preserve shipped phase history unless the user explicitly asks to rewrite it.

## Drafting Phase Files

Use `plan/_example_phase.md` as the shape:

- `Status`: `Not started`, `In progress`, or `Complete`.
- `Specs`: spec IDs and titles this phase implements or supports.
- `Goal`: the end-to-end capability this phase delivers.
- `Deliverables`: feature or system slices that describe what becomes true when the phase is done. Use a readable bold heading plus a one-sentence outcome, then 2-5 sub-items when details matter. Good headings are capability names like `Library page`, `Persistence`, `Import flow`, `Engine bridge`, or `Authorization state`, not file or class names. Sub-items should clarify user-visible outcome, data/state responsibility, important edge cases, implementation constraints, and spec references. Avoid low-level file/path checklists; keep concrete paths, identifiers, storage keys, events, APIs, routes, commands, DOM ids, and schemas in `Implementation Notes` when they are real contracts.
- `Implementation Notes`: stack-specific decisions, constants, temporary scaffolding, gotchas, and patterns for implementers. Include contract/wiring details here when later work must preserve them: public methods, events, commands, routes, storage keys, schemas, boot/load order, debug hooks, ownership boundaries, external API shapes, and exact file paths only when the path itself is a contract. Unit tests are an implicit, global obligation governed by the project's testing policy (e.g. `plan/AGENTS.md § Testing Policy`); do not enumerate them here. Mention a boundary module only if it needs a new entry on the untestable-boundary allowlist, and name the e2e that will cover it.
- `E2E Tests`: verification scenarios linked to spec scenarios when possible.
- `Manual Testing (Success Path)`: exact steps a human can run after implementation.
- `Out of Scope for This Phase`: spec-backed or tempting work intentionally deferred.

For new phases, number by scanning existing `phase-N-*.md` files and choosing the next logical number unless the user explicitly asks to revise unshipped phase sequencing.

## Status Updates

For a new project, `plan/status.md` may start empty or be absent. The first `$sdd-plan` pass owns creating it with the chosen or assumed stack, current phase, phase index, architecture decisions, testing strategy, and known open questions.

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
- Deliverables are readable feature or system slices with enough sub-items to make "done" unambiguous.
- Deliverables avoid file checklists and keep concrete paths, identifiers, keys, routes, commands, schemas, and APIs in `Implementation Notes` only when they are durable contracts.
- Product behavior is referenced by spec ID instead of copied wholesale.
- Implementation notes capture enough contract/wiring detail for `$sdd-implement` to start without rediscovering architecture.
- Manual testing steps are executable in the current stack.
- Phase status agrees with `plan/status.md`.
- Completed phase descriptions agree with the current code.
- The plan does not smuggle in constitution non-goals or unapproved spec changes.

## Editing Policy

Before editing:

- **Plan-improvement and Implementation-informed modes:** summarize the intended changes, then edit the relevant `plan/` files directly.
- **Initial-plan mode:** confirm the recommended stack unless the user explicitly delegated the choice; resolve only material clarifications, then create or update `plan/status.md` and phase files.
- **Directed spec-to-plan mode:** resolve only material clarifications; if none remain, state assumptions and edit.

Ask before editing only when one of these remains unresolved:

- Initial-plan stack decision.
- The work would require changing `spec/_constitution.md` or product scope in `spec/`.
- Phase sequencing is ambiguous and several reasonable breakdowns would lead to different implementation paths.
- The requested plan would overwrite shipped phase history.
- The user explicitly asks for a proposal first.

Do not edit implementation code as part of this skill. If code changes are needed after planning, hand off to `$sdd-implement`. If durable product behavior is missing, hand off to `$sdd-specify`.

## Commit

Unless the user asked not to commit, stage only the plan-related files and skill metadata needed for this task, then commit with:

```text
plan: <concise summary>
```

If committing is declined, leave the working tree edited and report changed files plus any remaining open questions.
