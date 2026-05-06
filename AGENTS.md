# AGENTS.md

## Project Overview

An example TODO application built with **Spec-Driven Development (SDD)**: a pragmatic take on spec-driven development in which the spec is stable, the plan is iterative, and the code is regeneratable from the two. This repo exists primarily as a worked example of the SDD workflow; the TODO app itself is the smallest interesting product that exercises the full loop (capture -> list -> toggle -> persist).

The repo contains:

1. **`spec/`** - Stable, engine-agnostic design documents. The source of truth.
2. **`plan/`** - Iterative, stack-specific phase files describing how `spec/` gets built.
3. **`code/`** - The build output. Regeneratable from `spec/` + `plan/`. Absent until Phase 1 produces it.

Current implementation state: `plan/status.md` - read first.
Design pillars and hard constraints: `spec/_constitution.md` - read before proposing changes.

## Three Artifacts

- **`spec/`** — what the finished app must do. Stable, engine-agnostic, source of truth. Never names a framework, runtime, or storage backend.
- **`plan/`** — how we get there, phase by phase. Stack-specific, iterative, may contain temporary scaffolding the spec does not know about.
- **`code/`** — the build output. Regeneratable from `spec/` + `plan/`; periodic delete-and-rebuild is a feature, not a disaster. Absent until Phase 1 produces it.

Read first: `plan/status.md` (current phase, stack) and `spec/_constitution.md` (pillars and hard constraints).

## The Inner Loop

Every phase follows the same four-step habit:

1. **Implement** — pick up the next phase from `plan/` and ship end-to-end.
2. **Review** — run the app, find where reality diverged from the spec.
3. **Ad-hoc fix** — patch `code/` directly. Fast, targeted, off-spec on purpose.
4. **Canonize** — promote the fix from `code/` into `spec/`. Skip this step and the same bug comes back with the next regeneration.

## Working In This Repo

- Before writing any code, read `plan/status.md` to know the current phase and stack.
- Before changing behavior, update the relevant `spec/**/*.spec.md` first. If the change is an ad-hoc fix, land it in `code/` and canonize into `spec/` in a follow-up commit.
- Before starting a new phase, draft its `plan/phase-N-*.md` file. Every phase must end in a human-testable state: the phase's "Manual Testing" section is the acceptance checklist.
- Specs use **EARS** notation for requirements and **Given/When/Then** for behaviors. See `spec/AGENTS.md` for the full format.

## Agent Skills

The source skills live in `.agents/skills/`. Claude discovers the shared skills through `.claude/skills/` symlinks:

- `$sdd-specify` - create or improve `spec/` from user input or existing code.
- `$sdd-plan` - create or improve `plan/` phase files from specs, user input, or existing code.
- `$sdd-implement` - implement an SDD task or next phase.
- `$sdd-canonize` - promote durable lessons from code or documentation changes into `spec/` and `plan/`.

Use these skills when the user explicitly invokes them or asks to follow the SDD specification, planning, implementation, or canonization workflow.

## Non-Goals Of This Example

This is a canonical SDD example, not a production TODO app. It deliberately stays single-user, single-device, offline-only. See `spec/_constitution.md` for the full list.
