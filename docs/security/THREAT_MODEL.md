# Preliminary Threat Model

**Status:** Planning baseline for Phase 1

This document identifies important security risks in the planned TLCore system before implementation begins. It is a learning tool and planning guide, not evidence that the listed protections already exist.

The threat model should become more specific as working applications, real configuration, and tested controls are added.

## Phase 1 scope

The planned system includes:

- A simulated local client.
- A JavaScript gateway.
- A message broker.
- A Python processor.
- A Ruby worker.
- One local PostgreSQL server with application-owned schemas.
- Public source repositories and development automation.

Phase 1 does not include user accounts, real devices, public application endpoints, production deployment, cloud infrastructure, or sensitive personal data.

## What needs protection

- Source code and repository history.
- Maintainer and automation access.
- Credentials and local configuration.
- The integrity of simulated events and processing results.
- Application-owned database state.
- Logs, screenshots, and other shared engineering evidence.
- The local development machine and services.

## Trust boundaries

### Client to gateway

Client input is untrusted. The gateway must validate requests before accepting or publishing events.

### Application to message broker

The broker transports messages, but consumers must still validate message structure and supported event types.

### Application to PostgreSQL

Each application should access only its own schema or assigned tables. Sharing one database server does not imply unrestricted data access.

### Contributor to repository

Code, dependencies, workflows, documentation, and diagnostic evidence must be reviewed before they are treated as safe.

## Priority threats

| Threat | Why it matters | Planned response |
| --- | --- | --- |
| Credentials are committed or shared publicly | An exposed value could provide access to accounts or services | Ignore local secret files, scan changes, use runtime configuration, and rotate exposed values immediately |
| The maintainer account is compromised | An attacker could change code, settings, or releases | Use strong authentication, two-factor authentication, protected branches, and least-privilege tokens |
| Malformed or oversized input reaches an application | Invalid input could create bad state, crashes, or excessive work | Validate request and event structure, types, ranges, and size limits |
| Events are duplicated, replayed, delayed, or reordered | Processing could create duplicate work or incorrect latest state | Use stable identifiers, idempotent processing, timestamps, and focused tests |
| One application accesses another application's data | A compromise or bug could cross an ownership boundary | Use separate schemas, application-specific access, and migration ownership |
| A vulnerable dependency or workflow is introduced | Third-party code may execute with project or developer access | Review dependencies and automation, keep versions traceable, and add scanning as the build matures |
| A local service is exposed beyond the development machine | Insecure development services could become reachable by untrusted systems | Bind locally by default and require deliberate configuration for broader access |
| A service consumes excessive CPU, memory, storage, or queue capacity | A malformed event or failure could make the local system unusable | Add sensible limits, timeouts, failure handling, and cleanup as each service is implemented |

## Phase 1 security goals

Phase 1 should establish:

- Request and event validation.
- Safe handling of missing or invalid configuration.
- No credentials in source control, logs, examples, or images.
- Stable event identifiers and idempotent processing.
- Clear application data ownership.
- Local-only service exposure by default.
- Sanitized logs and troubleshooting evidence.
- Tests for important invalid and duplicate behavior.

Specific controls should be added alongside the behavior they protect rather than claimed in advance.

## Revisit this model when

- A major application or data boundary changes.
- Authentication or user accounts are introduced.
- A service becomes reachable outside the local development machine.
- Real devices or personal data are used.
- Cloud infrastructure or deployment credentials are introduced.
- A security incident or important new threat is discovered.

See [SECURITY.md](../../SECURITY.md) for vulnerability reporting and [Public Repository Safety](PUBLIC_REPOSITORY_SAFETY.md) for publication checks.
