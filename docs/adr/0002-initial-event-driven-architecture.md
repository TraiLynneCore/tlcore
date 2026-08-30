# ADR-0002: Begin with an event-driven polyglot architecture

- **Status:** Accepted
- **Date:** 2026-08-29
- **Decision owner:** Trai Lynne Compton
- **Related issues:** None — Phase 0 repository bootstrap

## Context

TLCore is an engineering laboratory for learning and demonstrating DevOps, platform engineering, site reliability engineering, cloud, and security practices.

The system needs enough architectural depth to create meaningful deployment, messaging, observability, reliability, and troubleshooting challenges. At the same time, its application scope must remain small enough that operational learning remains the primary focus.

The first application milestone processes simulated device battery-status events. An event must enter the system, cross multiple application boundaries, be processed asynchronously, persist useful state, and become available through an external API.

The roadmap calls for JavaScript, Python, and Ruby applications. Each language must own a meaningful responsibility rather than being included only for technology coverage.

## Decision drivers

- Create realistic asynchronous and distributed-system behavior
- Give each programming language a clear application boundary
- Keep the user-facing workflow small and understandable
- Support independent application development, testing, and deployment
- Provide useful failure, recovery, and observability exercises
- Allow future devices and integrations to use stable interfaces
- Avoid unnecessary services and infrastructure
- Operate locally without paid dependencies

## Options considered

### Option 1: Single application

Implement the device-signal workflow in one application and one language.

**Advantages**

- Simplest development and local operation
- Fewer failure modes
- Straightforward testing and debugging
- Minimal infrastructure requirements

**Disadvantages**

- Does not provide meaningful distributed-system experience
- Offers limited practice with asynchronous messaging and contract management
- Does not support the roadmap’s polyglot learning goals
- Produces fewer realistic deployment and reliability challenges

### Option 2: Polyglot applications using synchronous communication

Divide responsibilities among JavaScript, Python, and Ruby applications that call one another through synchronous APIs.

**Advantages**

- Creates clear language and application boundaries
- Request flow is relatively easy to follow
- Immediate success and failure responses are possible
- Requires less messaging infrastructure

**Disadvantages**

- Couples application availability and latency
- A downstream failure can block the entire request path
- Provides limited experience with queues, retries, duplicate delivery, and backlog recovery
- Does not match the asynchronous-processing goal of the roadmap

### Option 3: Event-driven polyglot applications

Use a JavaScript gateway, Python processor, and Ruby worker connected through a message broker. Persist application state in PostgreSQL and expose the latest processed state through the gateway.

**Advantages**

- Creates meaningful asynchronous processing behavior
- Allows applications to operate and recover independently
- Supports queue, retry, idempotency, and backlog exercises
- Provides realistic observability and contract-management needs
- Gives each language a distinct responsibility
- Creates a natural integration point for future devices

**Disadvantages**

- Introduces eventual consistency
- Requires a message broker and event-contract governance
- Creates more complex testing and local orchestration
- Requires correlation identifiers and cross-service observability
- Duplicate delivery and out-of-order events must be handled deliberately

## Decision

TLCore will begin as a small event-driven polyglot system.

The initial applications are:

### JavaScript gateway

The gateway owns the external HTTP interface.

Its responsibilities include:

- Accepting device battery-status events
- Validating the external request structure
- Assigning or accepting an event identifier
- Publishing accepted events to the message broker
- Maintaining the query-facing device-status projection
- Returning a device’s latest processed state

The gateway does not perform battery classification or follow-up workflow processing.

### Python processor

The processor owns device-event interpretation.

Its responsibilities include:

- Consuming accepted battery-status events
- Applying domain validation
- Classifying battery levels as `normal`, `low`, or `critical`
- Recording processing state within its owned data boundary
- Publishing classified event results

The processor does not expose the public API or perform follow-up integrations.

### Ruby worker

The worker owns follow-up workflow execution.

Its responsibilities include:

- Consuming classified battery events
- Determining whether the event requires attention
- Creating and completing a simulated follow-up job
- Recording workflow state within its owned data boundary
- Publishing workflow-result events

