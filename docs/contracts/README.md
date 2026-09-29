# Phase 1 Service Contracts

**Status:** Phase 1 schemas and contract tests implemented; service behavior remains planned.

Schemas and Jest validation cover battery submission, acceptance, accepted
events, classification events, worker outcomes, latest-status responses, and
complete lifecycle examples. Run `npm test` from the repository root.

This document defines the minimum shared behavior for TLCore's first working
capability. It gives the simulated client, JavaScript gateway, Python
processor, and Ruby worker one common description of the battery-event
lifecycle before the applications are implemented.

The contracts describe responsibilities and observable behavior. They do not
select application frameworks, a message broker, database libraries, or
migration tools.

## Phase 1 boundary

Phase 1 accepts a TLCore event envelope carrying one supported input type:
`battery.level_reported`. Its payload is a simulated battery percentage. The
envelope separates event metadata from battery-specific `data`; reusable
metadata does not imply support for additional input workflows.
The workflow runs locally and uses no real devices, user accounts, personal
information, external notifications, cloud services, or required paid
services.

Processing is asynchronous. When the gateway accepts a request, the client
receives a lifecycle identifier and a `pending` state. Acceptance does not mean
that downstream processing has finished. The client uses the lifecycle
identifier to request the latest state later.

## Client HTTP contracts

### Battery submission

The simulated client submits one object following
[battery-submission.schema.json](http/battery-submission.schema.json). The
gateway owns validation of this request before it accepts or publishes
anything.

| Field                     | Meaning and owner                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------- |
| `event_id`                | UUID-formatted identifier created by the simulated client for the original reading |
| `event_type`              | Fixed input type `battery.level_reported`                                          |
| `source.id`               | Nonblank simulated source identifier supplied by the client                        |
| `source.type`             | Fixed Phase 1 source type `device`                                                 |
| `occurred_at`             | Date-time supplied by the client for when the original reading happened            |
| `data.battery_percentage` | Whole-number battery percentage from `0` through `100`, inclusive                  |

For example:

```json
{
  "event_id": "11111111-1111-4111-8111-111111111111",
  "event_type": "battery.level_reported",
  "source": {
    "id": "sim-device-001",
    "type": "device"
  },
  "occurred_at": "2026-09-15T12:00:00Z",
  "data": {
    "battery_percentage": 47
  }
}
```

The client does not supply `lifecycle_id` or `created_at`. The gateway creates
those values after validating the submission. `source` contains exactly `id`
and `type`, both strings containing at least one non-whitespace character;
Phase 1 restricts the type to `device`. Source identifiers must be simulated,
not real serial numbers, hostnames, MAC addresses, or personal device names.

The submission, source, and battery data objects reject undeclared fields.
A generic envelope definition may describe broader metadata shapes, but the
concrete submission contract rejects unsupported event and source types.

The contracts intentionally do not establish an HTTP path or method. They
define the request data and observable acceptance behavior so the gateway and
client can be implemented independently without changing the asynchronous
workflow.

### Acceptance response

After validating a battery submission, the gateway accepts it for asynchronous
processing and responds with HTTP `202 Accepted`.

The response body follows
[`battery-acceptance.schema.json`](http/battery-acceptance.schema.json) and
contains the lifecycle identifier and a `pending` state.

HTTP `202 Accepted` means the gateway accepted the request for processing. It
does not mean classification or follow-up work has completed. Classification,
worker outcome, and failure details do not belong in the acceptance response.

### Latest-status response

