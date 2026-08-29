# ADR-0001: Use separate repositories for independently deployable applications

- **Status:** Accepted
- **Date:** 2026-08-29
- **Decision owner:** Trai Lynne Compton
- **Related issues:** None — Phase 0 repository bootstrap

## Context

TLCore is a long-lived engineering laboratory built around a small polyglot distributed system. Its initial architecture will include independently deployable JavaScript, Python, and Ruby applications supported by shared platform infrastructure and system-wide documentation.

The Twelve-Factor App methodology describes a one-to-one relationship between an application and its version-controlled codebase. Each TLCore application must also be capable of being built, configured, tested, released, deployed, and scaled independently.

The project needs a repository structure that preserves those application boundaries while giving contributors and technical reviewers a clear entry point into the overall system.

## Decision drivers

- Preserve independent application codebases and deployment lifecycles
- Follow the Twelve-Factor codebase principle
- Make service ownership and responsibilities explicit
- Support focused continuous-integration and release workflows
- Keep system-wide governance and architecture easy to discover
- Avoid creating repositories before their boundaries are justified
- Provide realistic cross-repository platform-engineering experience

## Options considered

### Option 1: Single monorepo

Store all application code, infrastructure, documentation, and automation in one repository.

**Advantages**

- Simple initial repository setup
- Atomic changes across multiple applications
- Centralized discovery and dependency updates
- One location for development tooling and automation

**Disadvantages**

- Multiple independently deployable applications would share one codebase
- Application ownership and release boundaries could become unclear
- Continuous-integration workflows could become broader and more coupled
- Does not follow the Twelve-Factor codebase principle literally

### Option 2: Separate application repositories with a central project repository

Use one repository for project-wide governance and system documentation. Give each independently deployable application its own repository when implementation begins.

**Advantages**

- Preserves a distinct codebase for each deployable application
- Supports independent testing, releases, and deployment
- Makes application boundaries and ownership explicit
- Keeps project-wide documentation in one discoverable location
- Provides practical experience coordinating a distributed system across repositories
- Allows repositories to be created only when their need is demonstrated

**Disadvantages**

- Changes spanning applications require coordination across repositories
- Shared contracts and compatible versions require deliberate management
- Automation and repository settings may need to be maintained in several places
- Initial contributor navigation requires clear central documentation

### Option 3: Fully independent repositories without a central project repository

Place application code and its documentation entirely within separate repositories without maintaining a central TLCore repository.

**Advantages**

- Maximum independence between applications
- Each repository contains only information related to its component
- Few central governance files to maintain

**Disadvantages**

- No clear entry point for understanding TLCore as one system
- Project-wide architecture and roadmap information could become fragmented
- Governance rules could drift between repositories
- Contributors and reviewers would need to reconstruct the system from several locations

## Decision

TLCore will use separate repositories for independently deployable applications and a central repository for project-wide governance and system documentation.

The `TraiLynneCore/tlcore` repository is the canonical entry point for the project. It will contain:

- Project charter and roadmap
- Architecture overviews and system diagrams
- Architecture Decision Records
- Security and contribution policies
- Repository and development conventions
- Cross-service contracts and system-wide operational documentation, when appropriate

Each independently deployable application will receive its own repository when implementation of that application begins.

The initial naming plan is:

- `tlcore` — central governance and system documentation
- `tlcore-gateway` — JavaScript gateway and external API
- `tlcore-processor` — Python event-processing application
- `tlcore-worker` — Ruby background-job and integration application
- `tlcore-platform` — shared local and cloud infrastructure, deployment configuration, and platform automation

These future repositories will not be created during Phase 0 solely to reserve names. A repository will be created when its implementation or operational lifecycle begins.

All repositories are initially owned and administered by Trai Lynne Compton. Ownership rules will be reviewed before granting elevated access to future maintainers.

## Consequences

### Positive

- Each deployable application has an independent codebase and lifecycle.
- Service boundaries remain visible in both architecture and version control.
- Tests, dependencies, releases, and automation can remain focused.
- The central repository provides a clear starting point for contributors and reviewers.
- Infrastructure and application responsibilities remain distinguishable.
- Repository creation follows demonstrated need instead of speculative structure.

### Negative

- Cross-service changes may require multiple pull requests.
- API and event-contract compatibility must be managed deliberately.
- Repository settings and automation may require repeated configuration.
- Releases may need a system-level compatibility record in addition to application versions.
- Local development must eventually coordinate code from several repositories.

### Risks

- **Governance drift:** Repository conventions may become inconsistent.
  - Mitigation: Keep canonical governance rules in `tlcore` and reuse shared templates where practical.
- **Contract drift:** One application may change an interface without coordinating consumers.
  - Mitigation: Version contracts, use contract tests, and document compatibility expectations.
- **Contributor confusion:** Reviewers may not know where to begin.
  - Mitigation: Maintain a clear system README, repository map, and architecture documentation in `tlcore`.
- **Premature fragmentation:** Too many repositories could create administrative overhead.
  - Mitigation: Create a repository only for a justified deployable application, platform boundary, or independent lifecycle.

## Validation

This decision is working as intended when:

- A new contributor can identify the purpose and owner of each repository.
- Each application can be built, tested, configured, and released independently.
- System-wide documentation remains discoverable through `tlcore`.
- Cross-service contracts are versioned and tested.
- Repository conventions remain consistent without excessive manual duplication.
- Cross-repository coordination does not prevent phases from leaving the system in a working state.

## Revisit when

Review this decision if:

- Cross-repository changes routinely block delivery or create incompatible system states.
- Shared automation becomes difficult to maintain consistently.
- Two components no longer have genuinely independent deployment lifecycles.
- Repository access or compliance requirements demand different boundaries.
- The number of repositories creates more operational cost than educational or architectural value.
- A platform capability requires an ownership or lifecycle model not covered by this decision.

If the strategy changes, create a new ADR that supersedes this record rather than rewriting the original decision.

## References

- [The Twelve-Factor App: Codebase](https://12factor.net/codebase)
- [TLCore 2.0 Project Charter](../PROJECT_CHARTER.md)
