# Security Policy

TLCore is a personal learning project under active development. It does not currently have a production release or supported version.

## Report a vulnerability

Do not report a suspected vulnerability through a public issue, discussion, or pull request.

Use GitHub's **Report a vulnerability** option in the repository's Security tab. This sends the report privately to the repository owner.

Include enough information to understand the problem safely:

- What is affected.
- How the problem can be reproduced.
- The possible impact.
- Sanitized logs or evidence when useful.
- A suggested fix, if known.

## Protect sensitive information

Do not include:

- Passwords, tokens, API keys, private keys, or session data.
- Connection strings containing credentials.
- Personal information or real private-device data.
- Sensitive logs, screenshots, configuration, or environment files.
- Destructive proof-of-concept activity.

Use demonstration values and simulated data whenever possible.

## Exposed credentials

Treat an exposed credential as compromised even if it was committed briefly or the repository was private.

If a credential is exposed:

1. Revoke or rotate it immediately.
2. Check available logs for unexpected use.
3. Remove it from active project files and history when appropriate.
4. Fix the process that allowed the exposure.
5. Record the lesson without reproducing the secret.

Deleting a commit does not make an exposed credential safe again.

## Current scope

This policy applies to TLCore code, documentation, automation, infrastructure, dependencies, and configuration.

Security practices will grow with the working system. A more detailed threat model will be added when implemented behavior and real trust boundaries exist to evaluate.