The client later uses the lifecycle identifier from the acceptance response to
retrieve the latest state. The gateway owns that client-visible query state and
returns an object following
[`battery-status.schema.json`](http/battery-status.schema.json). A status can
be `pending`, `completed`, or `failed`; their required details and meanings are
defined in [Client-visible states](#client-visible-states).

## Event contracts

### Accepted battery event

After accepting a valid battery submission, the JavaScript gateway publishes
an accepted battery event for the Python processor to consume and validate.
The event follows
[`accepted-battery-event.schema.json`](events/accepted-battery-event.schema.json).

The gateway preserves the submitted `event_id`, `event_type`, `source`,
`occurred_at`, and `data`. It adds a UUID-formatted `lifecycle_id` and a
`created_at` date-time for the admitted record. The event ID must differ from
the lifecycle ID. Acceptance enriches the original reading; it does not create
a second reading or replace its event ID.

The accepted event carries only the information the processor needs to
validate and classify the battery reading. It does not define broker topics,
delivery guarantees, retries, or duplicate-event handling.

### Classified battery event

After processing an accepted battery event, the Python processor publishes a
classified battery event for the Ruby worker. The event follows
[`classified-battery-event.schema.json`](events/classified-battery-event.schema.json).
Its `event_type` is `battery.classified`. The processor creates a new
`event_id` and its own `created_at`, preserves `lifecycle_id`, `source`, and
`occurred_at`, and sets `original_event_id` to the submitted event ID.
Its strict `data` object contains `battery_percentage` and `classification`;
the percentage and classification must match the defined thresholds.

### Outcome battery event

After handling a classified battery event, the Ruby worker publishes an
outcome battery event for the gateway. The event follows
[`outcome-battery-event.schema.json`](events/outcome-battery-event.schema.json).
Its `event_type` is `battery.workflow_outcome`. The worker creates a new
`event_id` and its own `created_at`, preserving the lifecycle, original-event,
source, and occurrence-time context.

Its strict `data` object contains `battery_percentage`, `classification`, and
`worker_state`. A `completed` outcome additionally requires the matching
`worker_outcome` and forbids `failure_reason`. A `failed` outcome requires
`failure_reason: "follow_up_failed"` and forbids `worker_outcome`. In both
states, classification must match the percentage. All three event contracts
reject undeclared outer and payload fields.

## Record ownership

| Record                 | Producer / owner | Consumer and meaning                                                    |
| ---------------------- | ---------------- | ----------------------------------------------------------------------- |
| Submission             | Simulated client | Gateway validates the identified reading before admission               |
| Acceptance response    | Gateway          | Client receives the new lifecycle ID and `pending` state                |
| Accepted event         | Gateway          | Processor receives the original reading enriched with lifecycle context |
| Classification event   | Python processor | Worker receives the battery classification and original context         |
| Outcome event          | Ruby worker      | Gateway receives the simulated workflow result and original context     |
| Latest-status response | Gateway          | Client receives the correlated lifecycle state                          |

The input and accepted record use `battery.level_reported`; the classification
and outcome types describe internal stages of that same supported battery
workflow. They are not additional supported submission types.

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

| Identifier          | Meaning and rule                                                                                                                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `source.id`         | Identifies the simulated device; supplied by the client and preserved across events and returned status                             |
| Original `event_id` | Created by the client for the reading and retained in the accepted event                                                            |
| `lifecycle_id`      | Created once by the gateway on acceptance; preserved across acceptance, every event, and status                                     |
| Result `event_id`   | Created by Python for classification and by Ruby for outcome; distinct from the original event ID, each other, and the lifecycle ID |
| `original_event_id` | Carried by classification, outcome, and status; equals the submitted event ID                                                       |

Event and lifecycle identifiers are UUID-formatted strings. The original event
ID must also differ from the lifecycle ID. These relationships provide
correlation; they do not implement retries or duplicate-delivery handling.

## Source and time continuity

`source` identifies the original simulated device, not the service publishing
a result. Preserve both source fields through accepted, classified, and outcome
events and the latest-status response.

`occurred_at` means when the original battery reading happened, including on
downstream result messages. Preserve the exact submitted date-time string
through events and status. Require timezone information; timestamp
normalization and clock-order checks are outside this contract.

`created_at` means when the gateway, processor, or worker created its stage
record. Each publisher sets its own value. It must be a date-time with timezone
information, but it need not equal the original occurrence time. The submission,
acceptance response, and latest-status response do not contain `created_at`.

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

Every status requires `lifecycle_id`, `original_event_id`,
`event_type: "battery.level_reported"`, `source`, `occurred_at`, and `state`.
The gateway takes this originating context from the accepted submission, even
when it rejects a result. A status is a response view, not a newly published
event, and has no separate `event_id`.

Status fields remain at the top level rather than inside event `data`:

- `pending` has no classification, worker outcome, or failure reason.
- `completed` requires classification and its matching worker outcome, and
  excludes a failure reason.
- `failed` requires a safe failure reason, and excludes classification and
  worker outcome.

Every status branch rejects undeclared fields. A failed state must provide a
safe, useful reason without exposing credentials,
internal connection details, personal information, or sensitive diagnostic
evidence.

Failed states use a small fixed set of client-visible reasons:

| Failure reason     | Meaning                                                                                |
| ------------------ | -------------------------------------------------------------------------------------- |
| `follow_up_failed` | The Ruby worker reported that its simulated follow-up failed                            |
| `result_rejected`  | The gateway received a workflow result that it could not accept as the completed state |

These reasons describe where the lifecycle stopped without exposing an internal
error message. Detailed diagnostic evidence belongs in each service's future
structured logs, not in the client-visible state.

## Planned lifecycle

1. The simulated client submits an identified battery reading in the event envelope.
2. The gateway validates the request.
3. The gateway creates the lifecycle identifier, records a `pending` state,
   enriches the original event with lifecycle and creation-time metadata,
   publishes it, and returns the lifecycle identifier to the client.
4. The processor consumes the accepted event, validates it, classifies the
   battery percentage, stores its result, and publishes a new classification
   event retaining the original-event, source, and occurrence-time context.
5. The worker consumes every classification, records the matching completed
   outcome or a failed outcome, stores its result, and publishes a workflow
   outcome with a new event ID and the same originating context.
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

- The gateway rejects an invalid client submission before accepting or publishing it.
- The processor rejects an accepted event that does not satisfy its contract
  instead of classifying it.
- The worker rejects an unsupported or inconsistent classification event
  instead of performing follow-up work.
- The gateway rejects an invalid or inconsistent workflow outcome instead of
  exposing it as a completed result.
- A rejected result that can safely be correlated to an accepted workflow may
  produce `failed/result_rejected`. Returned context comes from the accepted
  submission, not from untrusted result metadata.
- A result that cannot be associated with an accepted lifecycle must not change
  an arbitrary lifecycle's state.

Schemas check individual records, and lifecycle tests compare saved records.
Service tests must verify runtime enforcement of these boundary rules.
Processor-failure events and retry mechanisms are outside this contract.
Retry, duplicate-delivery, ordering, and restart-recovery behavior will be
implemented by later Phase 1 work and are not defined here.

## Lifecycle validation

The [lifecycle fixtures](examples/lifecycle) collect six named records:
`submission`, `acceptance`, `accepted_event`, `classified_event`,
`outcome_event`, and `status`. This object organizes test data; it is not an
application message or a required production storage format. These examples
describe terminal workflows, so a pending status after an outcome is
inconsistent with the example's expected final state.

The [lifecycle helper](../../scripts/helpers/lifecycle-validator.mjs) returns
14 Boolean checks: structure validity, six individual record-validity checks,
and seven relationship checks. Relationships cover lifecycle IDs, original-event
references, distinct event and lifecycle IDs, source ID/type, occurrence time,
battery percentage, and worker outcome versus final status. Event validation
also applies the existing identifier-distinctness rules.

Schemas establish record validity; relationship helpers compare values.
Checks run independently, with optional chaining allowing safe access to
missing or null values. Matching missing values can produce a true comparison
while schema checks reject the records. A true relationship check alone does
not establish validity.

The [Jest suite](../../tests/contracts/battery-lifecycle.test.mjs) explicitly
registers fixtures and their expected check maps. It checks that every matching
battery lifecycle JSON filename is registered exactly once, verifies result
and expectation keys, and tests each Boolean separately. Test descriptions
reflect the expected finding. A passing negative test means the intended
problem was detected, not that the lifecycle is valid.

The 22 fixtures cover:

- Three completed workflows: normal, low, and critical.
- Three valid worker-failed workflows with `follow_up_failed`.
- Ten relationship mismatches whose individual records remain valid.
- Four malformed structures: missing, extra, null, and array stages.
- Two malformed nested values: null outcome source and null outcome data.

Completed and correctly reported worker-failed examples expect all 14 checks
to be true. Negative examples explicitly declare their expected false checks.
Malformed input does not require every check to fail.

Run the lifecycle suite from the repository root:

```bash
npm test -- --runTestsByPath tests/contracts/battery-lifecycle.test.mjs --verbose
```

Run `npm test` for all contract suites. These checks prove contract and saved
example consistency, not execution order, live HTTP behavior, delivery,
persistence, retries, duplicate handling, or recovery.

### Gateway rejection coverage

The status-schema suite validates the shape of `failed/result_rejected`
responses. The lifecycle suite does not implement the gateway's rejection
decision or model correctly handled rejection scenarios.

When the gateway is implemented, its behavior tests must verify that it:

- Rejects invalid or inconsistent incoming outcomes.
- Preserves accepted event and source context in rejection responses.
- Updates only a safely correlated workflow, leaving unrelated workflows unchanged.
- Persists and returns `failed/result_rejected` when appropriate.

The gateway checks its accepted record and the incoming outcome; it does not
collect the six-stage test fixture. Integration tests must verify the running
service path and resulting client-visible state.

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

Contract artifacts are in `common/` for the shared envelope definition,
`http/` and `events/` for concrete schemas, and `examples/` for fixtures.

## Related decisions

- [ADR-0001: Use separate repositories for independently deployable applications](../adr/0001-multi-repository-strategy.md)
- [ADR-0002: Begin with an event-driven polyglot architecture](../adr/0002-initial-event-driven-architecture.md)
- [TLCore system overview](../architecture/SYSTEM_OVERVIEW.md)
- [TLCore roadmap](../ROADMAP.md)
