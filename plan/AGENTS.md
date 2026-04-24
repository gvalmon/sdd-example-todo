# Plan Directory

The **implementation-specific** layer of the SDD workflow. `spec/` defines *what* the app does (stack-agnostic); `plan/` defines *how* to build it for the current stack, phase by phase.

- **`status.md`** - Current project state, stack choice, architecture decisions. **Read first** for any implementation work.
- **`phase-N-*.md`** - Phase files. Completed phases summarize what was shipped; the next phase carries detailed implementation notes.
- **`_example_phase.md`** - Phase file template.

Specs in `spec/` are the source of truth for product design. Phase files translate specs into concrete implementation, adding stack-specific architecture, temporary scaffolding, and incremental delivery.

## Phase Shape

Every phase must end in a **runnable, human-testable** state. The **Manual Testing (Success Path)** section is the checklist a human follows to verify the phase's capability end-to-end. Temporary scaffolding is fine; an unreachable or broken build is not.

## Section Rules

- **Deliverables** list implementation artifacts, not product behavior. Use `(see SPEC-NNN-SLUG)` or `(see SPEC-NNN-SLUG § Requirements)` to reference spec content instead of restating it.
- **Integration Points** names concrete wiring: module imports, DOM element ids, event-handler names, storage keys, state-shape changes.
- **Implementation Notes** carries code-level decisions and constants, rendering approach, temporary-scaffolding rationale, and patterns to follow.
- **E2E Tests** and **Manual Testing** describe verification, not product design.

## Spec Vs Plan Boundary

Phase files must not restate spec content. Use spec references instead.

| Belongs in `spec/` | Belongs in `plan/` |
|---|---|
| User-visible behavior | Framework / runtime choice |
| Data contracts | Storage mechanism |
| Operations and their effects | Module boundaries, file layout, event wiring |
| Invariants | Validation implementation |
| Final-vision UX | Temporary scaffolding and placeholder UI |
| Accessibility requirements | Concrete ARIA attributes and focus-management implementation |
| Performance bar | How to meet it |

## Phase Numbering

Flat: `phase-N-kebab-summary.md`, starting at `phase-1-*`. New phases get appended. A phase that gets skipped or merged is deleted; renumbering is allowed only when no phase has shipped yet.

Status values inside a phase file: `Not started`, `In progress`, `Complete`. `plan/status.md` is the index across phases.
