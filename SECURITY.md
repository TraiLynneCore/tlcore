# Security Policy

Security is a foundational requirement of TLCore. This policy explains how to report suspected vulnerabilities and how the project handles security information.

## Supported versions

TLCore is currently under active development and has no supported production releases.

Security fixes will initially be applied to the latest version of the default branch. A version-support policy will be introduced when TLCore begins publishing versioned releases.

## Reporting a vulnerability

Do not report suspected vulnerabilities through public GitHub issues, discussions, pull requests, or other public channels.

When this repository becomes public, use GitHub's **Report a vulnerability** feature under the repository's Security tab. Reports submitted through that feature are shared privately with the repository owner.

Private vulnerability reporting must be enabled before this repository is made public.

## What to include

Provide enough information to understand and reproduce the issue safely:

- A clear description of the vulnerability
- The affected component, version, branch, or commit
- Steps to reproduce the issue
- The potential security impact
- Any relevant sanitized logs or evidence
- A suggested mitigation, if known

Do not include:

- Active credentials, tokens, private keys, or session data
- Unnecessary personal information
- Real private-device data
- Data belonging to another person or system
- Destructive proof-of-concept activity

Use demonstration values and the minimum access necessary to confirm the issue.

## Response expectations

The project aims to:

- Acknowledge a report within three business days
- Complete an initial assessment within seven business days
- Communicate whether the report was accepted, requires more information, or is not considered a vulnerability
- Provide remediation or mitigation expectations after the initial assessment
- Coordinate public disclosure when disclosure is appropriate

These targets may evolve as the project and maintainer team grow.

## Coordinated disclosure

Please allow reasonable time for investigation and remediation before publicly disclosing a vulnerability.

When appropriate, TLCore will:

1. Confirm the affected components and versions.
2. Develop and validate a remediation.
3. Rotate or revoke exposed credentials immediately.
4. Document the security impact and required user actions.
5. Publish a security advisory after a fix or mitigation is available.
6. Credit the reporter unless they prefer to remain anonymous.

## Security incidents

If a credential or sensitive value is committed, it must be treated as compromised even if the commit is quickly removed or the repository is private.

The response should include:

1. Revoke or rotate the exposed value.
2. Review available logs for unauthorized use.
3. Remove the value from active project files and history where appropriate.
4. Correct the process that allowed the exposure.
5. Document lessons learned without reproducing the secret.

Deleting a Git commit alone does not make an exposed credential safe again.

## Scope

This policy applies to TLCore source code, automation, infrastructure definitions, deployment configuration, dependencies, and documented operational processes.

Security concerns in third-party products should also be reported to the affected product's maintainer when appropriate.
