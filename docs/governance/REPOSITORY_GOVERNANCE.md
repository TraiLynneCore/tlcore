# Repository Governance

- **Status:** Approved
- **Owner:** Trai Lynne Compton
- **Last updated:** 2026-08-29
- **Review cadence:** At each phase boundary and when repository ownership changes

## Purpose

This policy defines how TLCore repositories are named, owned, changed, reviewed, merged, versioned, and released.

The goal is to protect trusted branches and preserve useful engineering history without creating unnecessary process for a solo-maintained laboratory.

## Repository structure

`TraiLynneCore/tlcore` is the canonical project and governance repository.

Independently deployable applications receive separate repositories when implementation begins. Repository boundaries and naming are governed by [ADR-0001](../adr/0001-multi-repository-strategy.md).

Planned names include:

- `tlcore` — project governance and system documentation
- `tlcore-gateway` — JavaScript gateway
- `tlcore-processor` — Python event processor
- `tlcore-worker` — Ruby background worker
- `tlcore-platform` — shared infrastructure and deployment automation

A repository should not be created merely to reserve a name. It must have a justified implementation, deployment, ownership, or lifecycle boundary.

## Ownership

Trai Lynne Compton is the initial owner and maintainer of all TLCore repositories.

The product, technical, security, and repository-owner responsibilities remain conceptually separate even while held by one person.

Ownership and elevated access must be reviewed before adding maintainers. Access should follow least privilege, and administrative permission should not be granted solely because someone contributes code.

## Default branch

The default branch is:

```text
main
```

`main` represents the trusted and current state of the repository.

After the Phase 0 bootstrap process:

- Changes should enter `main` through pull requests.
- Force pushes to `main` are prohibited.
- Deletion of `main` is prohibited.
- Required automated checks will be added as the project gains CI.
- Direct pushes should be disabled.

## Working branches

Changes are developed on short-lived branches created from current `main`.

Use these prefixes:

| Prefix      | Purpose                                                  |
| ----------- | -------------------------------------------------------- |
| `feat/`     | New application behavior                                 |
| `fix/`      | Bug corrections                                          |
| `docs/`     | Documentation                                            |
| `chore/`    | Repository or maintenance work                           |
| `ci/`       | Continuous-integration automation                        |
| `test/`     | Test-only changes                                        |
| `refactor/` | Internal restructuring without intended behavior changes |
| `security/` | Focused security changes                                 |

Examples:

```text
docs/phase-0-governance
feat/battery-event-api
fix/duplicate-event-processing
ci/contract-tests
security/restrict-database-access
```

Branch names should be short, lowercase, and hyphen-separated.

Working branches should be deleted after merge. Permanent environment, release, feature, and hotfix branches are not used.

## Issues

Issues are expected for:

- Application features
- Bugs and regressions
- Infrastructure changes
- Operational exercises
- Substantial security changes
- Work requiring acceptance criteria or coordination
- Work that should be tracked across multiple pull requests

Issues are optional for:

- Small documentation corrections
- Typographical fixes
- Minor repository maintenance
- Phase 0 bootstrap documentation when the scope is already clear

An issue should explain the outcome and boundaries of the work. It should not prescribe an implementation unless a technical constraint has already been decided.

Security vulnerabilities must not be reported through public issues. Follow the repository’s `SECURITY.md`.

## Commits

TLCore uses the Conventional Commits style:

```text
type(optional-scope): short description
```

Common types include:

- `feat` — new behavior
- `fix` — bug correction
- `docs` — documentation
- `chore` — maintenance
- `ci` — automation
- `test` — tests
- `refactor` — internal restructuring
- `perf` — performance improvement
- `build` — build-system or dependency changes

Examples:

```text
docs(adr): record repository strategy
feat(gateway): accept battery status events
fix(processor): prevent duplicate classification
ci(test): add contract test workflow
```

Commit subjects should be concise, imperative, and describe one coherent change.

Credentials, personal information, temporary debugging artifacts, and unrelated changes must not be included.

