---
name: sdd-implement
description: Implement features in plan/ using Spec-Driven Development approach. Use when the user invokes $sdd-implement, asks to implement the next SDD phase.
---

# SDD Implement

Implement a task from `plan/` and `spec/` using the SDD loop: understand the source documents, ship a human-testable increment, review against the spec, then update the plan state.

Invocation input is optional. It may begin with a mode:

| First word | Mode | Work prompt |
|---|---|---|
| `adhoc` | adhoc | Remainder of the input after `adhoc` |
| `manual` | adhoc | Alias for `adhoc`; remainder of the input after `manual` |
| `next-phase` | next-phase | Auto-detected from `plan/status.md` |
| `next` | next-phase | Alias for `next-phase`; auto-detected from `plan/status.md` |
| `refactor` | refactor | Refactor workflow below |
| anything else | adhoc | Entire input as the work prompt |

## Preparation

Before delegating or editing:

1. Read the repo's top-level project guidance, `plan/status.md`, and `spec/_constitution.md`.
2. Determine the mode from the invocation input.
3. Prepare a concise work prompt with the relevant phase, specs, constraints, and acceptance checks.

### Adhoc mode

Use the invocation input as the work prompt. Read any `spec/` or `plan/` files it references before implementing.

### Next-phase mode

1. Read `plan/status.md`.
2. Find the first phase listed as draft or in progress, preferring the one explicitly marked next.
3. Read the corresponding `plan/phase-*.md` file.
4. Read every spec referenced by that phase.
5. Use the phase plan and referenced specs as the work prompt.
6. Include updating `plan/status.md` as part of the completion criteria.

### Refactor mode

Use this ordered checklist as the work prompt:

1. Run the relevant existing tests to establish the baseline.
2. Fix failing tests if they reflect unintended regressions.
3. Review code for maintainability issues: dead code, duplication, unclear boundaries, or drift from patterns recorded in `plan/status.md`.
4. Apply targeted refactors without changing product behavior.
5. Add missing tests for already-implemented behavior when the gap is material.
6. Run the relevant tests again and report the result.

## Delegation Pipeline

Run the work as a pipeline: implementer first, then code review and design review in parallel.
Choose one execution path below: **orchestrated team** when team tools are available, otherwise **plain subagents**.
Do not perform the implementer, reviewer, or designer roles yourself; the separation is the point.

### Preflight: choose the delegation path

Before any editing or delegation, complete this check:

1. If `TeamCreate` and `SendMessage` are available, use the **Orchestrated team path**.
2. Otherwise, use the **Plain subagents path**.
3. State the chosen path in one user-visible line before delegating: `Delegation path: orchestrated` or `Delegation path: plain subagents`.

Task size is never a reason to skip this check. A small task still goes through one of the two paths.

### Roles

These role definitions are shared by both paths.

#### Agent 1: Implementer

The implementer owns code and documentation edits for the task.

Responsibilities:

- Read the prepared work prompt, relevant `plan/` files, relevant `spec/` files, and `spec/_constitution.md`.
- Explain the intended implementation approach before editing.
- Implement the smallest complete increment that satisfies the phase or adhoc task.
- Keep behavior aligned with `spec/`; put stack-specific details in `plan/`.
- Add or update tests when the task changes behavior or when the phase requires them.
- Run the relevant verification commands.
- Update `plan/status.md` when completing a phase or recording durable architecture decisions.
- Summarize changed files, tests run, and any residual risks.
- Include a **Tooling friction** note at the end of the summary, reporting genuine pain points only:
  - A tool that was slow or awkward enough to cost real time (not a one-off annoyance).
  - A script, command, or helper that was missing and had to be worked around manually.
  - A manual step that recurred enough to deserve automation.
  If nothing material came up, write `Tooling friction: none.` Do not invent items.

Commit after review, not before.

#### Agent 2: Reviewer

The reviewer is read-only and acts as the code quality, maintainability, and architecture gate.

Responsibilities:

- Read the work prompt, changed files, relevant `plan/` files, relevant `spec/` files, and `plan/status.md`.
- Review code quality: clarity, naming, simplicity, local patterns, dead code, duplication, and brittle logic.
- Review maintainability: ownership boundaries, coupling, testability, minimal scope, and ease of future change.
- Review architecture: source-of-truth, data flow, module responsibilities, and consistency with `plan/status.md`.
- Review correctness against spec requirements, missing tests, and unintended scope drift.
- Confirm that plan/status updates accurately describe what shipped.
- Provide findings ordered by severity, with file and line references where possible.
- Approve only when code quality, maintainability, architecture, tests, and spec correctness are acceptable.

