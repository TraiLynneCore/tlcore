# Public Repository Safety Policy

- **Status:** Approved
- **Owner:** Trai Lynne Compton
- **Last updated:** 2026-08-29
- **Applies to:** All repositories in the `TraiLynneCore` organization

## Purpose

This policy defines the requirements a TLCore repository must satisfy before and after becoming public.

Public repositories are treated as permanently accessible. Information may be copied, indexed, cached, forked, or retained even if it is later removed from GitHub.

Changing a repository back to private does not guarantee that previously published information has been recovered.

## Core rules

1. Never commit credentials or sensitive personal information.
2. Use simulated or deliberately public data in source code, tests, documentation, and demonstrations.
3. Treat Git history as permanent.
4. Review evidence before publishing it.
5. Give automation the minimum required permissions.
6. Keep repository ownership, security contacts, and policies current.
7. Respond to exposure by revoking access, not merely deleting content.
8. Complete a public-readiness review before announcing or sharing a repository.

## Prohibited information

The following must not be stored in a public TLCore repository:

- Passwords
- API keys
- Access or refresh tokens
- Personal access tokens
- Private keys
- Session cookies
- Recovery codes
- Database credentials
- Connection strings containing credentials
- Webhook secrets
- Cloud account credentials
- Real private-device identifiers
- Home addresses or precise private locations
- Private network diagrams, addresses, or account details
- Personal communications
- Unpublished vulnerability details
- Sensitive information belonging to another person or organization
- Real production or irreplaceable personal data

Encoding, encrypting with a committed key, shortening, redacting incompletely, or placing a value in an old commit does not make it safe to publish.

## Safe demonstration data

TLCore examples and tests should use:

- Clearly fictional device identifiers
- Synthetic battery values
- Reserved or local network addresses
- Demonstration account names
- Nonfunctional credentials such as `example-value-not-a-secret`
- Generated test data that cannot be linked to a real person
- Timestamps and identifiers created specifically for the demonstration

Example data should look realistic enough to teach the workflow without representing a real private system.

## Local configuration

Local credentials and environment-specific values belong in ignored files or approved credential stores.

The expected pattern is:

```text
.env              Local values; never committed
.env.example      Safe variable names and demonstration values; committed
```

An `.env.example` file must:

- Contain no working credentials
- Use obviously safe placeholder values
- Explain required variables
- Avoid revealing unnecessary private infrastructure details

Applications must not silently fall back to insecure default credentials.

## Ignore-file requirements

Each repository must maintain a `.gitignore` appropriate to its languages, tools, infrastructure, and development environment.

Ignore rules should cover applicable:

- Local environment files
- Private keys and certificates containing private material
- Terraform state
- Local databases
- Logs
- Temporary files
- Dependency directories
- Build output
- Test and coverage artifacts
- Editor and operating-system files

A `.gitignore` does not prevent intentional forced addition, and it does not remove files already tracked by Git. Files must still be reviewed before every commit.

## Issues and pull requests

Public issues and pull requests must not contain:

- Vulnerability details requiring private disclosure
- Credentials or configuration secrets
- Unsanitized logs
- Real private-device events
- Personal information
- Screenshots containing private tabs, notifications, filenames, accounts, or network information
- Links to private resources that unintentionally grant access

Before submitting diagnostic material:

1. Copy only the minimum relevant evidence.
2. Redact sensitive values at the source.
3. Check surrounding terminal and browser content.
4. Verify that identifiers use demonstration data.
5. Review the final uploaded version.

Deleting an issue or editing a comment does not guarantee that its earlier contents are no longer available.

## Documentation and diagrams

Documentation must avoid exposing unnecessary details about:

- Personal networks
- Device names tied to a real household
- Cloud account identifiers
- Private repository locations
- Administrative interfaces
- Security-control weaknesses that have not been remediated
- Credentials disguised as examples

Architecture diagrams should describe meaningful trust boundaries without publishing unnecessary access details.

## AI-assisted work

Do not send TLCore credentials, private configuration, real personal-device data, unpublished vulnerability details, or other sensitive information to AI tools.

Before using an AI system:

- Replace real values with synthetic examples.
- Limit the shared context to what is necessary.
- Review files and command output for hidden sensitive information.
- Treat generated content as untrusted until verified.
- Confirm that generated examples do not resemble active credentials.

Contributors remain responsible for the security, accuracy, and licensing of AI-assisted work.

## Dependencies and copied material

Before committing third-party material:

- Confirm that its license permits the intended use.
- Preserve required copyright and attribution notices.
- Avoid copying code from sources with unclear provenance.
- Prefer direct dependencies over copied source when appropriate.
- Review generated files and vendored content for embedded credentials.
- Document substantial third-party assets.

Public availability does not mean material is free to reuse.

## Automation and workflows

Repository automation must follow least privilege.

Before enabling a workflow:

- Set explicit token permissions.
- Avoid providing secrets to workflows triggered by untrusted pull requests.
- Review changes to workflow files with extra care.
- Pin third-party actions to immutable commit references when practical.
- Limit which actions and reusable workflows may run.
- Avoid printing environment variables or secret-bearing commands.
- Set timeouts and concurrency controls to limit resource use.
- Review generated artifacts and logs for sensitive information.

Privileged deployment workflows require separate review before they are introduced.

## Pre-publication history review

Before changing repository visibility:

- Review every tracked file.
- Review the full reachable Git history, including branches and tags intended for publication.
- Search for credentials, private keys, connection strings, and personal information.
- Inspect deleted and renamed configuration files in history.
- Review commit messages, author information, and embedded metadata.
- Review large files, binary files, screenshots, and diagrams.
- Review issues, pull requests, releases, workflow logs, and artifacts if they exist.
- Confirm that submodules and links do not expose private resources.
- Rotate any credential that may have entered history, even if it was later removed.

History-rewriting tools may remove published material from the current repository, but they do not make an exposed credential safe. Rotation or revocation remains mandatory.

## GitHub settings

Before publicly announcing a repository:

- Confirm the intended owner and visibility.
- Require 2FA for organization members.
- Protect `main`.
- Prevent force pushes and deletion of `main`.
- Require pull requests after bootstrap.
- Enable available secret scanning and push protection.
- Enable dependency vulnerability alerts.
- Review GitHub Actions permissions.
- Review deploy keys, webhooks, installed applications, and tokens.
- Confirm `SECURITY.md` is visible and accurate.
- Confirm the repository has an intentional license.
- Confirm issue and pull-request templates render correctly.

GitHub private vulnerability reporting is available after the repository becomes public. Enable it immediately after changing visibility and before announcing or broadly sharing the repository.

The public-readiness review remains incomplete until the private reporting option is verified.

## Portfolio review

Before announcing a repository for job-search purposes:

- The README clearly explains the project and its current maturity.
- Links to the charter, roadmap, architecture, contribution guide, and security policy work.
- Incomplete work is labeled honest