## Pull requests

After Phase 0 bootstrap, changes should be merged through pull requests.

A pull request should:

- Explain what changed and why
- Link its issue when one exists
- Identify the roadmap phase or milestone
- Describe validation performed
- Address security, privacy, cost, and operational effects
- Link or include an ADR when required
- Describe risks and recovery where applicable
- Remain limited to a coherent scope

Draft pull requests may be used for early feedback but must not be merged until ready.

## Review requirements

### While there is one maintainer

While Trai Lynne Compton is the sole maintainer:

- Pull requests receive a documented self-review.
- No external approval is required.
- Automated checks must pass when those checks exist.
- Review conversations must be resolved before merge.
- High-risk changes should receive additional manual verification and may remain open for a deliberate cooling-off period.

### After maintainers are added

When another qualified maintainer is available:

- At least one approval is required.
- The author cannot satisfy their own approval requirement.
- Two approvals should be required for high-risk changes when practical.

High-risk changes include:

- Authentication and authorization
- Credential or secret handling
- Cryptography
- Repository and deployment permissions
- CI/CD workflows with privileged access
- Destructive data migrations
- Security-policy exceptions
- Production or cloud networking
- Artifact-signing and release workflows

## Merge strategy

Squash merge is the default.

The final squash commit should follow the project’s commit-title convention and describe the complete pull-request outcome.

A regular merge may be used when preserving a meaningful series of commits is important. Rebase merging is not the default.

The branch should be deleted after a successful merge.

## Architecture decisions

An ADR is required when a decision:

- Changes an application or system boundary
- Selects a foundational technology or managed service
- Defines data ownership
- Changes communication or deployment patterns
- Introduces a significant security or cost commitment
- Is difficult or expensive to reverse
- Establishes a convention that affects multiple repositories

ADRs use the template in `docs/adr/0000-template.md`.

Accepted ADRs are historical records. A changed decision receives a new ADR that supersedes the previous record.

## Versioning

Each independently deployable application uses Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Before a stable public interface is intentionally declared, application versions remain below `1.0.0`.

Examples:

```text
v0.1.0
v0.2.0
v0.2.1
```

- Increment `MINOR` for new backward-compatible behavior during initial development.
- Increment `PATCH` for backward-compatible corrections.
- Declare `1.0.0` only when the application’s supported interface and compatibility expectations are documented.
- After `1.0.0`, increment `MAJOR` for incompatible changes.

The central `tlcore` governance repository uses roadmap phases and Git history rather than application-version releases.

## Releases

A release must originate from protected `main`.

A release should include:

- An immutable Git tag using `vMAJOR.MINOR.PATCH`
- A description of user-visible and operational changes
- The source commit
- Relevant test and build evidence
- Known limitations
- Breaking-change or migration instructions
- Recovery or rollback information when applicable

Released artifacts must eventually be traceable to their source, workflow, dependencies, and test results.

Release automation will be introduced when the first application approaches a releasable milestone.

## Urgent fixes

TLCore does not use a permanent hotfix branch.

An urgent correction follows the normal workflow:

```text
main → fix/short-description → pull request → main
```

Urgency may shorten the review timeline, but it does not justify bypassing security checks, validation, or release traceability.

## Exceptions

Exceptions must document:

- The rule being excepted
- Why the exception is necessary
- Risks created
- Compensating controls
- Decision owner
- Expiration or review date

Convenience alone is not sufficient justification for bypassing branch protection, review, credential, or release controls.

## Review triggers

Review this policy:

- At each roadmap phase boundary
- When another maintainer is added
- When automated checks become available
- Before the first versioned application release
- Before production or cloud deployment
- After a repository-security or release-process incident

## References

- [TLCore 2.0 Project Charter](../PROJECT_CHARTER.md)
- [ADR-0001: Use separate repositories for independently deployable applications](../adr/0001-multi-repository-strategy.md)
- [Cost and Credential Policy](COST_AND_CREDENTIALS.md)
- [Security Policy](../../SECURITY.md)
