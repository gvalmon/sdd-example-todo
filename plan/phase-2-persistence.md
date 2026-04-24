# Phase 2 — localStorage Persistence

**Status**: Done
**Specs**: SPEC-003-PERSISTENCE (Persistence)

## Goal

Make the Phase 1 app durable across reloads. Every action that SPEC-003-PERSISTENCE requires to persist writes to `localStorage` before the next paint; every boot restores the last-persisted state. The Phase 1 empty-state disclaimer about "refreshing loses your list" is removed by this phase. No other user-visible change.

### Deliverables

- `code/storage.js` — thin wrapper around `localStorage` with `load()` and `save(state)` functions. Owns the storage key and schema version.
- Changes to `code/app.js` — on boot, `storage.load()` seeds state; after any state transition, `storage.save(state)` is called.
- Changes to `code/index.html` — remove the Phase 1 empty-state disclaimer line (see Phase 1 Implementation Notes).
- Inline, non-blocking notice element in the header region for the "saved data could not be loaded" message (SPEC-003-PERSISTENCE scenario: corrupt payload).

### Integration Points

- Storage key: `sdd-example-todo:v1`. Namespace prefix keeps us out of anyone else's way if the page ends up on a shared origin.
- Payload shape: `{ "schema_version": 1, "state": <ListState> }`. `ListState` is defined in `spec/tracker/list-management.api.v1.yaml`.
- Corrupt-payload handling: if `JSON.parse` throws or the shape doesn't match, boot with empty state AND leave the raw string in storage untouched (the spec requires not overwriting the corrupt payload until the user makes a change). The notice element surfaces the message.
- `save()` is called synchronously at the tail of every state transition in `app.js`. No debouncing — SPEC-003-PERSISTENCE § Open Questions currently leans toward synchronous writes.

## Implementation Notes

- **Schema versioning**: the `schema_version` field is written even though there is only one version so far. This lets a future migration distinguish v1 from v2 without heuristics. Cheap now, expensive later.
- **Quota handling**: `localStorage.setItem` can throw `QuotaExceededError`. If it does, surface the same non-blocking notice ("could not save changes — storage full") and keep the in-memory state live. The user at least keeps the session. Not covered by SPEC-003-PERSISTENCE yet — if we ship this, canonize into SPEC-003-PERSISTENCE as a new requirement.
- **First-run path**: `storage.load()` returns `{ state: freshEmptyState(), error: null }` when no key exists. App boots with empty state and `all` filter (SPEC-003-PERSISTENCE scenario: empty first run).
- **Validation on load**: shallow shape check only. If the parsed payload has `schema_version === 1` and `state` has the three required top-level fields, trust it. Heavy per-field validation is overkill for a local single-user app and would make canonizing future spec changes painful.
- **No networks**: repeat SPEC-003-PERSISTENCE's network invariant in a code comment next to `storage.save()` so the next refactor doesn't silently introduce a fetch.

## E2E Tests

None. Continue manual verification — a persistence feature is well-suited to the SDD "run it and refresh" ritual. Phase 3 re-evaluates.

## Manual Testing (Success Path)

1. Open `code/index.html`. Complete Phase 1's manual testing path 1–14 (but skip step 15).
2. **Refresh the page.** The remaining todos (`Buy oat milk`, plus whatever is left after step 14) are still there, in the same order, with the same completion states.
3. Change the filter to "Completed". Refresh. Filter is still "Completed".
4. In DevTools, set `localStorage.getItem('sdd-example-todo:v1')` to a string like `"not json at all"`. Refresh. The app boots empty, the "saved data could not be loaded" notice appears, and inspecting storage shows the corrupt payload is still there.
5. Add a new todo. The notice clears on next paint, and storage now contains a well-formed payload.
6. Clear `localStorage` entirely. Refresh. The app boots empty with no notice.

## Out of Scope for This Phase

- Migrations (SPEC-003-PERSISTENCE § Open Questions). Addressed if/when a schema v2 arrives.
- IndexedDB or backend storage. Not planned; `localStorage` meets the SPEC-003-PERSISTENCE contract.
- Export / import JSON. Constitution § Non-Goals permits a simple JSON dump but does not require one — defer until there's a user asking for it.
