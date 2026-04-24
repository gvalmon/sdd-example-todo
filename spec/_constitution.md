# Constitution

The foundational design document for the SDD example TODO app. Every spec and implementation decision must remain consistent with this file. When a new spec conflicts with the constitution, the constitution wins — update it deliberately, don't drift around it.

## Product Identity

A single-user, single-device, offline-first TODO list. One person, one browser, one list. The app exists to capture small intents ("call the dentist", "return the library book") and to let the user mark them done without ceremony. It runs entirely in the browser, stores its state locally, and works without a network.

The TODO app is also the subject of this repo's SDD demonstration. Keeping the product tiny keeps the spec → plan → code mapping legible. Features that would make the product more useful but the example less legible are explicitly out of scope.

## Design Pillars

1. **Capture friction is zero.** Adding a todo must never cost more than one keystroke past typing. Click the input, type, press Enter. No modals, no categorization step, no required metadata.
2. **State never surprises.** Anything visible at the moment of reload matches the state at the last user action. No unexplained disappearances, no stale data, no "save" button. If the user did it, it is durable.
3. **Offline is the default.** The app makes no network assumptions. It does not call out. It does not require an account. It works the same on an airplane as on a fiber connection.
4. **Keyboard-first, mouse-fine.** Every action has a keyboard path. The mouse works, but it is the alternative, not the primary. A user who never leaves the keyboard should be able to do everything the app supports.

## Non-Goals

These are explicitly **out of scope**. Do not add specs for them.

- **Multi-user / sync / accounts.** No login, no server, no cross-device sync. One user, one browser, one list.
- **Due dates, reminders, recurring tasks, subtasks.** The todo model is intentionally flat: a title, a completed flag, and timestamps. Richer task models belong in a different app.
- **Mobile apps.** Responsive web is fine; native mobile is not in scope.
- **Import / export beyond JSON.** A simple JSON dump/restore is acceptable if a phase wants it. CSV, Todoist import, etc., are not.
- **Categorization, tags, projects, priorities.** One flat list. Filters (all / active / completed) are the only segmentation.
- **Analytics, telemetry, error reporting.** Nothing the app does reaches the network.

## Hard Constraints

- **Runtime**: a single static bundle (for Phase 1, a single `index.html` + sibling `.js` / `.css`). Opens directly from the filesystem (`file://`) or from any static host. No server.
- **Storage**: browser-local only. Phase 1 keeps state in memory; Phase 2 migrates to `localStorage`. A real database is explicitly deferred and may never arrive.
- **Browsers**: current evergreen Chrome, Firefox, Safari. No polyfills, no build-time transpilation for Phase 1.
- **Accessibility baseline**: all actions reachable by keyboard; semantic HTML for screen readers; color is never the sole signal of state. A thorough a11y pass is Phase 3's job.
- **Performance**: must stay snappy with ≥ 1,000 todos in the list. Rendering strategies that assume a small N (full re-render on every keystroke without care) are acceptable only if they measurably meet that bar.

## Governance

- `_constitution.md` is updated through deliberate edits. Changes should note *why* in the commit message.
- Specs must declare dependencies in their frontmatter. Circular dependencies are not allowed.
- When a spec's behavior contradicts the constitution, the spec is wrong by default. Reconcile explicitly — either amend the spec or amend the constitution with rationale.
- New non-goals may be added when a feature request gets declined. Recording the non-goal is how the decision survives the next person who asks.
