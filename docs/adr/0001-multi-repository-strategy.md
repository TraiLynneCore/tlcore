# ADR-0001: Use separate repositories for independently deployable applications

- **Status:** Accepted
- **Date:** 2026-08-29
- **Decision owner:** Trai Lynne Compton
- **Related issues:** None — Phase 0 repository bootstrap

## Context

TLCore is planned as a small distributed system with independently deployable JavaScript, Python, and Ruby applications plus shared platform work.

The project needs clear application boundaries while still giving visitors one place to understand TLCore as a complete system. Repository creation should also follow real implementation needs rather than creating empty repositories in advance.

## Options considered

### One monorepo

Keep every application, infrastructure definition, and document in one repository.

- **Benefits:** Simple setup, one place to work, and easier changes across several components.
- **Drawbacks:** Independent application and release boundaries may become unclear, and automation may become tightly coupled.

### Separate application repositories with one central project repository

Keep project-wide direction and shared documentation in `tlcore`. Create one repository for each independently deployable application when its implementation begins.

- **Benefits:** Clear application ownership, focused tests and releases, and one public entry point for the whole project.
- **Drawbacks:** Cross-application changes and shared contracts require coordination.

### Fully separate repositories with no central project repository

Keep each component independent and provide no central TLCore repository.

- **Benefits:** Strong component independence and fewer central files.
- **Drawbacks:** The roadmap, architecture, and overall learning journey would be harder to discover.

## Decision

TLCore will use separate repositories for independently deployable applications and one central repository for project-wide direction and shared documentation.

The planned repositories are:

| Repository | Purpose |
| --- | --- |
| `tlcore` | Project direction and shared documentation |
| `tlcore-gateway` | JavaScript gateway and external API |
| `tlcore-processor` | Python event-processing application |
| `tlcore-worker` | Ruby background jobs and follow-up workflows |
| `tlcore-platform` | Infrastructure and deployment automation |

An application repository will be created when implementation begins, not simply to reserve its name.

## Why this option

This approach keeps deployable applications independent while preserving one place to understand the project. It also provides practical experience with cross-repository contracts, automation, releases, and coordination.

## Tradeoffs

This decision makes application ownership, dependencies, tests, and releases easier to separate.

It also means:

- Changes across applications may require several pull requests.
- Event and API compatibility must be managed deliberately.
- Repository settings and automation may be repeated.
- Local development must eventually coordinate several repositories.

The central `tlcore` repository will provide the repository map, shared rules, roadmap, architecture overview, and cross-project decisions needed to reduce confusion.

## How it will be validated

The decision is working when:

- A visitor can identify each repository's purpose.
- Each application can be built, tested, configured, and released independently.
- Project-wide direction remains easy to find through `tlcore`.
- Cross-application contracts can change without hidden coupling.
- Repository coordination does not prevent the system from remaining usable.

## Revisit when

Reconsider this decision if:

- Cross-repository work routinely blocks progress.
- Shared automation becomes difficult to maintain.
- Components no longer have independent deployment lifecycles.
- The number of repositories creates more overhead than learning or engineering value.

If the strategy changes, create a new ADR that supersedes this record.

## Reference

- [The Twelve-Factor App: Codebase](https://12factor.net/codebase)
