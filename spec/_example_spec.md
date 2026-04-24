---
id: SPEC-000-EXAMPLE
title: Example Spec
status: draft          # draft | in-review | approved
priority: P2           # P0 (critical) | P1 (high) | P2 (medium) | P3 (low)
dependencies: []
tags: [example, template]
last_updated: 2026-04-23
---

# Example Spec

## Overview

One paragraph — what this system does, who it serves, and why it exists. Written so a reader who has not seen the app can still understand the scope from this paragraph alone. Avoid implementation terms (no "React component", no "table row"); describe the user-facing capability.

## Requirements

Use EARS notation for testable, unambiguous requirements. One bullet per rule; rules should be short enough that a reviewer can tell at a glance whether the app obeys them.

- WHEN [event], THE SYSTEM SHALL [response].
- WHILE [state], THE SYSTEM SHALL [continuous behavior].
- IF [unwanted condition], THEN THE SYSTEM SHALL [corrective response].
- WHERE [optional feature is active], THE SYSTEM SHALL [feature-specific behavior].
- THE SYSTEM SHALL [universal invariant that always holds].

## Behaviors

For multi-step or stateful flows, use Given / When / Then scenarios. Each scenario should read like an executable acceptance test.

Scenario: Short, declarative scenario name
  Given [initial state]
  When [action]
  Then [observable outcome]
  And [additional observable outcome]

Scenario: Another named outcome
  Given ...
  When ...
  Then ...

## Data Definitions

Point at the sidecar file, if one exists, and list what it owns. Do not restate values.

> Machine-readable contract: [`_example_spec.api.v1.yaml`](./_example_spec.api.v1.yaml).
> Owns: resource shape, field types, validation rules.

For prose-only data (short tables, enumerations that don't warrant YAML), inline here.

## Open Questions

Unresolved design decisions, still-being-argued tradeoffs, known gaps. Keeping them visible here is cheaper than relearning them later.

- Question one — current lean and why.
- Question two — waiting on N to decide.
