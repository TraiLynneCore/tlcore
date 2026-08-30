# Cost and Credential Policy

- **Status:** Approved
- **Owner:** Trai Lynne Compton
- **Last updated:** 2026-08-29
- **Review cadence:** At every phase boundary and before introducing a paid or externally hosted service

## Purpose

This policy establishes how TLCore manages financial cost, credentials, secrets, and access to external services.

TLCore must remain practical to operate locally at essentially no cost. Cloud and paid-service use must be intentional, bounded, temporary, and supported by a clear learning objective.

Credentials must never become part of the project’s source code, documentation, operational evidence, or public history.

## Core rules

1. Local execution is the permanent development baseline.
2. Recurring project cost defaults to zero unless an exception is explicitly approved.
3. A paid resource must have a purpose, owner, budget, and removal plan before it is created.
4. Cloud environments are temporary exercises, not permanent project dependencies.
5. Credentials are provided at runtime and never stored in source control.
6. Access follows least privilege and is separated by environment.
7. Any exposed credential is treated as compromised and rotated immediately.
8. Logs, screenshots, issues, pull requests, documentation, and AI prompts must not contain secrets or unnecessary personal information.

## Cost policy

### Local-first default

Ordinary development, testing, demonstrations, and operational exercises must run locally whenever practical.

Local tools and services should be preferred when they meet the learning objective without introducing unacceptable security, reliability, or maintenance costs.

The permanent TLCore environment must not depend on an active paid cloud account or subscription.

### Approval before paid use

Before creating or enabling a paid resource, document:

- The service or resource
- The engineering problem or learning objective it addresses
- Why a local or free alternative is insufficient
- The expected maximum cost
- The person responsible for the resource
- The planned creation time
- The planned destruction or cancellation time
- How successful cleanup will be verified

Trai Lynne Compton is the current cost approver.

### Budget requirements

Every cloud exercise must have a written maximum budget before resources are created.

When supported by the provider, configure alerts at:

- 50% of the approved exercise budget
- 80% of the approved exercise budget
- 100% of the approved exercise budget

Budget alerts are notifications, not guaranteed spending limits. Resource restrictions, quotas, short execution windows, and automated teardown remain necessary.

No resource should be described as “free” solely because it may qualify for a free tier. Usage limits, regional differences, taxes, data transfer, retained storage, and accidental overage must still be considered.

### Resource ownership and labels

Cloud resources must be labeled or tagged with:

- Project: `tlcore`
- Environment
- Owner
- Purpose or exercise
- Creation date
- Planned expiration or teardown date

Where the platform supports it, temporary resources should include an automated expiration or cleanup mechanism.

### Teardown requirements

A cloud exercise is not complete until:

- Application and infrastructure resources are destroyed
- Retained storage, snapshots, images, addresses, gateways, and load balancers are reviewed
- The provider console or inventory confirms that unexpected resources do not remain
- The actual cost is reviewed after billing data becomes available
- Any cost or cleanup lessons are documented

Infrastructure destruction must use the documented and reviewed process. Manual cleanup may be used to correct a failed teardown, but the failure must be investigated so future teardown remains reproducible.

### Cost review

Recurring charges and active external services must be reviewed at least monthly whenever TLCore has paid resources.

Unexpected spending must trigger:

1. Investigation
2. Containment or resource shutdown
3. Credential review if unauthorized use is possible
4. Documentation of the cause
5. A control improvement before repeating the exercise

## Credential policy

### Definition

Credentials and secrets include:

- Passwords
- API keys
- Access tokens
- Refresh tokens
- Personal access tokens
- Private keys
- Certificates containing private material
- Session cookies
- Database passwords
- Connection strings containing credentials
- Webhook secrets
- Encryption keys
- Recovery codes
- Cloud access keys
- Any value that grants access or proves identity

A value remains a credential even if it belongs only to a development environment.

### Approved storage

For local development:

- Store credentials in an ignored local environment file or an approved credential manager.
- Commit an `.env.example` file containing variable names and safe demonstration values only.
- Prefer operating-system credential stores or password managers for long-lived personal credentials.
- Limit file permissions for local secret files where supported.

For shared, CI, deployment, and cloud environments:

- Use the platform’s protected secret-storage mechanism.
- Prefer short-lived, identity-based credentials.
- Use GitHub OpenID Connect for future cloud authentication where practical.
- Avoid permanent cloud access keys for automation.
- Separate development, testing, staging, and production credentials.

