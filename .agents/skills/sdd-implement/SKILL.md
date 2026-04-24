---
name: sdd-implement
description: Implement Spec-Driven Development (SDD) work from spec/ and plan/ files. Use when the user invokes $sdd-implement, asks to implement the next SDD phase, requests next-phase/adhoc/manual/refactor SDD work, or wants a sequential implementer and reviewer workflow.
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

## Sequential Agent Workflow

Prefer agent-team orchestration when the environment supports it. Otherwise, use plain sequential subagents. In both cases, run the workflow in order: implementer first, reviewer second. Do not run the implementer and reviewer in parallel.

Before falling back to plain subagents, check whether team tools (e.g. `TeamCreate`, `SendMessage`) are deferred rather than absent. If they appear in the harness's deferred-tool list, load them via `ToolSearch` and take the orchestrated path.

### Orchestrated agent team

Use this path when the environment has a team orchestration layer with teammate messaging, task assignment, and team cleanup.

1. Create the team with `TeamCreate`.
2. Spawn two team agents with the `Agent` tool: an implementer and a reviewer.
3. Create tasks with `TaskCreate` for the work described in the work prompt.
4. Assign the implementation tasks to the implementer.
5. Wait for the implementer to finish and summarize changes, verification, and risks.
6. Hand the completed work to the reviewer as a review task.
7. Send reviewer findings back to the implementer for fixes when needed.
8. Repeat the implementer -> reviewer loop until the reviewer approves or a blocker needs user input.
9. Clean up the team after the work is committed or explicitly paused.

### Plain subagents

Use this path when the environment supports one-off delegated agents but not team orchestration.

1. Create or invoke an implementer subagent with the prepared work prompt.
2. Wait for the implementer to finish and summarize changes, verification, and risks.
3. Create or invoke a reviewer subagent with the work prompt, changed files, and implementer summary.
4. If the reviewer finds blocking issues, send the findings back to the implementer or perform the fix locally, then ask the reviewer for another pass.
5. Repeat until the reviewer approves or a blocker needs user input.

If neither team orchestration nor plain subagents are available, perform the same two roles yourself in sequence and clearly label the implementation and review passes.

### Agent 1: Implementer

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

### Agent 2: Reviewer

The reviewer is read-only.

Responsibilities:

- Read the work prompt, changed files, relevant `plan/` files, and relevant `spec/` files.
- Review for correctness against spec requirements, maintainability, missing tests, and unintended scope drift.
- Confirm that plan/status updates accurately describe what shipped.
- Provide findings ordered by severity, with file and line references where possible.
- Approve only when the implementation is ready to commit.

## Iteration

After the reviewer responds:

1. If there are blocking findings, the implementer fixes them.
2. Run the relevant verification commands again.
3. Ask the reviewer for another pass.
4. Repeat until the reviewer approves or a blocker needs user input.

## Commit

After approval, stage only the files changed for this task and commit with a mode-prefixed message:

```text
adhoc: <description>
next-phase: <phase name and description>
refactor: <description>
```

If committing is not appropriate in the current environment, leave the working tree edited and report the exact files changed plus verification results.

## Tooling Feedback To The User

After the commit (or final report), relay the implementer's **Tooling friction** notes to the user — but filter first. Forward an item only if it would plausibly save time on the next phase:

- A missing script or helper the implementer had to work around, and would need again.
- A tool that was measurably slow or awkward compared with a known alternative.
- A repeated manual step that could be captured as a script, hook, or command.

Skip anything that was a one-off inconvenience, a minor preference, or speculative. If the hook at `.claude/hooks/tool-timing.sh` has produced timing data in `.claude/logs/tool-usage.jsonl`, consult it to validate claims about slow tools before forwarding them.

If nothing passes the filter, do not mention tooling at all. An empty suggestion is worse than none — it trains the user to ignore the section.

When a suggestion does pass, phrase it concretely: what tool or script, what it would replace, and roughly how much friction it would remove.
