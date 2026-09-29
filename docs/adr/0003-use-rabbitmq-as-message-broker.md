# ADR-0003: Use RabbitMQ as the TLCore message broker

- **Status:** Accepted
- **Date:** 2026-09-29
- **Related issue or pull request:** [Issue #6 — Establish the macOS local dependency baseline](https://github.com/TraiLynneCore/tlcore/issues/6)
- **Supersedes:** None
- **Superseded by:** None

## Context

TLCore needs a message broker to carry events between its JavaScript gateway, Python processor, and Ruby worker. The Phase 1 contracts define the messages, but leave the broker selection open.

The broker must run directly on the development Mac without containers or paid services. It should also remain suitable as TLCore introduces containers, Kubernetes, automated delivery, monitoring, security, and resilience exercises. PostgreSQL remains responsible for durable application data, with each application owning its own data.

## Options considered

### Option 1 — RabbitMQ

- Benefits: Fits the event-processing workflow, provides examples for all three application languages, and includes a management interface for inspecting queues and connections. Supports the later deployment and operational work in the roadmap.
- Drawbacks: Requires an Erlang runtime and compatible upgrades. Queues, routing, acknowledgements, and permissions require deliberate configuration and learning.

### Option 2 — NATS with JetStream

- Benefits: Provides messaging with built-in message storage, replay, and acknowledged consumers in a compact server setup. Can run locally without paid services.
- Drawbacks: Requires understanding JetStream streams and consumers. Core NATS alone does not provide the stored-message behavior needed for recovering work after a consumer stops.

### Option 3 — Redis Streams

- Benefits: Provides stored streams, consumer groups, and acknowledgement tracking, and can run locally without a paid hosting service.
- Drawbacks: Recovering work left pending by failed consumers requires explicit handling. TLCore has no established Redis requirement that would make reusing it an advantage over introducing a dedicated broker.

## Decision

Use open-source RabbitMQ as TLCore's message broker, beginning with direct local operation in Phase 1. Retain it through later phases unless requirements or operating evidence justify a change.

This selects the broker product. It does not select application frameworks, client-library versions, production queue topology, or a clustered deployment.

## Why this option

RabbitMQ directly supports TLCore's producer-and-worker workflow and provides learning examples in JavaScript, Python, and Ruby. Its management interface makes messaging behavior easier to inspect while building and troubleshooting the system.

RabbitMQ can be operated locally without a subscription. Its container distribution, Kubernetes operators, monitoring integration, and security capabilities provide a path through the planned roadmap. No currently identified roadmap requirement requires a different broker, although later integrations and workloads still need their own validation.

NATS with JetStream is a viable alternative. RabbitMQ is preferred here because its queue-oriented workflow and management interface fit the current application and hands-on operational learning goals.

## Tradeoffs

RabbitMQ makes message routing and operational inspection available without building those facilities into each application. In exchange, TLCore must maintain another service and its Erlang dependency, manage credentials and permissions, and allocate local memory and disk space.

Broker acknowledgements do not automatically prevent duplicate application outcomes or make PostgreSQL writes and message publication one atomic operation. Application reliability must still be implemented and tested.

The initial setup will restrict listeners to the local machine and keep real credentials outside version control. Later deployment environments will require their own security configuration. Free local software does not remove infrastructure costs from temporary cloud exercises.

Replacing RabbitMQ remains possible, but would require changes to messaging clients, configuration, tests, and operating instructions, plus a plan for pending messages. Shared event formats and application ownership boundaries should remain separate from broker-specific details. A universal broker abstraction is not required for this decision.

## How it will be validated

Validation is pending; accepting this decision does not mean the broker is installed or the workflow is implemented.

For issue #6:

- Run RabbitMQ directly on macOS without containers or paid services.
- Record the tested version and document compatible clients for JavaScript, Python, and Ruby.
- Verify local-only listeners and authenticated access using the documented configuration.
- Publish and retrieve a disposable test message, then repeat the check after restarting the broker.
- Document setup, connection settings, lifecycle commands, status checks, and troubleshooting without exposing credentials.

As the Phase 1 applications are implemented, validate the contracted event flow through all three services and verify application behavior across redelivery and restart. These are broader Phase 1 checks, not additional completion requirements for issue #6.

## What I learned

A broker decision can address current requirements while checking that the planned roadmap has a supported path forward. It does not need to predict every future requirement.

A compatible event format does not make brokers interchangeable: connection code, delivery behavior, and pending-message handling can still differ. Recording reasons to reconsider makes the decision revisable without treating it as a temporary choice.

## Revisit when

- Measured resource usage makes local operation impractical.
- A required language client, device integration, or messaging behavior cannot be supported adequately.
- Measured throughput, latency, retention, or recovery requirements are not met with a reasonable RabbitMQ configuration.
- Maintenance and operational complexity outweigh the benefits for TLCore.
- Licensing or distribution changes conflict with the project's local, no-required-paid-service constraint.

Record a replacement decision in a new ADR that supersedes this one.

## Related information

- Related ADRs: [ADR-0002 — Begin with an event-driven polyglot architecture](0002-initial-event-driven-architecture.md).
- Documentation: [Phase 1 contracts](../contracts/README.md), [system overview](../architecture/SYSTEM_OVERVIEW.md), [repository roadmap](../ROADMAP.md), and [detailed TLCore roadmap](https://app.notion.com/p/3cbc8b6fcb3d80e1bf77d4994a743909).
- External references:
  - [RabbitMQ tutorials](https://www.rabbitmq.com/tutorials)
  - [RabbitMQ installation](https://www.rabbitmq.com/docs/download)
  - [RabbitMQ management interface](https://www.rabbitmq.com/docs/management)
  - [RabbitMQ Kubernetes operators](https://www.rabbitmq.com/kubernetes/operator/operator-overview)
  - [RabbitMQ monitoring](https://www.rabbitmq.com/docs/monitoring)
  - [RabbitMQ open-source licensing](https://www.rabbitmq.com/blog/2024/05/31/new-community-support-policy)
  - [NATS JetStream](https://github.com/nats-io/nats.docs/blob/master/nats-concepts/jetstream/README.md)
  - [Redis Streams pending-message recovery](https://redis.io/docs/latest/commands/xclaim/)
  - [Redis licenses](https://redis.io/legal/licenses/)
