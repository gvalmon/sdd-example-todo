# Project Status

## Current Phase

**Pre-Phase-1.** No application code written yet. `code/` does not exist; it will be created when Phase 1 starts.

## Stack

- **Runtime**: Browser. Single static bundle (`index.html` + sibling `.js` + `.css`). No build step.
- **Language**: Vanilla JavaScript (ES2022+). No framework for Phase 1. A future phase may introduce one if complexity warrants.
- **Persistence**: Phase 1 is in-memory only. Phase 2 migrates to `localStorage`. See SPEC-003-PERSISTENCE for the contract.
- **Package manager**: None for Phase 1. Introduced only if a phase adopts a tool that needs it.

## Architecture Decisions

None formalized yet. The first concrete decisions land with Phase 1 (module layout, id strategy, render approach) and are captured in `phase-1-mvp.md`.

Design direction: minimal, legible code. The SDD point of this repo is that someone can open any `code/` file, compare it to the relevant `.spec.md`, and trace the mapping without a framework's abstractions in the way.

## Art Direction

System fonts, minimal chrome, one-column layout. Respects `prefers-color-scheme`. No custom icon set for Phase 1 — Unicode characters or inline SVG only.

## Phase Index

<!--
  Status values:
    done        — phase complete, code/ reflects its deliverables
    in progress — currently being implemented
    draft       — scoped but not yet started
-->

- [`phase-1-mvp.md`](./phase-1-mvp.md) — in-memory MVP: add / toggle / edit / delete / filter / clear-completed. **draft, next up.**
- [`phase-2-persistence.md`](./phase-2-persistence.md) — localStorage; list + filter survive reload. **draft.**
- [`phase-3-polish.md`](./phase-3-polish.md) — keyboard completeness, bulk toggle-all, a11y pass, empty states. **draft.**

## Known Deviations

None yet. Ad-hoc fixes that haven't been canonized back into `spec/` would be listed here with the owning commit hash, so canonization doesn't fall off the radar.
