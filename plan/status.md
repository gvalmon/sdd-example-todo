# Project Status

## Current Phase

**Phase 2 complete.** `code/` persists list state and filter to `localStorage` under the key `sdd-example-todo:v1`. Every mutation and filter change writes synchronously; a non-blocking notice surfaces corrupt-payload and quota errors.

## Stack

- **Runtime**: Browser. Single static bundle (`index.html` + sibling `.js` + `.css`). No build step.
- **Language**: Vanilla JavaScript (ES2022+). No framework for Phase 1. A future phase may introduce one if complexity warrants.
- **Persistence**: Phase 1 is in-memory only. Phase 2 migrates to `localStorage`. See SPEC-003-PERSISTENCE for the contract.
- **Package manager**: None for Phase 1. Introduced only if a phase adopts a tool that needs it.

## Architecture Decisions

- The app ships as four static browser siblings plus CSS: `code/index.html`, `code/app.js`, `code/state.js`, `code/storage.js`, and `code/styles.css`. There is no build step, package manager, or server.
- `code/state.js` is the pure list-state boundary. It exports `add`, `toggle`, `toggleAll`, `editTitle`, `remove`, `clearCompleted`, `setFilter`, and `visibleTodos` on `globalThis.todoState`; it owns immutable state transitions and active-count recalculation. Classic scripts are used so `code/index.html` works when opened directly from disk.
- `code/storage.js` is the `localStorage` boundary and exposes `load` / `save` on `globalThis.todoStorage`. It owns the storage key `sdd-example-todo:v1` and schema version `1`. `state.js` stays pure; only `app.js` imports storage.
- `code/app.js` owns the single in-memory `state` variable, DOM event delegation, browser-generated ids/timestamps for new todos, and full re-rendering after mutations. On boot it seeds `state` from `todoStorage.load()`; after every accepted transition it calls `todoStorage.save(state)` synchronously and surfaces any error via the `#storage-notice` element.
- Todo ids use `crypto.randomUUID()` at the app boundary. Created todos store ISO 8601 timestamps.
- Filter mode lives in state, not the URL. Changing filters does not mutate the todo list, but still persists.
- Edit mode is in-place: double-click a title to swap it for an input; Enter and blur commit; Escape cancels.

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
- [`phase-2-persistence.md`](./phase-2-persistence.md) — localStorage; list + filter survive reload. **done.**
- [`phase-3-polish.md`](./phase-3-polish.md) — keyboard completeness, bulk toggle-all, a11y pass, empty states. **draft.**

## Known Deviations

None yet. Ad-hoc fixes that haven't been canonized back into `spec/` would be listed here with the owning commit hash, so canonization doesn't fall off the radar.
