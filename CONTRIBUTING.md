# Contributing to TLCore

TLCore is a personal engineering laboratory maintained by Trai Lynne Compton. Contributions should support the project's learning goals or improve the working system.

## Repository scope

This repository contains project-wide direction and shared documentation.

Independently deployable applications will use their own repositories when implementation begins:

- `tlcore-gateway`
- `tlcore-processor`
- `tlcore-worker`
- `tlcore-platform`

Application code should be added to the repository that owns that application.

## When to use an issue

Use a GitHub issue for:

- Planned features or engineering tasks.
- Bugs and regressions.
- Architecture or infrastructure changes.
- Work that needs clear acceptance criteria or dependencies.

Small repository-maintenance changes may proceed without an issue, but every repository change still requires a branch and pull request.

## Development workflow

1. Start from the current `main` branch.
2. Create a short-lived branch.
3. Make one focused change.
4. Add or update tests when behavior changes.
5. Run the relevant tests or validation locally.
6. Review the complete diff for correctness and unrelated changes.
7. Update documentation only when the implemented behavior or project usage changed.
8. Open a pull request.
9. Merge after the change and its validation have been reviewed.
10. Delete the branch after merge.

## Branch names

Use a short, lowercase name that describes the work.

Examples:

```text
feat/battery-event-api
fix/duplicate-processing
docs/simplify-roadmap
ci/add-contract-tests
```

## Commits

Keep commits focused and use a short subject that explains the change.

The preferred format is:

```text
type(optional-scope): short description
```

Examples:

```text
feat(gateway): accept battery events
fix(processor): prevent duplicate classification
docs(readme): clarify current phase
```

## Architecture decisions

Create an Architecture Decision Record when a choice is important and would be difficult or disruptive to reverse. Examples include changing application boundaries, selecting a foundational service, or changing data ownership.

Do not create an ADR for routine implementation details. Use the template in `docs/adr/0000-template.md` when an ADR is needed.

## Validation

Run the checks that are relevant to the change:

- Application changes: focused tests plus the repository's full test suite.
- Documentation changes: review the rendered Markdown, links, diagrams, and diff.
- Infrastructure changes: validate the configuration and confirm the change can be safely reversed or removed.

Repository-specific commands belong in that repository's README.

## Security and cost

Never commit credentials, private keys, personal data, real private-device data, or sensitive diagnostic evidence. Follow [SECURITY.md](SECURITY.md) when reporting a vulnerability.

Permanent development should remain local and free of recurring project costs. A paid or cloud resource must have a clear learning purpose, expected cost, owner, and removal plan before it is introduced.

## Definition of Done

A change is complete when:

- Its intended outcome works.
- Relevant tests and checks pass.
- The pull request contains no unrelated changes or sensitive information.
- Documentation is updated only when needed.
- Important architectural decisions are recorded when needed.
- The pull request is merged and the branch is removed.
