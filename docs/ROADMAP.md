# TLCore Roadmap

TLCore is a long-term personal learning laboratory for software engineering, distributed systems, DevOps, platform engineering, site reliability engineering, cloud infrastructure, and security.

The roadmap organizes that learning into phases that build on one another. Each phase should leave behind a working capability, not simply a collection of installed tools.

This document gives visitors a high-level view of the project's direction. Detailed planning and progress tracking are managed separately, while GitHub issues describe the engineering work currently being completed. Later phases may change as earlier implementation provides new lessons and evidence.

## Current focus

### Phase 1 — Build the minimal Twelve-Factor system

**Status:** Active

Phase 1 will create the first working version of TLCore. A simulated battery-status event will enter through a JavaScript gateway, be processed asynchronously by Python and Ruby applications, and produce state stored in PostgreSQL.

The first version will run directly on a local development machine. It will establish clear application responsibilities, configuration, structured logs, health checks, database migrations, and focused tests before containers or cloud infrastructure are introduced.

Phase 1 is complete when the event can move through the full system, produce a useful result, and be tested and understood locally.

## Phase overview

| Phase | Focus | Status |
| --- | --- | --- |
| 0 | Project foundation and engineering workflow | Complete |
| 1 | Minimal Twelve-Factor system | Active |
| 2 | Local containers | Planned |
| 3 | Continuous integration and software supply chain | Planned |
| 4 | Local Kubernetes | Planned |
| 5 | Infrastructure as code | Planned |
| 6 | Continuous delivery and GitOps | Planned |
| 7 | Observability and service reliability | Planned |
| 8 | DevSecOps and platform security | Planned |
| 9 | Resilience, performance, and incident response | Planned |
| 10 | Temporary AWS environments | Planned |
| 11 | Personal devices and edge integrations | Planned |
| 12 | Internal developer platform evolution | Planned |

## Phase summaries

### Phase 0 — Foundation and engineering workflow

Establish the project's purpose, planned architecture, repository workflow, security basics, and initial roadmap.

### Phase 1 — Minimal Twelve-Factor system

Build the first local event-processing workflow and establish the application boundaries and development practices that later phases will improve.

### Phase 2 — Local containers

Package the applications and supporting services so the complete system can run in a repeatable local container environment.

### Phase 3 — Continuous integration and software supply chain

Automatically test, inspect, build, and trace changes so every delivered artifact can be connected to its source and validation results.

### Phase 4 — Local Kubernetes

Run TLCore on a reproducible local Kubernetes platform and practice deployment, scaling, health checks, recovery, and rollback.

### Phase 5 — Infrastructure as code

Define infrastructure through version-controlled code that can be reviewed, validated, created, and removed consistently.

### Phase 6 — Continuous delivery and GitOps

Move validated artifacts through an auditable delivery process with automated verification and a clear recovery path.

### Phase 7 — Observability and service reliability

Add the logs, metrics, traces, dashboards, alerts, and reliability targets needed to understand and operate the system.

### Phase 8 — DevSecOps and platform security

Build security checks and safer defaults into development, delivery, deployment, and operation.

### Phase 9 — Resilience, performance, and incident response

Practice controlled failures, recovery, performance testing, incident handling, and improvements based on operational evidence.

### Phase 10 — Temporary AWS environments

Create and remove short-lived AWS environments for focused cloud exercises without requiring a permanently running cloud platform.

### Phase 11 — Personal devices and edge integrations

Connect approved personal devices and services through controlled interfaces without weakening the system's security or privacy boundaries.

### Phase 12 — Internal developer platform evolution

Turn repeated project practices into reusable platform capabilities that make future experiments easier and safer to build.

## Roadmap principles

- Build one working capability at a time.
- Introduce tools when they solve a real problem or support a clear learning goal.
- Keep permanent development local and free of recurring project costs.
- Use simulated data until real integrations have appropriate security and privacy controls.
- Update future plans when implementation provides better evidence.