The initial milestone does not deliver real email, SMS, push notifications, or device commands.

### Message broker

A message broker carries events between the applications.

The specific broker will be selected in a separate ADR after the required messaging behavior is defined. Consumers must be designed for possible duplicate delivery, and processing must be idempotent.

### PostgreSQL

The initial applications may share one local PostgreSQL server to reduce operational overhead, but they must not treat all tables as shared application state.

Each application owns its schema or tables and is responsible for changing them through its own migrations. An application must not directly modify another application’s owned data.

The JavaScript gateway maintains a query-facing projection from result events rather than querying the Python or Ruby application’s tables directly.

This preserves logical data ownership while avoiding the cost of operating several database servers during the initial phases.

## Event flow

1. A client submits a simulated battery-status event to the JavaScript gateway.
2. The gateway accepts the event and publishes it to the message broker.
3. The Python processor consumes, validates, and classifies the event.
4. The processor publishes a classification result.
5. The Ruby worker consumes the result and performs any required simulated follow-up work.
6. The worker publishes the workflow result.
7. The gateway consumes result events and updates its device-status projection.
8. A client retrieves the latest processed state through the gateway.

The initial event flow is eventually consistent. Acceptance of an event does not guarantee that all processing has completed when the initial request returns.

## Consequences

### Positive

- Each language has a meaningful and explainable responsibility.
- Applications can be developed, tested, deployed, and recovered independently.
- The system supports realistic messaging and reliability exercises.
- Future device types can use the gateway without bypassing application boundaries.
- Logical data ownership reduces direct database coupling.
- One local PostgreSQL server keeps early operational cost manageable.

### Negative

- The latest device state may not be available immediately after submission.
- Event schemas and compatibility must be managed explicitly.
- End-to-end testing requires several running dependencies.
- Debugging requires correlation across application boundaries.
- Query projections introduce duplicate state derived from events.
- A shared PostgreSQL server remains an infrastructure-level dependency.

### Risks

- **Duplicate processing:** A broker may deliver an event more than once.
  - Mitigation: Use stable event identifiers and idempotent consumers.
- **Out-of-order events:** Older device state may arrive after newer state.
  - Mitigation: Compare event timestamps or sequence information before updating the latest-state projection.
- **Contract drift:** Producers and consumers may interpret events differently.
  - Mitigation: Version event schemas and add contract tests.
- **Hidden coupling:** Applications may begin reading one another’s database tables.
  - Mitigation: Document data ownership and use separate schemas and credentials where practical.
- **Operational complexity:** Three applications may overwhelm the initial milestone.
  - Mitigation: Keep one event type, one workflow, and explicit non-goals.
- **Poor traceability:** Asynchronous failures may be difficult to follow.
  - Mitigation: Carry an event and correlation identifier through every application boundary.

## Validation

This decision is working when:

- A battery-status event crosses all three application boundaries asynchronously.
- Each application can be started, stopped, configured, and tested independently.
- Duplicate event delivery does not produce duplicate outcomes.
- One unavailable consumer does not prevent the gateway from accepting valid events while the broker remains available.
- Processing resumes safely after a consumer restarts.
- The gateway returns the latest completed device state without reading another application’s tables.
- The complete event lifecycle can be reconstructed from identifiers and system evidence.
- The workflow runs locally without paid services.

## Revisit when

Review this decision if:

- The three-application design does not provide meaningful operational learning.
- Cross-application coordination prevents steady delivery.
- A responsibility no longer justifies an independently deployable application.
- Workload or reliability evidence requires different communication patterns.
- The shared PostgreSQL server prevents required isolation or independent operation.
- Future device integrations require a different ingestion or state model.

If the architecture changes, create a new ADR that supersedes this record rather than rewriting the original decision.

## References

- [TLCore Project Charter](../PROJECT_CHARTER.md)
- [ADR-0001: Use separate repositories for independently deployable applications](0001-multi-repository-strategy.md)
- [The Twelve-Factor App](https://12factor.net/)