### Prohibited locations

Credentials and sensitive values must not appear in:

- Git repositories or Git history
- Committed `.env` files
- Source code
- Container images or image layers
- Dockerfiles or build arguments that persist secrets
- Documentation or example commands
- Issues or pull requests
- Test fixtures
- Screenshots or recordings
- Logs, metrics, traces, or error messages
- Build artifacts
- Chat messages or AI prompts
- Public paste services
- Unencrypted personal notes

Encoding, encrypting with a committed key, or obscuring a credential does not make it safe to commit.

### Least privilege

Every credential must grant only the permissions required for its task.

Where practical:

- Use separate identities for people, applications, and automation.
- Use separate credentials for each application and environment.
- Restrict credentials to specific repositories, resources, actions, and time periods.
- Prefer read-only access unless write access is required.
- Avoid organization-wide tokens when repository-scoped access is sufficient.
- Remove unused credentials promptly.

### Credential lifetime and rotation

Prefer short-lived credentials that expire automatically.

Long-lived credentials must have:

- A documented owner
- A defined purpose
- The minimum required scope
- A review or expiration date
- A rotation procedure

Rotate credentials when:

- Exposure is suspected
- A person or system no longer requires access
- Permissions change
- The provider recommends rotation
- The credential reaches its defined rotation date
- A related device or account is lost or compromised

### Local configuration

Repositories must include an appropriate `.gitignore` before application secrets are introduced.

The standard local pattern is:

```text
.env              Local values; ignored
.env.example      Safe variable names and demonstration values; committed
```

An example value must be obviously non-secret and unusable against a real service.

Applications must fail clearly when required configuration is missing. They must not silently fall back to insecure default credentials.

### Logging and evidence

Applications and automation must avoid logging complete credentials, authorization headers, session data, or sensitive connection strings.

When sharing diagnostic evidence:

- Include only the fields needed to understand the problem.
- Redact sensitive values before copying the evidence.
- Use simulated device data.
- Check terminal output, browser tabs, filenames, and background windows before taking screenshots.
- Treat event payloads as potentially sensitive even when the initial project uses demonstration data.

Redaction should happen before evidence is uploaded, not after publication.

## Credential exposure response

If a credential may have been exposed:

1. Revoke or rotate it immediately.
2. Do not wait for confirmation that someone used it.
3. Identify the systems and permissions the credential could access.
4. Review available logs for unauthorized activity.
5. Contain any affected resources or sessions.
6. Remove the value from active files and documentation.
7. Clean repository history where appropriate, while recognizing that removal does not restore the credential’s safety.
8. Notify affected providers or people when required.
9. Document the cause and corrective action without reproducing the secret.
10. Add or improve controls that prevent the same exposure.

Deleting a commit, closing an issue, or making a repository private is not an adequate response by itself.

## Repository protections

Before a TLCore repository becomes public:

- Review the complete Git history for credentials and personal information.
- Enable available secret scanning and push protection.
- Verify `.gitignore` rules for the repository’s tools and runtimes.
- Confirm examples contain only safe values.
- Review issues, pull requests, releases, Actions logs, and artifacts.
- Remove unused deploy keys, webhooks, applications, and tokens.
- Confirm security-reporting instructions are accurate.

## Exceptions and risk acceptance

An exception to this policy must document:

- The rule being excepted
- Why the exception is necessary
- The affected systems and data
- The risk created
- Compensating controls
- The decision owner
- An expiration or review date

Convenience alone is not sufficient justification for storing credentials in source control or creating unbounded paid resources.

## Verification

This policy is working when:

- TLCore runs locally without paid services.
- No known credentials or sensitive personal information exist in repository history.
- Configuration examples are safe to publish.
- External resources have owners, budgets, and teardown evidence.
- Cloud exercises leave no unexpected resources running.
- Automation uses scoped and preferably short-lived identity.
- Credential-exposure exercises result in timely revocation, investigation, and documented improvement.

## Review triggers

Review this policy:

- At every roadmap phase boundary
- Before adding a paid service
- Before creating cloud resources
- Before introducing CI/CD credentials
- Before making a repository public
- After unexpected cost
- After credential exposure or suspected unauthorized access
- When a provider, authentication method, or deployment model changes

## References

- [TLCore Security Policy](../../SECURITY.md)
- [TLCore Initial Threat Model](../security/THREAT_MODEL.md)
- [TLCore 2.0 Project Charter](../PROJECT_CHARTER.md)
