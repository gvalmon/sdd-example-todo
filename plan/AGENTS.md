# Plan Directory

The **implementation-specific** layer of SDD. `spec/` defines *what* (stack-agnostic); `plan/` defines *how*, phase by phase.

- **`status.md`** — current state, stack, architecture decisions, test tooling. **Read first.**
- **`phase-N-*.md`** — phase files. Completed phases summarize what shipped; the next phase carries the detail.
- **`_example_phase.md`** — template.

## Phase Shape

Every phase ends in a **runnable, human-testable** state. The **Manual Testing (Success Path)** section is the human acceptance checklist. Temporary scaffolding is fine; an unreachable build or a phase missing its E2E Tests and Manual Testing sections is not.

## Section Rules

- **Deliverables** — implementation responsibilities (modules, UI regions, data shapes). Name the *responsibility*, not the file path. Reference spec content with `(see SPEC-NNN-SLUG § Section)` instead of restating it.
- **Integration Points** — concrete wiring: imports, DOM ids, event names, storage keys, state-shape changes. The right place for specific paths and identifiers.
- **Implementation Notes** — code-level decisions, constants, rendering approach, scaffolding rationale, gotchas.
- **E2E Tests** and **Manual Testing** — mandatory verification sections. Unit tests are governed globally (see § Testing Policy) and are not enumerated per phase.

## Testing Policy

Unit tests are an implicit, global obligation — phase plans do not list them.

- **Full line and branch coverage** on every module not on the untestable-boundary allowlist. The implementer writes whatever specs are needed to satisfy the project's coverage gate (see `plan/status.md § Testing`).
- **Pure logic must not hide behind the allowlist.** Math, state machines, reducers, serializers, hit-tests, debouncers, catalog loaders are unit-testable even when they live alongside a non-testable runtime (renderer, physics engine, audio, native bridge). Extract them so the boundary stays small.
- **Untestable boundary allowlist** lives in the project's coverage config. Every entry carries an inline comment justifying the exclusion and naming the e2e spec that covers it. The implementer maintains it; the planner does not pre-list entries.
- **E2E tests** cover the phase's spec scenarios plus a smoke spec proving the phase's primary capability is reachable. Each e2e names the spec section it verifies. Phase plans enumerate these in the **E2E Tests** section.

## Spec Vs Plan Boundary

Phase files reference spec content by ID; they do not restate it. Rule of thumb: `spec/` owns *what* (behavior, contracts, invariants, UX, accessibility, performance bar); `plan/` owns *how* (framework, storage, module boundaries, wiring, scaffolding, concrete attributes, performance tactics).

## Phase Numbering

Flat: `phase-N-kebab-summary.md`, starting at `phase-1-*`. New phases append. Renumbering is allowed only while no phase has shipped. Status values: `Not started`, `In progress`, `Complete`. `plan/status.md` is the cross-phase index.
