# Cost and Credential Guide

TLCore should remain safe and affordable to operate as a personal learning laboratory.

## Core rules

- Permanent development runs locally and should not require recurring project costs.
- Paid or cloud resources must support a clear learning or engineering goal.
- Temporary resources must have an expected cost and removal plan before they are created.
- Credentials are provided at runtime and never committed to source control.
- Access should use the minimum permissions and shortest practical lifetime.
- An exposed credential is treated as compromised and rotated immediately.

## Before using a paid or cloud resource

Record:

- What resource will be created.
- What problem or learning goal it supports.
- Why a local or free option is not enough.
- The expected maximum cost.
- How long the resource should exist.
- How it will be removed.
- How successful cleanup will be confirmed.

Do not describe a service as guaranteed free simply because it offers a free tier. Usage limits, storage, network traffic, and forgotten resources can still create charges.

## Cleanup

A cloud exercise is not complete until:

- Application and infrastructure resources are removed.
- Retained storage, snapshots, images, addresses, and other billable items are checked.
- The provider shows no unexpected resources still running.
- Actual costs are reviewed when billing information becomes available.
- Cleanup problems and lessons are recorded.

Prefer automated and repeatable cleanup. If manual cleanup is required, investigate why the normal process failed.

## Credential handling

Credentials include passwords, tokens, API keys, private keys, database passwords, connection strings, certificates with private material, session data, and recovery codes.

For local development:

- Store secrets in an ignored local file, operating-system credential store, or password manager.
- Commit `.env.example` only when it contains safe variable names and obviously fake values.
- Confirm `.env` and other local secret files are ignored before adding credentials.

For automation or cloud exercises:

- Use the platform's protected secret storage.
- Prefer short-lived credentials and identity-based access.
- Use separate credentials for different applications and environments.
- Remove credentials that are no longer needed.

Never place credentials in source code, documentation, issues, pull requests, screenshots, logs, test fixtures, container images, build output, or AI prompts.

## If a credential is exposed

1. Revoke or rotate it immediately.
2. Review available logs for unexpected use.
3. Remove it from active files and history when appropriate.
4. Correct the process that allowed the exposure.
5. Record the lesson without reproducing the value.

Removing the value from Git does not make it safe to reuse.

See [SECURITY.md](../../SECURITY.md) for vulnerability reporting and [Public Repository Safety](../security/PUBLIC_REPOSITORY_SAFETY.md) for publication checks.
