# TLCore Initial Threat Model

- **Status:** Initial Phase 0 baseline
- **Owner:** Trai Lynne Compton
- **Last updated:** 2026-08-29
- **Review cadence:** At every phase boundary and after material architectural or security changes

## Purpose

This threat model identifies the initial security risks to TLCore’s source code, development workflow, application architecture, data, and operational resources.

It is intentionally lightweight and will evolve as implementation, deployment, identity, and integration decisions become concrete.

## Scope

This model covers:

- The `TraiLynneCore` GitHub organization and repositories
- Contributor and repository-administrator access
- Source code, dependencies, automation, and release history
- The simulated device client
- JavaScript gateway
- Message broker
- Python processor
- Ruby worker
- PostgreSQL
- Local development configuration and credentials
- Future CI/CD workflows where they affect repository security

The following are not yet designed and remain outside the current implementation scope:

- Real personal devices
- Production users
- Public application endpoints
- Kubernetes
- Permanent cloud infrastructure
- Production data
- Real notification or automation providers

These areas must be added to the threat model before they are introduced.

## Assumptions

- Phase 1 runs locally on a trusted development machine.
- Initial events use simulated, non-personal device data.
- The first milestone does not include user accounts.
- The application is not initially exposed to the public internet.
- The source repositories may become public.
- GitHub is trusted to provide repository hosting and access controls.
- Third-party dependencies and automation are not trusted solely because they are publicly available.
- Message delivery may be duplicated, delayed, or reordered.

## Security objectives

TLCore should protect:

1. **Repository integrity:** Unauthorized users cannot silently alter trusted source code or project history.
2. **Credential confidentiality:** Credentials and other sensitive values do not enter source control, logs, issues, artifacts, or public documentation.
3. **Event integrity:** Applications validate events and do not accept malformed or unsupported data as trusted state.
4. **Data boundaries:** Each application accesses only the data it owns.
5. **Processing integrity:** Duplicate or reordered events do not create invalid outcomes.
6. **Traceability:** Important actions can be associated with an event, application, version, and time.
7. **Availability and cost:** Untrusted or uncontrolled activity cannot exhaust local, CI, or future cloud resources without limits.
8. **Recoverability:** Security failures can be contained, investigated, and corrected through documented procedures.

## Assets

| Asset                                      | Why it matters                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------- |
| GitHub organization and maintainer account | Controls source code, settings, releases, and future automation             |
| Source code and Git history                | Represents the trusted implementation and decision record                   |
| Build and release process                  | Determines which code becomes a trusted artifact                            |
| Credentials and configuration              | May grant access to repositories, services, databases, or cloud resources   |
| Event data and processing state            | Determines the state presented by TLCore                                    |
| Event and API contracts                    | Define trusted communication between applications                           |
| PostgreSQL data                            | Contains durable device, processing, and workflow state                     |
| Message-broker state                       | Contains pending work and inter-application events                          |
| Logs, metrics, and traces                  | Support investigation but may expose sensitive information                  |
| Local and future cloud resources           | Affect availability and financial cost                                      |
| Project reputation                         | Public security failures can affect confidence in the project and portfolio |

## Data classification

### Public

Safe to publish intentionally:

- Source code intended for the public repository
- Architecture documentation
- Sanitized examples
- Generated demonstration device identifiers
- Simulated battery data
- Published release information

### Internal project data

Not secret, but not automatically intended for publication:

- Unreleased plans
- Temporary debugging output
- Local environment details
- Draft security findings
- Internal operational notes

### Sensitive

Must be protected:

- Access tokens
- API keys
- Passwords
- Private keys
- Session cookies
- Connection strings containing credentials
- Security-vulnerability details before coordinated disclosure
- Personal-device identifiers linked to a real person
- Private network or account information

### Prohibited

Must not be stored in TLCore repositories or test data:

- Production credentials
- Irreplaceable personal data
- Credentials belonging to another person
- Real private-device data that is unnecessary for the laboratory
- Secrets copied into issues, pull requests, screenshots, logs, or documentation

## Trust boundaries

### Contributor to GitHub

