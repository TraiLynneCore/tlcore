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

## Client HTTP contracts

### Acceptance response

After validating a battery submission, the gateway accepts it for asynchronous
processing and responds with HTTP `202 Accepted`.

The response body follows
[`battery-acceptance.schema.json`](http/battery-acceptance.schema.json) and
contains the lifecycle identifier and a `pending` state.

HTTP `202 Accepted` means the gateway accepted the request for processing. It
does not mean classification or follow-up work has completed. Classification,
worker outcome, and failure details do not belong in the acceptance response.

## Event contracts

### Accepted battery event

After accepting a valid battery submission, the JavaScript gateway publishes
an accepted battery event for the Python processor to consume and validate.
The event follows
[`accepted-battery-event.schema.json`](events/accepted-battery-event.schema.json).

| Field                | Meaning                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------- |
| `event_id`           | UUID-formatted identifier for this individual event; it must differ from the lifecycle ID     |
| `lifecycle_id`       | UUID-formatted identifier created when the request was accepted and preserved across the flow |
| `device_id`          | Safe simulated device identifier supplied in the accepted client request                      |
| `event_type`         | Fixed event type `battery_accepted`                                                            |
| `battery_percentage` | Whole-number battery percentage from `0` through `100`, inclusive                              |
| `created_at`         | Date-time indicating when the gateway created the event                                        |

The accepted event carries only the information the processor needs to
validate and classify the battery reading. It does not define broker topics,
delivery guarantees, retries, or duplicate-event handling.

### Classified battery event

After processing an accepted battery event, the Python processor publishes a
classified battery event for the Ruby worker. The event follows
[`classified-battery-event.schema.json`](events/classified-battery-event.schema.json).
It preserves the lifecycle context, adds the processor-owned classification,
and requires the battery percentage and classification to match the defined
thresholds.

### Outcome battery event

After handling a classified battery event, the Ruby worker publishes an
outcome battery event for the gateway. The event follows
[`outcome-battery-event.schema.json`](events/outcome-battery-event.schema.json).
A `completed` outcome includes the matching `worker_outcome`. A `failed`
outcome includes `follow_up_failed`. An outcome event cannot contain both a
worker outcome and a failure reason.

## Component responsibilities

| Component          | Responsibility                                                                                                             | Owned state                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Simulated client   | Submit a battery percentage and request the latest state                                                                   | None                                                            |
| JavaScript gateway | Validate client requests, publish accepted events, maintain query-facing state, and return the latest state                | Accepted requests and client-visible state                      |
| Message broker     | Carry events between independently running applications                                                                    | Delivery state required by the selected broker                  |
| Python processor   | Validate accepted events, classify battery percentages, persist classifications, and publish classification events         | Processing and classification state                             |
| Ruby worker        | Consume every classification, perform the matching simulated follow-up, persist the outcome, and publish workflow outcomes | Follow-up and workflow state                                    |
| PostgreSQL         | Store application-owned state                                                                                              | Separate schemas or assigned tables managed by each application |

Each application manages its own migrations and may change only the data it
owns. Applications exchange cross-application information through events. The
gateway builds its client-facing state from result events instead of reading
processor or worker data directly.

## Identifiers

The workflow uses the following kinds of identifiers:

| Identifier           | Meaning                                                                    | Rule                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Device identifier    | Identifies the simulated device whose battery state is being reported      | Supplied by the client, remains stable for that simulated device, and must not contain a real serial number, hostname, MAC address, or personal device name |
| Lifecycle identifier | Connects a client submission to every later event and client-visible state | Created once when the gateway accepts the request and preserved unchanged throughout the lifecycle                                                          |
| Event identifier     | Identifies one event within the lifecycle                                  | Created for each published event and distinct from the lifecycle identifier                                                                                 |

The machine-checkable contracts define lifecycle and event identifiers as
UUID-formatted strings. Device identifiers use safe simulated values. Examples
must not contain identifiers tied to a real device or person.

## Valid battery input

A Phase 1 battery reading is a whole-number percentage from `0` through `100`,
inclusive. Missing values, fractional values, non-numeric values, and values
outside that range are invalid.

The Python processor owns the classification decision:

| Battery percentage | Classification | Meaning                             |
| ------------------ | -------------- | ----------------------------------- |
| `21`–`100`         | `normal`       | The battery does not need attention |
| `11`–`20`          | `low`          | The battery needs routine attention |
| `0`–`10`           | `critical`     | The battery needs urgent attention  |

These ranges cover every valid percentage exactly once, with no gaps or
overlap.

## Worker outcomes

The Ruby worker consumes every classification so every accepted battery event
follows the same service path.

| Classification | Worker behavior                       | Completed outcome             |
| -------------- | ------------------------------------- | ----------------------------- |
| `normal`       | Record that no follow-up is needed    | `no_action_required`          |
| `low`          | Perform a simulated routine follow-up | `routine_follow_up_completed` |
| `critical`     | Perform a simulated urgent follow-up  | `urgent_follow_up_completed`  |

The follow-up is an internal simulation. Phase 1 does not send a notification,
contact an external service, or control a device.

## Client-visible states

| State       | Meaning                                                                            |
| ----------- | ---------------------------------------------------------------------------------- |
| `pending`   | The gateway accepted the request, but the workflow has not produced a final result |
| `completed` | The gateway received a valid workflow outcome and updated its query-facing state   |
| `failed`    | The workflow cannot produce a completed result for the accepted request            |

A completed state must identify the classification and matching worker outcome.
A failed state must provide a safe, useful reason without exposing credentials,
internal connection details, personal information, or sensitive diagnostic
evidence.

Failed states use a small fixed set of client-visible reasons:

| Failure reason      | Meaning                                                                                |
| ------------------- | -------------------------------------------------------------------------------------- |
| `processing_failed` | The accepted battery event did not produce a valid classification                      |
| `follow_up_failed`  | The classification did not produce a valid workflow outcome                            |
| `result_rejected`   | The gateway received a workflow result that it could not accept as the completed state |

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
5. The worker consumes every classification, records the matching completed
   outcome or a failed outcome, stores its result, and publishes a workflow
   outcome.
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

The machine-checkable contracts define the exact valid and invalid forms.
Retry, duplicate-delivery, ordering, and restart-recovery behavior will be
implemented by later Phase 1 work and are not defined here.

## Lifecycle validation

The individual request, response, and event fixtures verify each contract at a
single service boundary. Complete lifecycle fixtures under
[`examples/lifecycles`](examples/lifecycles) verify that those individually
valid records also describe one consistent workflow from submission through
the final client-visible state.

The lifecycle validator checks that a workflow preserves its lifecycle ID,
device ID, and battery percentage; assigns a distinct event ID to each event;
preserves the processor classification through the worker outcome; and makes
the final client-visible state agree with that outcome. Valid fixtures cover
completed and failed workflows for every battery classification. Invalid
fixtures isolate one broken cross-stage relationship while keeping every
individual record valid against its own schema.

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
and representative valid, invalid, and boundary examples are stored under this
directory. Complete-lifecycle examples are stored in `examples/lifecycles`.
Those artifacts are the executable expression of the behavior documented here.

Until those artifacts and the applications exist, this document describes
planned behavior rather than an implemented system.

## Related decisions

- [ADR-0001: Use separate repositories for independently deployable applications](../adr/0001-multi-repository-strategy.md)
- [ADR-0002: Begin with an event-driven polyglot architecture](../adr/0002-initial-event-driven-architecture.md)
- [TLCore system overview](../architecture/SYSTEM_OVERVIEW.md)
- [TLCore roadmap](../ROADMAP.md)
