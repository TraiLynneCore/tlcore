# Phase 1 Service Contracts

**Status:** Planned Phase 1 contract

This document defines the minimum shared behavior for TLCore's first working
capability. It gives the simulated client, JavaScript gateway, Python
processor, and Ruby worker one common description of the battery-event
lifecycle before the applications are implemented.

The contracts describe responsibilities and observable behavior. They do not
select application frameworks, a message broker, database libraries, or
migration tools.

## Phase 1 boundary

Phase 1 processes one kind of simulated device event: a battery percentage.
The workflow runs locally and uses no real devices, user accounts, personal
information, external notifications, cloud services, or required paid
services.

Processing is asynchronous. When the gateway accepts a request, the client
receives a lifecycle identifier and a `pending` state. Acceptance does not mean
that downstream processing has finished. The client uses the lifecycle
identifier to request the latest state later.

## Component responsibilities

| Component | Responsibility | Owned state |
| --- | --- | --- |
| Simulated client | Submit a battery percentage and request the latest state | None |
| JavaScript gateway | Validate client requests, publish accepted events, maintain query-facing state, and return the latest state | Accepted requests and client-visible state |
| Message broker | Carry events between independently running applications | Delivery state required by the selected broker |
| Python processor | Validate accepted events, classify battery percentages, persist classifications, and publish classification events | Processing and classification state |
| Ruby worker | Consume every classification, perform the matching simulated follow-up, persist the outcome, and publish workflow outcomes | Follow-up and workflow state |
| PostgreSQL | Store application-owned state | Separate schemas or assigned tables managed by each application |

Each application manages its own migrations and may change only the data it
owns. Applications exchange cross-application information through events. The
gateway builds its client-facing state from result events instead of reading
processor or worker data directly.

## Identifiers

The workflow uses two kinds of identifier:

| Identifier | Meaning | Rule |
| --- | --- | --- |
| Lifecycle identifier | Connects a client submission to every later event and client-visible state | Created once when the gateway accepts the request and preserved unchanged throughout the lifecycle |
| Event identifier | Identifies one event within the lifecycle | Created for each published event and distinct from the lifecycle identifier |

The machine-checkable contracts will define identifiers as UUID-formatted
strings. Examples must use generated, simulated values that cannot be tied to a
real device or person.

## Valid battery input

A Phase 1 battery reading is a whole-number percentage from `0` through `100`,
inclusive. Missing values, fractional values, non-numeric values, and values
outside that range are invalid.

The Python processor owns the classification decision:

| Battery percentage | Classification | Meaning |
| --- | --- | --- |
| `21`–`100` | `normal` | The battery does not need attention |
| `11`–`20` | `low` | The battery needs routine attention |
| `0`–`10` | `critical` | The battery needs urgent attention |

These ranges cover every valid percentage exactly once, with no gaps or
overlap.

## Worker outcomes

The Ruby worker consumes every classification so every accepted battery event
follows the same service path.

| Classification | Worker behavior | Completed outcome |
| --- | --- | --- |
| `normal` | Record that no follow-up is needed | `no_action_required` |
| `low` | Perform a simulated routine follow-up | `routine_follow_up_completed` |
| `critical` | Perform a simulated urgent follow-up | `urgent_follow_up_completed` |

The follow-up is an internal simulation. Phase 1 does not send a notification,
contact an external service, or control a device.

## Client-visible states

| State | Meaning |
| --- | --- |
| `pending` | The gateway accepted the request, but the workflow has not produced a final result |
| `completed` | The gateway received a valid workflow outcome and updated its query-facing state |
| `failed` | The workflow cannot produce a completed result for the accepted request |

A completed state must identify the classification and matching worker outcome.
A failed state must provide a safe, useful reason without exposing credentials,
internal connection details, personal information, or sensitive diagnostic
evidence.

Failed states use a small fixed set of client-visible reasons:

| Failure reason | Meaning |
| --- | --- |
| `processing_failed` | The accepted battery event did not produce a valid classification |
| `follow_up_failed` | The classification did not produce a valid workflow outcome |
| `result_rejected` | The gateway received a workflow result that it could not accept as the completed state |

These reasons describe where the lifecycle stopped without exposing an internal
error message. Detailed diagnostic evidence belongs in each service's future
structured logs, not in the client-visible state.

## Planned lifecycle

1. The simulated client submits a battery percentage to the gateway.
2. The gateway validates the request.
3. The gateway creates the lifecycle identifier, records a `pending` state,
   publishes an accepted battery event, and returns the identifier to the
   client.
4. The processor consumes the accepted event, validates it, classifies the
   battery percentage, stores its result, and publishes a classification event.
5. The worker consumes the classification event, performs the matching
   simulated follow-up, stores its result, and publishes a workflow outcome.
6. The gateway consumes the workflow outcome and changes its query-facing state
   to `completed` or `failed`.
7. The client requests and receives the latest state using the lifecycle
   identifier.

```text
Client submission
    -> accepted battery event
    -> classification event
    -> workflow outcome
    -> client-visible state
```

## Boundary validation

Each service validates information when it crosses that service's boundary:

- The gateway rejects an invalid client submission instead of publishing it.
- The processor rejects an accepted event that does not satisfy its contract
  instead of classifying it.
- The worker rejects an unsupported or inconsistent classification event
  instead of performing follow-up work.
- The gateway rejects an invalid workflow outcome instead of exposing it as a
  completed result.

The machine-checkable contracts will define the exact valid and invalid forms.
Retry, duplicate-delivery, ordering, and restart-recovery behavior will be
implemented by later Phase 1 work and are not defined here.

## Compatibility during Phase 1

A contract change is incompatible when an application following the previous
contract could no longer produce or understand the required behavior. Examples
include:

- Removing required information.
- Renaming an established state, classification, outcome, or failure reason.
- Changing the meaning of an existing value.
- Narrowing the accepted battery range.
- Changing identifier meaning or breaking lifecycle correlation.

Clarifying documentation without changing behavior is compatible. Phase 1 does
not establish a long-term public API-versioning policy.

## Contract artifacts

Language-neutral, machine-checkable request, response, and event definitions
will be added under this directory with representative valid, invalid,
boundary, and complete-lifecycle examples. Those artifacts will be the
executable expression of the behavior documented here.

Until those artifacts and the applications exist, this document describes
planned behavior rather than an implemented system.

## Related decisions

- [ADR-0001: Use separate repositories for independently deployable applications](../adr/0001-multi-repository-strategy.md)
- [ADR-0002: Begin with an event-driven polyglot architecture](../adr/0002-initial-event-driven-architecture.md)
- [TLCore system overview](../architecture/SYSTEM_OVERVIEW.md)
- [TLCore roadmap](../ROADMAP.md)
