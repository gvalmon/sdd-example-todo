---
name: sdd-canonize
description: Canonize lessons from manual implementation or documentation changes back into SDD spec/ and plan/ files. Use when the user invokes $sdd-canonize, asks to canonize ad-hoc fixes, or update SDD specs/plans from recent code changes.
---

# SDD Canonize

Analyze recent manual changes and promote durable product or implementation nuance back into `spec/` and/or `plan/`.

Invocation input is optional. It may be a commit range, a single commit SHA, or a plain-English description of the changes to inspect. If no input is provided, analyze all `manual:` commits since the last non-`manual:` commit.

## Philosophy

This project uses **Spec-Driven Development**: spec -> plan -> implementation. Manual changes sometimes introduce important nuance: behavior details, edge cases, UX decisions, or implementation constraints that the spec and plan do not yet capture. Canonization preserves that knowledge so future regeneration does not lose it.

**Do not over-fit.** Only canonize changes that represent genuine design decisions, behavioral nuance, or durable implementation direction. Skip:

- Pure implementation details such as variable names, file paths, and mechanical refactors
- Temporary workarounds or scaffolding
- Code-level fixes that do not affect user-visible behavior, data contracts, or durable system design
- Details the existing spec or plan already covers adequately

## Workflow

### 1. Identify the changes

Determine which commits or working-tree changes to analyze:

- If the input is a commit range, analyze that range.
- If the input is a single commit SHA, analyze that commit.
- If the input is descriptive text, inspect recent history and the working tree to find matching changes.
- If no input is provided, find all `manual:` commits since the last non-`manual:` commit.

Use `git log`, `git diff`, and `git show` as needed to understand the full change.

### 2. Understand the intent

Read the changed files. For each meaningful change, identify:

- **What** changed: behavior, UX, data, architecture, validation, persistence, accessibility, or configuration
- **Why** it changed: bug fix, design improvement, missing case, implementation constraint, or clarified scope
- **Where** the durable knowledge belongs: one or more specs, one or more phase plans, or `plan/status.md`

Cross-reference the relevant `spec/` and `plan/` files before proposing edits.

### 3. Draft minimal updates

For each spec or plan file that needs updating, draft the specific additions or modifications.

Rules:

- `spec/` is implementation-agnostic. Describe user-visible behavior, state, invariants, and contracts.
- `spec/` describes the final product vision, not temporary scaffolding.
- `plan/` is implementation-specific. It may reference stack choices, file layout, storage keys, module boundaries, and migration steps.
- `plan/status.md` may need updates when the current architecture, phase state, or known deviations change.
- Preserve local document style, including EARS notation and Given/When/Then scenarios where already used.
- Keep additions focused. Canonize only what would matter after a delete-and-rebuild cycle.

### 4. Present the proposal

Before editing, present a concise proposal and wait for user confirmation unless the user has explicitly asked to apply the updates without another checkpoint.

Use this shape:

```md
## SDD Canonize Proposal

### Source
<commit(s), diff, or description analyzed>

### Proposed Updates

#### spec/path-or-plan/path.md
- <what will change and why>

### Skipped
- <change that does not need canonization and why>
```

If the user says no, stop. If the user asks for changes, revise the proposal before editing.

### 5. Apply changes

After confirmation, edit only the agreed `spec/` and/or `plan/` files. Do not modify implementation code as part of canonization unless the user explicitly expands the scope.

### 6. Commit

Stage only the canonization edits and commit with this prefix:

```text
canonize: <concise summary>
```

If the environment or user does not allow committing, leave the files edited and clearly report what changed.
