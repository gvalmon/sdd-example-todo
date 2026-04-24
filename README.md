# sdd-example-todo

A worked example of **Spec-Driven Development** applied to the canonical TODO app.

```
spec/   # stable — what must be true
plan/   # iterative — how we get there, phase by phase
code/   # regeneratable — produced by the next phase (absent until Phase 1)
```

## Why this repo exists

To demonstrate the SDD inner loop end-to-end on a problem small enough to fit in one sitting: **generate → review → ad-hoc fix → canonize → repeat**. The goal is not a production-grade TODO app; it is a legible example of how `spec/`, `plan/`, and `code/` stay in sync.

## Start here

1. Skim [`docs/SDD.pdf`](./docs/SDD.pdf) — the 10-slide deck describing the Spec-Driven Development approach this repo demonstrates.
2. Read [`CLAUDE.md`](./CLAUDE.md) or [`AGENTS.md`](./AGENTS.md) for the three-artifact model and the inner loop.
3. Read [`spec/_constitution.md`](./spec/_constitution.md) for what this app is and is explicitly not.
4. Read [`plan/status.md`](./plan/status.md) for the current implementation state and the next phase to work on.

## Agent skills

The reusable SDD workflows live in [`skills/`](./skills):

- `$sdd-implement` implements the next phase, an ad-hoc task, or a refactor pass from `spec/` and `plan/`.
- `$sdd-canonize` promotes durable lessons from manual changes back into `spec/` and/or `plan/`.

Discovery shims are checked in for both agent runtimes:

- Claude: `.claude/skills/*` symlinks point to `skills/*`.
- Codex: `.agents/skills/*` symlinks point to `skills/*`, and each skill includes `agents/openai.yaml` metadata for Codex skill lists and chips.

Codex detects skill changes automatically. If the skills do not appear, restart Codex.

## Tech stack

Vanilla HTML + CSS + JavaScript. No build step. `localStorage` for persistence. A single `index.html` that runs either opened directly (`file://`) or served from any static host.

The stack is deliberately minimal so the mapping from spec line to code line is as direct as possible. Larger projects would use the same SDD structure with a heavier stack.

## The workflow in one diagram

```
 ┌──────────┐   implement   ┌──────────┐   review   ┌──────────┐
 │  plan/   │ ────────────▶ │  code/   │ ─────────▶ │  humans  │
 └──────────┘               └──────────┘            └──────────┘
       ▲                         │                        │
       │                         │ ad-hoc fix             │
       │       canonize          ▼                        │
 ┌──────────┐ ◀─────────── ┌──────────┐                   │
 │  spec/   │              │  code/'  │                   │
 └──────────┘              └──────────┘ ◀─────────────────┘
```

`spec/` is where intent lives. `plan/` is where stack-specific decisions live. `code/` is where bugs get fixed quickly — and then canonized back into `spec/` so the fix survives the next regeneration.
