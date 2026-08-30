# Contributing to TLCore

Thank you for your interest in TLCore.

TLCore is a long-lived engineering laboratory focused on DevOps, platform engineering, site reliability engineering, cloud infrastructure, and security. Contributions should strengthen the system’s architecture, operation, reliability, security, documentation, or educational value.

## Start here

Before contributing, review:

- [Project Charter](docs/PROJECT_CHARTER.md)
- [System Overview](docs/architecture/SYSTEM_OVERVIEW.md)
- [Architecture Decision Records](docs/adr/)
- [Repository Governance](docs/governance/REPOSITORY_GOVERNANCE.md)
- [Security Policy](SECURITY.md)
- [Initial Threat Model](docs/security/THREAT_MODEL.md)

These documents explain what TLCore is, how it evolves, and which decisions have already been made.

## Repository scope

`TraiLynneCore/tlcore` is the central repository for:

- Project governance
- Roadmap and milestone documentation
- System-wide architecture
- Architecture Decision Records
- Security and contribution policies
- Cross-application contracts and operational documentation

Independently deployable applications use separate repositories.

Do not add JavaScript gateway, Python processor, Ruby worker, or platform implementation code to this repository unless an accepted architectural decision changes the repository strategy.

## Before beginning work

Search existing issues, pull requests, and ADRs before proposing a change.

Use an issue for:

- Application features
- Bugs and regressions
- Infrastructure changes
- Operational exercises
- Substantial security or architecture work
- Work requiring acceptance criteria or coordination

An issue is optional for small documentation corrections and minor repository maintenance.

Discuss a change before implementation when it:

- Changes an application or system boundary
- Selects a foundational technology
- Changes data ownership or communication patterns
- Introduces a paid service
- Affects credentials, identity, permissions, or sensitive data
- Is difficult or expensive to reverse

## Development workflow

1. Begin from the current `main` branch.
2. Create a short-lived working branch.
3. Make one coherent change.
4. Add or update tests and documentation as applicable.
5. Run the relevant validation locally.
6. Review the complete change for correctness, scope, security, and sensitive information.
7. Open a pull request using the repository template.
8. Resolve review feedback and automated checks.
9. Merge using the repository’s approved strategy.
10. Delete the working branch after merge.

Detailed branch, review, merge, and release rules are defined in [Repository Governance](docs/governance/REPOSITORY_GOVERNANCE.md).

## Branch names

Use a short, lowercase, hyphen-separated name with an appropriate prefix.

Examples:

```text
feat/battery-event-api
fix/duplicate-event-processing
docs/update-system-diagram
ci/contract-tests
security/restrict-database-access
```

## Commits

Use Conventional Commit-style subjects:

```text
type(optional-scope): short description
```

Examples:

```text
docs(adr): record repository strategy
feat(gateway): accept battery status events
fix(processor): prevent duplicate classification
```

Keep commits focused. Do not include unrelated changes, temporary files, credentials, personal information, or debugging artifacts.

## Architecture Decision Records

Create an ADR when a decision:

- Changes system or application boundaries
- Selects a foundational technology or external service
- Defines data ownership
- Changes communication or deployment patterns
- Creates a significant security or cost commitment
- Establishes a convention affecting multiple repositories
- Would be difficult or costly to reverse

Use the template at:

```text
docs/adr/0000-template.md
```

An accepted ADR is a historical record. Replace a changed decision with a new ADR that supersedes the earlier one rather than silently rewriting it.

## Validation

The validation required depends on the change.

### Documentation changes

Check:

- Technical accuracy
- Links and file paths
- Markdown rendering
- Mermaid diagram rendering, when applicable
- Consistency with the charter, roadmap, and accepted ADRs
- Absence of credentials and unnecessary personal information

### Application changes

Check:

- Unit tests
- Integration tests
- Contract tests
- Invalid inputs and failure behavior
- Startup and shutdown behavior
- Configuration handling
- Relevant security and observability behavior

### Infrastructure and automation changes

Check:

- Formatting and validation
- Proposed changes before applying them
- Security and policy checks
- Cost impact
- Failure and rollback behavior
- Successful cleanup or teardown
- Least-privilege access

Repository-specific commands will be documented in each repository’s README.

## Pull requests

A pull request should:

- Explain what changed and why
- Link the relevant issue when one exists
- Identify the roadmap phase or milestone
- Describe validation performed
- Address architecture, security, privacy, cost, and operational impacts
- Link or include relevant ADRs
- Describe risks and recovery where applicable
- Remain limited to its intended scope

While TLCore has one maintainer, pull requests receive a documented self-review. External approval requirements will be introduced when another qualified maintainer is available.

## Definition of done

A change is complete when:

- Its acceptance criteria are satisfied.
- Relevant tests and validation pass.
- Documentation is updated or confirmed unnecessary.
- Security, privacy, cost, observability, and failure behavior were considered.
- Required architectural decisions are documented.
- No credentials, personal data, sensitive evidence, or temporary artifacts are included.
- The pull request contains no unrelated changes.
- Follow-up work is linked or documented.
- The change is merged and the working branch is removed.

## Security

Do not report suspected vulnerabilities through public issues, discussions, or pull requests.

Follow [SECURITY.md](SECURITY.md) for private reporting instructions.

Never include credentials, tokens, private keys, connection strings, session data, real private-device data, or unnecessary personal information in a contribution.

Sanitize logs, screenshots, traces, event payloads, and configuration before sharing them.

## Cost awareness

A contribution that introduces a paid service or cloud resource must follow the [Cost and Credential Policy](docs/governance/COST_AND_CREDENTIALS.md).

The proposal must identify:

- Why the resource is needed
- Why a local or free alternative is insufficient
- Its expected maximum cost
- Its owner
- Its teardown or cancellation plan

## Dependency expectations

New dependencies must be justified.

Before adding one, consider:

- Whether the problem can be solved reasonably without it
- Maintenance activity and project health
- Security history
- License compatibility
- Runtime and build impact
- Whether it expands trusted code or operational complexity

Lockfiles must be committed when the package ecosystem uses them.

## AI-assisted contributions

AI tools may assist with research, drafting, implementation, and review, but contributors remain responsible for everything they submit.

A contributor must:

- Understand and be able to explain the submitted change
- Verify technical claims and generated code
- Review licenses and provenance
- Test behavior and failure cases
- Avoid sending project credentials or sensitive data to AI tools
- Disclose material AI assistance when it affects review, provenance, or risk

AI-generated output is not evidence that a change is correct or safe.

## Licensing

TLCore is licensed under the [Apache License 2.0](LICENSE).

Unless explicitly stated otherwise, any contribution intentionally submitted for inclusion in TLCore is provided under the same license.

By contributing, you confirm that:

- You have the right to submit the contribution.
- The contribution does not knowingly violate another party’s rights.
- Required third-party notices and licenses are included.
- You understand that accepted contributions may be publicly distributed under Apache-2.0.

## Conduct

Be respectful, specific, and constructive.

Focus review on the work and its impact. Ask questions when intent or reasoning is unclear. Document disagreements and decisions without personal attacks or dismissive language.

A formal Code of Conduct may be added if TLCore develops an active contributor community.
