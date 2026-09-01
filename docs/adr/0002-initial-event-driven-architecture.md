# ADR-0002: Begin with an event-driven polyglot architecture

- **Status:** Accepted
- **Date:** 2026-08-29
- **Decision owner:** Trai Lynne Compton
- **Related issues:** None — Phase 0 repository bootstrap

## Context

TLCore needs enough technical depth to create meaningful practice with deployment, messaging, observability, reliability, security, and troubleshooting. The application itself must remain small enough that operating and evolving the system stays central to the learning experience.

The first capability will process simulated battery-status events. JavaScript, Python, and Ruby are included in the roadmap, but each language needs a clear responsibility rather than being present only for technology coverage.

## Options considered

### One application and language

- **Benefits:** Simplest development, testing, debugging, and local operation.
- **Drawbacks:** Limited distributed-system, messaging, deployment, and polyglot experience.

### Polyglot applications using synchronous APIs

- **Benefits:** Clear language boundaries and a request flow that is relatively easy to follow.
- **Drawbacks:** Application availability becomes tightly coupled, and the design provides less practice with queues, retries, duplicate delivery, and recovery.

### Event-driven polyglot applications

- **Benefits:** Meaningful asynchronous behavior, independent application responsibilities, and realistic messaging, failure, recovery, contract, and observability challenges.
- **Drawbacks:** Eventual consistency, more local dependencies, more complex testing, and a need to handle duplicate or out-of-order events.

## Decision

TLCore will begin as a small event-driven polyglot system.

| Component | Responsibility |
| --- | --- |
| JavaScript gateway | Accept and validate external requests, publish events, maintain the query-facing latest state, and return results |
| Python processor | Validate and classify battery events as `normal`, `low`, or `critical` |
| Ruby worker | Perform simulated follow-up work when a classified event needs attention |
| Message broker | Carry events between independently running applications |
| PostgreSQL | Store application-owned processing, workflow, and query state |

The exact frameworks, message broker, database libraries, and event formats will be selected during Phase 1 when their requirements are clearer.

## Planned event flow

1. A client submits a simulated battery-status event to the gateway.
2. The gateway validates and publishes the event.
3. The processor consumes, validates, and classifies the event.
4. The processor stores and publishes its result.
5. The worker consumes the result and performs any required follow-up work.
6. The worker stores and publishes its result.
7. The gateway consumes result events and updates its latest-state view.
8. The client retrieves the latest processed state through the gateway.

Processing is eventually consistent. Accepting an event does not mean every downstream application has finished when the original request returns.

## Data ownership

The applications may share one local PostgreSQL server during the early phases, but each application will own a separate schema or assigned set of tables.

Each application will manage its own migrations and will not directly modify another application's data. The gateway will build its query-facing state from result events instead of reading processor or worker tables.

## Why this option

The design gives each language a meaningful boundary and creates the distributed-system behavior TLCore is intended to explore. Keeping one event type, one local database server, and simulated data limits the application scope while preserving useful operational challenges.

## Tradeoffs

This decision provides practice with:

- Asynchronous processing and eventual consistency.
- Independent application development and operation.
- Event contracts, retries, idempotency, and recovery.
- Cross-application troubleshooting and observability.

It also means:

- Results may not be available immediately.
- End-to-end tests require several running dependencies.
- Events and application behavior must be correlated across boundaries.
- Duplicate, delayed, and out-of-order events require deliberate handling.
- Cross-application contracts must remain compatible.

## How it will be validated

The decision is working when:

- One battery-status event crosses all three application boundaries.
- Each application can be started, configured, and tested independently.
- Duplicate delivery does not create duplicate outcomes.
- Processing can recover after an application restarts.
- The gateway returns the latest completed state without reading another application's tables.
- The event lifecycle can be understood from identifiers and system evidence.
- The complete workflow runs locally without paid services.

## Revisit when

Reconsider this decision if:

- The three-application design does not provide useful learning value.
- Cross-application coordination prevents steady progress.
- A responsibility no longer justifies an independent application.
- The shared PostgreSQL server prevents necessary isolation.
- Real implementation evidence supports a different communication or state model.

If the architecture changes, create a new ADR that supersedes this record.

## References

- [ADR-0001: Use separate repositories for independently deployable applications](0001-multi-repository-strategy.md)
- [The Twelve-Factor App](https://12factor.net/)
