# Architecture Decision Records

Architecture Decision Records (ADRs) explain important technical choices, the options considered, and the reasoning behind the final decision.

ADRs are part of TLCore's learning record. They show how the project changed over time and make it possible to revisit a decision with its original context.

## Decision index

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](0001-multi-repository-strategy.md) | Use separate repositories for independently deployable applications | Accepted |
| [0002](0002-initial-event-driven-architecture.md) | Begin with an event-driven polyglot architecture | Accepted |

## When to write an ADR

Create an ADR when a decision is important and would be difficult or disruptive to reverse. Examples include:

- Changing application or repository boundaries.
- Selecting a foundational database, broker, platform, or external service.
- Defining data ownership or communication patterns.
- Making a significant security, cost, or deployment commitment.
- Establishing a convention that affects several repositories.

Do not create an ADR for routine implementation details, small refactors, or choices that are easy to change.

## Statuses

- **Proposed:** The decision is under consideration.
- **Accepted:** The decision is approved and guides current work.
- **Rejected:** The proposal was considered but not chosen.
- **Superseded:** A newer ADR replaced the decision.
- **Deprecated:** The decision is no longer recommended but has not been replaced by one specific ADR.

## Creating an ADR

1. Copy [0000-template.md](0000-template.md).
2. Use the next available four-digit number.
3. Give the file a short descriptive name.
4. Start with `Proposed` status.
5. Describe the context, options, decision, tradeoffs, and what was learned.
6. Link the related issue or pull request when available.
7. Add the ADR to the decision index after it is accepted.

Example:

```text
0003-select-message-broker.md
```

## Preserving decisions

An accepted ADR is a historical record. Do not rewrite it simply because the project later changes direction.

When a decision changes:

1. Create a new ADR explaining the new context and decision.
2. Mark the old ADR `Superseded`.
3. Link the two records.

Small corrections that do not change the decision's meaning may be made directly.
