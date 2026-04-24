# Phase 3 — Keyboard, Bulk Actions, Accessibility

**Status**: Not started
**Specs**: SPEC-002-LIST-MANAGEMENT (List Management), SPEC-004-INTERFACE (User Interface)

## Goal

Close the gaps that Phase 1 deferred to keep the MVP small: a visible toggle-all control, full keyboard navigation (Space / Delete / `1`/`2`/`3`), an accessibility pass (ARIA, focus management, announcement of list changes), and polished empty states. After this phase, every requirement in SPEC-002-LIST-MANAGEMENT and SPEC-004-INTERFACE is implemented — the app matches its spec.

### Deliverables

- `code/keyboard.js` — centralized keyboard-handler registration. Owns the `keydown` listeners for filter shortcuts and focused-row shortcuts.
- Changes to `code/app.js` — wire `keyboard.js`, track which row has keyboard focus, route Space/Delete to the right operations.
- Changes to `code/index.html` — add visible toggle-all control (checkbox or button at the head of the list region, per SPEC-002-LIST-MANAGEMENT § Mutation); add visually-hidden `<h1>` / landmarks for screen readers; add `aria-live="polite"` region to announce list changes.
- Changes to `code/styles.css` — visible focus indicators on every focusable element (system-default `:focus-visible` is acceptable, but must be confirmed visible in both color schemes); empty-state styling for the three empty variants (`all` / `active` / `completed`).

### Integration Points

- Toggle-all control DOM: `<input type="checkbox" id="toggle-all">` placed just above `#todo-list`, labeled "Mark all as done" / "Mark all as open" depending on state.
- Filter shortcuts only fire when `document.activeElement` is not a text input — prevents hijacking typing.
- `aria-live="polite"` region announces phrases like "Added 'Buy milk'", "Deleted 'Call dentist'", "3 completed todos cleared". Keep the phrases short.
- Focus management during edit-mode exit: when Escape cancels or Enter commits, focus returns to the same row's checkbox. Prevents focus loss to `<body>`.

## Implementation Notes

- **Row focus model**: each todo row gets `tabindex="0"` on an outer `<li>` element so Tab moves through rows predictably. The checkbox and delete button stay focusable as children.
- **Delete key**: bind to both `Delete` and `Backspace` per SPEC-004-INTERFACE. Guard against firing when the active element is an input (edit mode, or input row).
- **Toggle-all behavior**: flip depends on whether any todo is currently open (SPEC-002-LIST-MANAGEMENT scenario). The control's checked state reflects "all completed" purely as a visual — clicking it always runs the full flip operation.
- **Screen reader announcements**: rate-limit or coalesce when bulk actions fire. Clearing five completed todos should announce "5 completed todos cleared" once, not five delete announcements.
- **Re-render performance**: if measurement shows the full re-render missing the 1,000-todo bar, switch `#todo-list` to a keyed diff (add `data-id` on each row, only swap in/out the rows that changed). Do not adopt a framework for this — the whole point is the legibility of small vanilla code.
- **prefers-reduced-motion**: if Phase 3 adds any transitions (e.g. fade on delete), respect `prefers-reduced-motion: reduce`.

## E2E Tests

Defer decision to the start of this phase. Two candidates:
- **Playwright** — adds a node dependency but gives the most legible SDD→test mapping.
- **In-browser test harness** — a second HTML page that drives the app via DOM events. Zero dependencies; slightly harder to assert on accessibility.

If we add tests, mirror the SPEC-004-INTERFACE scenarios 1:1 and link each test name to the scenario name.

## Manual Testing (Success Path)

1. Complete Phase 2's manual path first so there's a populated list in storage.
2. Click inside the input, then press Tab. Focus moves to the first todo row (visible focus ring).
3. Press Space. The first todo's completion toggles. Screen reader announces the title and new state.
4. Press Delete. The same todo is removed. Focus lands on the next row.
5. Press `2`. Filter switches to Active. Press `3`. Filter switches to Completed. Press `1`. Filter switches to All.
6. Click the input, type "x". The `1`/`2`/`3` keys type their digits into the input instead of changing filters. Delete the digits.
7. Click the toggle-all control. Every todo becomes completed. Click again. Every todo becomes open. Announcement reads once per bulk action.
8. Tab through the whole UI in one sweep — input, toggle-all, each row (and the controls within it), each filter button, clear-completed. Every stop has a visible focus indicator.
9. Switch OS color scheme between light and dark. Focus indicators remain visible in both.
10. Apply the three empty-state cases and confirm each has distinct, appropriate copy: clear the list (`all` empty), mark everything completed and switch to `active` (`active` empty), mark everything open and switch to `completed` (`completed` empty).

## Out of Scope for This Phase

- Drag-to-reorder (SPEC-002-LIST-MANAGEMENT § Open Questions).
- Mobile-specific gestures. Constitution § Non-Goals.
- Any remote / multi-user work. Constitution § Non-Goals.
- Explicit performance benchmarks against the 1,000-todo bar — only run them if subjective snap feels off.
