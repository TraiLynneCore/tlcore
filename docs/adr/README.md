# Architecture Decision Records

Architecture Decision Records preserve important TLCore decisions and the reasoning behind them.

Code shows what the system does. ADRs explain why the project chose a particular direction, which alternatives were considered, and when the decision should be revisited.

## Decision index

| ADR                                               | Decision                                                            | Status   |
| ------------------------------------------------- | ------------------------------------------------------------------- | -------- |
| [0001](0001-multi-repository-strategy.md)         | Use separate repositories for independently deployable applications | Accepted |
| [0002](0002-initial-event-driven-architecture.md) | Begin with an event-driven polyglot architecture                    | Accepted |

## Status values

- **Proposed:** The decision is under discussion and has not been approved.
- **Accepted:** The decision is approved and guides current work.
- **Superseded by ADR-NNNN:** A newer ADR replaces the decision.
- **Deprecated:** The decision is no longer applicable.
- **Rejected:** The option was considered but not adopted.

## When an ADR is required

Create an ADR when a decision:

- Changes an application or system boundary
- Selects a foundational technology or managed service
- Defines data ownership
- Changes communication or deployment patterns
- Introduces a significant security or cost commitment
- Establishes a convention affecting multiple repositories
- Is difficult or expensive to reverse

Routine implementation choices and small documentation changes do not require ADRs.

## Creating an ADR

1. Copy [`0000-template.md`](0000-template.md).
2. Assign the next available four-digit number.
3. Use a short, descriptive, lowercase filename.
4. Begin with the status `Proposed`.
5. Document the context, decision drivers, credible alternatives, consequences, risks, validation, and revisit conditions.
6. Review the ADR with the related change.
7. Change the status to `Accepted` when the decision is approved.
8. Add the accepted ADR to the decision index.

Example:

```text
0003-message-broker-selection.md
```

## Changing a decision

Accepted ADRs are historical records and should not be silently rewritten to describe a different decision.

When a decision changes:

1. Create a new ADR explaining the new context and decision.
2. Identify the previous ADR in the references.
3. Change the previous ADR’s status to `Superseded by ADR-NNNN`.
4. Add the new ADR to this index.

Minor corrections that do not change the meaning—such as typographical fixes or repaired links—may be made directly to an existing ADR.

## Decision quality

A useful ADR:

- States the problem before the solution
- Identifies the constraints that matter
- Compares credible alternatives fairly
- Records negative consequences as well as benefits
- Defines how the choice will be validated
- Explains what evidence should trigger reconsideration
- Avoids presenting preferences as requirements

An ADR is not proof that a decision is permanent. It is evidence that the decision was made deliberately.

## Related documentation

- [Repository Governance](../governance/REPOSITORY_GOVERNANCE.md)
- [TLCore System Overview](../architecture/SYSTEM_OVERVIEW.md)
- [TLCore Project Charter](../PROJECT_CHARTER.md)