#### Agent 3: Designer

The designer is read-only and acts as the visual consistency and screenshot-verification gate.
Skip the designer for backend-only, CLI-only, documentation-only, or otherwise non-visual work.

Responsibilities:

- Read the work prompt, relevant `spec/` files, relevant `plan/` files, changed UI files, and the implementer summary.
- Launch the app however the project supports it — start the dev server (e.g. `pnpm dev`), use a Playwright/browser MCP tool, or build and serve the production bundle. Pick the lowest-friction option that actually renders the changed surface.
- Drive it to the state the change affects: route, tool selection, canvas interaction, etc. For phases that ship UI but no interactions, the freshly loaded view is enough.
- Capture a screenshot.
- Compare the screenshot against the relevant `spec/` and `plan/` expectations: layout, palette, spacing, hierarchy, affordances, responsive fit, interaction state, and the phase's "Manual Testing" checklist.
- Report the screenshot path and a short visual-consistency verdict. If the app cannot be launched in the current environment, say so explicitly and mark the review as **screenshot-blocked** rather than approving.
- Provide findings ordered by severity, with screenshot paths and reproduction steps where useful.
- Approve only when the visual result matches the expected product behavior and does not regress unchanged areas.

Visual regressions in unchanged areas count as blocking findings.

### Orchestrated Team Path

Use when `TeamCreate` and `SendMessage` are available.

1. Create a team (suggested name: `sdd-phase-N` or `sdd-adhoc-<short-slug>`).
2. Spawn an implementer and a reviewer as team agents (see **Roles**). Also spawn a designer unless the work is backend-only, CLI-only, documentation-only, or otherwise non-visual.
3. Use `TaskCreate` to break the work prompt into multiple discrete tasks — not just one task per role — and assign each task to the spawned agent that will own it. The implementer should typically own several tasks covering the pieces of the work; the reviewer owns code quality, maintainability, architecture, tests, and spec correctness; the designer owns visual consistency and screenshot verification.
4. Hand the work prompt to the implementer.
5. After the implementer reports, hand the changes to the reviewer and, when present, the designer in parallel via `SendMessage`.
6. On blocking findings from either reviewer or designer, relay them to the implementer for fixes, then ask only the affected review role(s) for another pass.
7. Repeat until the reviewer approves and the designer approves or was explicitly skipped, or a blocker needs user input.
8. Tear the team down when the work is committed or explicitly paused.

### Plain Subagents Path

Use when `TeamCreate` and `SendMessage` are not available.

1. Spawn an implementer subagent with the prepared work prompt (see **Roles**).
2. After the implementer reports, spawn a reviewer subagent with the work prompt, changed files, and implementer summary.
3. In parallel, spawn a designer subagent with the work prompt, changed files, and implementer summary unless the work is backend-only, CLI-only, documentation-only, or otherwise non-visual.
4. On blocking findings from either reviewer or designer, send them back to the implementer (or fix locally), then run a new pass only for the affected review role(s).
5. Repeat until the reviewer approves and the designer approves or was explicitly skipped, or a blocker needs user input.

## Commit

After approval, stage only the files changed for this task and commit with a mode-prefixed message:

```text
adhoc: <description>
next-phase: <phase name and description>
refactor: <description>
```

If committing is not appropriate in the current environment, leave the working tree edited and report the exact files changed plus verification results.

## Tooling Feedback To The User

After the commit, forward an item from the implementer's **Tooling friction** note only if it would plausibly save time on the next phase:

- a missing script or helper the implementer had to work around and would need again,
- a tool measurably slower or more awkward than a known alternative,
- a recurring manual step that could be captured as a script, hook, or command.

Skip one-offs, minor preferences, and speculative items. If `.claude/logs/tool-usage.jsonl` has timing data (from `.claude/hooks/tool-timing.sh`), consult it before forwarding slow-tool claims.

If nothing passes the filter, say nothing — empty suggestions train the user to ignore the section. When a suggestion passes, name the tool or script, what it would replace, and roughly how much friction it removes.
