# Phase 1 — In-Memory MVP

**Status**: Done
**Specs**: SPEC-001-TODO-MODEL (Todo Model), SPEC-002-LIST-MANAGEMENT (List Management), SPEC-004-INTERFACE (User Interface)

## Goal

Ship a runnable TODO app in a single `code/` directory that demonstrates every operation in SPEC-002-LIST-MANAGEMENT against an in-memory list, rendered per SPEC-004-INTERFACE. Open `code/index.html` and the app works: add, toggle, edit, delete, filter, clear-completed. State does not survive reload — that gap is Phase 2's problem and is explicitly called out in the empty-state copy during this phase.

### Deliverables

- `code/index.html` — document shell, three regions (input, list, footer) per SPEC-004-INTERFACE § Layout.
- `code/app.js` — application entry. Wires the DOM, owns the in-memory `ListState`, dispatches operations, re-renders on change.
- `code/state.js` — pure state module. Exports operations `add`, `toggle`, `editTitle`, `remove`, `clearCompleted`, `setFilter`, `visibleTodos` (see SPEC-002-LIST-MANAGEMENT § Requirements). No DOM references; no side effects except returning new state.
- `code/styles.css` — minimal styling. System fonts. `prefers-color-scheme` honored.
- No tests in this phase; verification is manual (see below). Phase 3 will consider a test harness once the app surface is stable.

### Integration Points

- Root element: `<main id="app">` with children `#todo-input`, `#todo-list`, `#todo-footer`.
- `app.js` holds a single `state` variable; mutations go through `state.js` pure functions that return the new state; `app.js` then re-renders.
- Event wiring (IDs are stable — Phase 2 and 3 reuse them):
  - `#todo-input` → `keydown` → Enter adds a todo.
  - `#todo-list` → delegated `click` on `.todo-toggle` / `.todo-delete` → toggle / remove.
  - `#todo-list` → delegated `dblclick` on `.todo-title` → enter edit mode.
  - `#todo-footer .filter-btn` → `click` → set filter.
  - `#todo-footer #clear-completed` → `click` → clear completed.
- Todo id strategy: `crypto.randomUUID()`. Locked here; future phases keep it unless they explicitly migrate.

## Implementation Notes

- **Render strategy**: full re-render of `#todo-list` on any state change. Acceptable for Phase 1 because N is small in practice and the re-render fits easily in one frame. Phase 3 revisits if measurements show it misses the 1,000-todo bar (SPEC-_constitution § Hard Constraints).
- **Edit mode**: implemented in-place by swapping the `.todo-title` span for an `<input>` with the current title, focused on mount. Enter commits; Escape cancels; blur commits (matches most todo apps' muscle memory — if user testing finds this surprising, canonize into SPEC-004-INTERFACE).
- **Empty-state copy**: for this phase's empty states, include a line noting "Nothing is saved yet — refreshing loses your list. Persistence arrives in Phase 2." Remove when Phase 2 lands.
- **Filter**: lives on `state`, not in the URL. Phase 3 may revisit.
- **Toggle-all**: SPEC-002-LIST-MANAGEMENT requires a toggle-all operation, but this phase does *not* expose a UI control for it. The operation lives in `state.js` and is reachable from the console; a visible control lands in Phase 3. Listed in "Out of Scope" below so reviewers don't flag it.
- **Accessibility**: hit the baseline (semantic `<button>`, `<input type="checkbox">`, labels). Thorough focus management is Phase 3.

## E2E Tests

None. Verification is manual for this phase — see below. Rationale: automated E2E tooling for a single static page is heavier than the phase warrants; Phase 3 will decide whether to adopt Playwright or equivalent once the surface has settled.

## Manual Testing (Success Path)

1. Open `code/index.html` directly in a browser (double-click, or `file://` URL).
2. The input is focused automatically.
3. Type `Buy milk`, press Enter. Item appears. Input clears.
4. Type `Call dentist`, press Enter. Second item appears below the first.
5. Type `Return library book`, press Enter. Third item.
6. Click the checkbox on `Call dentist`. The title renders with strike-through. Footer count drops from "3 items left" to "2 items left".
7. Click the "Active" filter. Only `Buy milk` and `Return library book` are visible. Count is "2 items left".
8. Click "Completed". Only `Call dentist` is visible.
9. Click "All". All three are visible.
10. Double-click `Buy milk`'s title. It becomes an editable input pre-filled with `Buy milk`. Edit to `Buy oat milk`, press Enter. Title updates.
11. Double-click `Return library book`, edit to `(whitespace only)`, press Enter. Title stays `Return library book` (SPEC-001-TODO-MODEL rejection).
12. Double-click `Buy oat milk`, type garbage, press Escape. Title stays `Buy oat milk`.
13. Click the delete affordance on `Return library book`. Row disappears. Count updates.
14. Click "clear completed". `Call dentist` disappears. Clear-completed control hides.
15. **Refresh the page.** The list is empty. This is the expected Phase 1 gap; Phase 2 closes it.

## Out of Scope for This Phase

- Persistence (SPEC-003-PERSISTENCE). Phase 2.
- Visible toggle-all control (part of SPEC-002-LIST-MANAGEMENT). Phase 3.
- Keyboard filter shortcuts `1`/`2`/`3` (SPEC-004-INTERFACE § Keyboard navigation). Phase 3.
- Keyboard Space-to-toggle / Delete-to-remove on focused rows. Phase 3.
- Thorough ARIA and focus-management pass. Phase 3.