Code, issues, pull requests, dependencies, and documentation submitted by contributors are untrusted until reviewed and validated.

### GitHub workflow to protected resources

Future CI/CD jobs may execute repository-controlled code. Pull requests and third-party actions must not automatically receive privileged credentials.

### External client to JavaScript gateway

All submitted identifiers, timestamps, event types, and battery values are untrusted input.

### Application to message broker

Published and consumed messages must be validated. Access to the broker does not make every message trustworthy.

### Application to PostgreSQL

Each application owns a defined data boundary. One application must not assume that it can read or modify another application’s schema.

### Operational evidence to public channels

Logs, screenshots, traces, issues, and pull requests cross from operational context into potentially public storage and must be sanitized.

### Future local environment to cloud provider

Future cloud authentication, infrastructure creation, and cost controls create a separate trust boundary that must be modeled before Phase 10.

## Risk scale

- **High:** Could compromise accounts, credentials, trusted code, personal data, or create substantial uncontrolled cost.
- **Medium:** Could corrupt application state, disrupt the laboratory, or expose limited internal information.
- **Low:** Has limited impact under current local and simulated-data assumptions.

A lower current risk may become higher when the application is publicly reachable or connected to real devices.

## Priority threats and mitigations

| ID    | Category                                        | Threat                                                                                                      | Current risk                                         | Required or planned controls                                                                                                                                    |
| ----- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TM-01 | Spoofing / elevation of privilege               | An attacker compromises the sole maintainer account and gains repository control                            | High                                                 | Required 2FA, protected branches, current recovery methods, least-privilege tokens, and later review of the single-owner exception                              |
| TM-02 | Information disclosure                          | A credential is committed to Git history, an issue, pull request, log, screenshot, or artifact              | High                                                 | `.gitignore`, example configuration with dummy values, secret scanning, push protection, manual review, immediate rotation, and documented response             |
| TM-03 | Tampering / elevation of privilege              | A malicious pull request or workflow executes with privileged credentials                                   | High                                                 | No secrets for untrusted pull requests, minimal workflow permissions, reviewed workflow changes, pinned third-party actions, and protected environments         |
| TM-04 | Tampering                                       | A compromised dependency or third-party action alters application or build behavior                         | High                                                 | Lockfiles, minimal dependencies, dependency review, vulnerability alerts, automated updates, provenance checks in later phases, and immutable action references |
| TM-05 | Spoofing                                        | An unauthorized or simulated client submits a forged device event                                           | Low during local-only Phase 1; High for real devices | Restrict local exposure initially; define authentication, authorization, and revocation before real-device or public access                                     |
| TM-06 | Tampering / denial of service                   | Malformed or oversized input causes invalid state, crashes, or excessive work                               | Medium                                               | Schema validation, value and size limits, safe error handling, timeouts, negative tests, and future rate limits                                                 |
| TM-07 | Tampering                                       | Duplicate, replayed, delayed, or reordered events create incorrect state or repeated work                   | Medium                                               | Stable event identifiers, idempotent consumers, timestamp or sequence checks, transaction boundaries, and retry tests                                           |
| TM-08 | Spoofing / tampering                            | An unauthorized publisher injects messages into the broker                                                  | Medium locally; High when networked                  | Broker authentication when applicable, least-privilege producer and consumer permissions, network restrictions, and message validation                          |
| TM-09 | Elevation of privilege / information disclosure | One application reads or modifies another application’s database-owned state                                | Medium                                               | Separate schemas, application-specific credentials, least privilege, migration ownership, and integration tests for access boundaries                           |
| TM-10 | Information disclosure                          | Logs, traces, or metrics expose credentials or personal-device information                                  | Medium                                               | Structured logging policy, field allowlists or redaction, simulated identifiers, sanitized examples, and telemetry review                                       |
| TM-11 | Repudiation                                     | A failed or malicious action cannot be traced across application boundaries                                 | Medium                                               | Event and correlation identifiers, UTC timestamps, application version metadata, structured logs, and documented retention                                      |
| TM-12 | Denial of service                               | Requests, queue backlogs, retries, or jobs exhaust CPU, memory, storage, CI minutes, or future cloud budget | Medium                                               | Input limits, queue bounds where appropriate, retry limits and backoff, resource limits, quotas, budget alerts, and teardown procedures                         |
| TM-13 | Information disclosure / elevation of privilege | Development services bind publicly or use insecure default credentials                                      | Medium                                               | Bind locally by default, require explicit configuration, avoid committed default passwords, document exposed ports, and test safe startup behavior              |
| TM-14 | Tampering                                       | An unauthorized or unreviewed artifact is presented as an official release                                  | Medium before releases; High afterward               | Protected release process, traceability to commits and CI runs, versioned artifacts, checksums or signatures in later phases, and release ownership rules       |
| TM-15 | Denial of service / tampering                   | A poison event repeatedly fails and blocks useful queue processing                                          | Medium                                               | Failure classification, bounded retries, dead-letter handling when justified, operational visibility, and documented replay procedures                          |

