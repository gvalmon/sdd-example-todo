# Project Status

## Current Phase

**Phase 1 complete.** `code/` contains the in-memory MVP: add / toggle / edit / delete / filter / clear-completed. State intentionally resets on refresh until Phase 2 adds persistence.

## Stack

- **Runtime**: Browser. Single static bundle (`index.html` + sibling `.js` + `.css`). No build step.
- **Language**: Vanilla JavaScript (ES2022+). No framework for Phase 1. A future phase may introduce one if complexity warrants.
- **Persistence**: Phase 1 is in-memory only. Phase 2 migrates to `localStorage`. See SPEC-003-PERSISTENCE for the contract.
- **Package manager**: None for Phase 1. Introduced only if a phase adopts a tool that needs it.

## Architecture Decisions

- Phase 1 ships as three static browser siblings plus CSS: `code/index.html`, `code/app.js`, `code/state.js`, and `code/styles.css`. There is no build step, package manager, or server.
- `code/state.js` is the pure list-state boundary. It exports `add`, `toggle`, `toggleAll`, `editTitle`, `remove`, `clearCompleted`, `setFilter`, and `visibleTodos` on `globalThis.todoState`; it owns immutable state transitions and active-count recalculation. Classic scripts are used so `code/index.html` works when opened directly from disk.
- `code/app.js` owns the single in-memory `state` variable, DOM event delegation, browser-generated ids/timestamps for new todos, and full re-rendering after mutations.
- Todo ids use `crypto.randomUUID()` at the app boundary. Created todos store ISO 8601 timestamps.
- Filter mode lives in state, not the URL. Changing filters does not mutate the todo list.
- Edit mode is in-place: double-click a title to swap it for an input; Enter and blur commit; Escape cancels.
- Empty-state copy explicitly names the Phase 1 persistence gap and should be removed or revised when Phase 2 lands.

Design direction remains minimal, legible code. The SDD point of this repo is that someone can open any `code/` file, compare it to the relevant `.spec.md`, and trace the mapping without a framework's abstractions in the way.

## Art Direction

System fonts, minimal chrome, one-column layout. Respects `prefers-color-scheme`. No custom icon set for Phase 1 — Unicode characters or inline SVG only.

## Phase Index

<!--
  Status values:
    done        — phase complete, code/ reflects its deliverables
    in progress — currently being implemented
    draft       — scoped but not yet started
-->

- [`phase-1-mvp.md`](./phase-1-mvp.md) — in-memory MVP: add / toggle / edit / delete / filter / clear-completed. **done.**
- [`phase-2-persistence.md`](./phase-2-persistence.md) — localStorage; list + filter survive reload. **draft.**
- [`phase-3-polish.md`](./phase-3-polish.md) — keyboard completeness, bulk toggle-all, a11y pass, empty states. **draft.**

## Known Deviations

None yet. Ad-hoc fixes that haven't been canonized back into `spec/` would be listed here with the owning commit hash, so canonization doesn't fall off the radar.
