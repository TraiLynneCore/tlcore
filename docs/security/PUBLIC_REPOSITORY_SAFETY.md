# Public Repository Safety

TLCore repositories are intended to be public learning and portfolio projects. This guide provides a practical safety checklist for publishing code, documentation, configuration, and engineering evidence.

Making a repository private later does not undo information that was already published.

## Never publish

Do not commit or share:

- Passwords, tokens, API keys, private keys, or recovery codes.
- Session cookies or authentication headers.
- Connection strings containing credentials.
- `.env` files or other local secret files.
- Personal information that is not required by the project.
- Real private-device data.
- Sensitive logs, traces, screenshots, recordings, or configuration.
- Private repository, account, or infrastructure details that could help someone gain access.

Encoding or hiding a secret does not make it safe to publish.

## Use safe demonstration data

Examples, tests, screenshots, and demos should use:

- Simulated events and device identifiers.
- Clearly fake credentials and hostnames.
- Generated data that cannot be connected to a real person.
- Sanitized logs containing only the evidence needed to explain a result.

## Before publishing a repository

- [ ] Review the current files for credentials and personal information.
- [ ] Review Git history for information removed from later commits.
- [ ] Confirm `.gitignore` covers local secrets, dependencies, build output, and editor files.
- [ ] Check documentation, examples, test data, screenshots, and logs.
- [ ] Review automation and third-party actions before allowing them to run.
- [ ] Use the minimum permissions required by workflows and integrations.
- [ ] Enable available secret scanning and push protection.
- [ ] Confirm vulnerabilities can be reported privately.
- [ ] Confirm the repository has an intentional license.

## Ongoing checks

Before merging a pull request:

- Review the complete diff.
- Confirm no sensitive or unrelated files were added.
- Check new dependencies and automation for unnecessary access.
- Sanitize diagnostic evidence.
- Verify example configuration contains no working credentials.

Repeat the full publication checklist before adding cloud access, real-device integrations, external contributors, or public demonstrations.

## If sensitive information is exposed

1. Revoke or rotate the exposed credential immediately.
2. Review available logs for unexpected use.
3. Remove the information from active files and history when appropriate.
4. Correct the process or configuration that allowed the exposure.
5. Record the lesson without repeating the sensitive value.

Removing a commit or making the repository private is not enough to make an exposed credential safe.

See [SECURITY.md](../../SECURITY.md) for private vulnerability reporting and credential-response guidance.