## Initial security requirements

Before completing Phase 1:

- External input must be schema-validated.
- Battery percentages must be constrained to the accepted range.
- Events must have stable unique identifiers.
- Consumers must handle duplicate delivery safely.
- Cross-application requests and events must carry correlation identifiers.
- Logs must not contain credentials or unnecessary personal information.
- Local services must not bind to public interfaces by default.
- Credentials must be loaded from the environment or an approved local secret mechanism.
- Committed configuration examples must contain safe demonstration values only.
- Each application must document its owned data.
- Application-specific database permissions should be used where practical.
- Dependencies must be locked to reproducible versions.
- Failure behavior must be tested and documented.

## Accepted and temporary risks

### Sole organization owner

Trai Lynne Compton is currently the sole owner of the `TraiLynneCore` organization.

This creates an account-recovery and administrative-continuity risk. The risk is temporarily accepted because the project is currently maintained by one person.

Current controls include required 2FA and maintained account-recovery methods.

**Revisit before:** Adding maintainers, publishing a supported release, or operating a production environment.

### No application-user authentication in the first milestone

The first milestone uses a local simulated client and does not include user accounts or real devices.

The absence of application authentication is accepted only while the system remains local, uses simulated data, and is not exposed to untrusted networks.

**Revisit before:** Public network exposure, remote clients, real devices, or personal data.

### Shared local PostgreSQL server

Applications initially share one PostgreSQL server while maintaining separate logical data ownership.

This creates shared infrastructure availability and isolation risk but reduces early operational overhead.

**Revisit before:** Production deployment or when measured security, reliability, scaling, or lifecycle needs require stronger isolation.

## Verification activities

Phase 0 and later implementation should provide evidence that:

- Repository history contains no known credentials or sensitive personal information.
- Vulnerabilities have a private reporting path before public release.
- Branch and workflow protections prevent unreviewed privileged changes.
- Invalid and oversized events fail safely.
- Duplicate events do not produce duplicate outcomes.
- An application cannot modify another application’s owned database state.
- Logs and examples contain only sanitized data.
- A stopped consumer can recover and safely process queued work.
- Retry behavior does not create an uncontrolled loop.
- Future cloud exercises include budget and teardown verification.

## Review triggers

Review and update this threat model:

- At every roadmap phase boundary
- Before making a repository public
- Before exposing an application endpoint beyond the local machine
- Before adding real devices, user accounts, or personal data
- Before adding CI/CD credentials
- Before introducing containers, Kubernetes, or cloud infrastructure
- When an application, trust boundary, or data flow changes
- After a vulnerability, credential exposure, or security incident
- When a risk is accepted, rejected, or materially changes

## References

- [Security Policy](../../SECURITY.md)
- [TLCore 2.0 Project Charter](../PROJECT_CHARTER.md)
- [TLCore System Overview](../architecture/SYSTEM_OVERVIEW.md)
- [ADR-0001: Use separate repositories for independently deployable applications](../adr/0001-multi-repository-strategy.md)
- [ADR-0002: Begin with an event-driven polyglot architecture](../adr/0002-initial-event-driven-architecture.md)
