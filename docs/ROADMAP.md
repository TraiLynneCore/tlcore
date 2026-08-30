# TLCore Roadmap

## Project vision

TLCore is a long-lived DevOps, platform engineering, SRE, cloud, and security laboratory.

It consists of a small but realistic polyglot distributed application supported by production-style infrastructure and operational practices. The application will remain intentionally focused so that most engineering effort goes toward deploying, securing, observing, troubleshooting, and evolving the system.

TLCore will eventually integrate with personal devices and services, including phones, tablets, watches, smart-home devices, and future experiments. New capabilities must build upon the same architectural and operational foundation instead of becoming disconnected projects.

## Guiding principles

1. **The system is the laboratory.**

   Tools must solve a real deployment, reliability, security, or operational problem.

2. **Local-first and cloud-compatible.**

   The permanent environment must operate locally at essentially no cost. AWS environments will be temporary, automated, and destroyed when exercises finish.

3. **Everything reproducible.**

   Infrastructure, environments, deployments, configuration, dashboards, policies, and operational procedures should be version-controlled.

4. **Security from the beginning.**

   Secrets, identity, permissions, dependency risk, and supply-chain controls are designed into each phase.

5. **Observability supports operations.**

   Logs, metrics, traces, dashboards, and alerts must answer useful questions about system behavior.

6. **Failure is part of the curriculum.**

   Each major capability should eventually be tested through controlled failures, investigation, recovery, and documentation.

7. **Complexity must be earned.**

   A new tool or abstraction should be introduced only when TLCore has a problem that it helps solve.

8. **Every phase leaves the system working.**

   The project should never require completing the entire roadmap before it becomes useful.

---

## Proposed application

TLCore will begin as a small event-driven platform that can receive events, process them asynchronously, store results, and present system state.

### Initial components

- **JavaScript service:** External API, gateway, or lightweight dashboard
- **Python service:** Event ingestion, processing, or automation logic
- **Ruby service:** Background jobs and integration workflows
- **PostgreSQL:** Durable application data
- **Message broker:** Communication between producers and workers
- **Optional cache:** Added only after a genuine caching or coordination need appears

This architecture makes the polyglot approach meaningful. Each language owns a service boundary rather than being included merely to check a box.

Future devices and integrations can submit events or commands through documented APIs without forcing us to redesign the platform.

---

## Phase 0 — Foundation and engineering governance

### Outcome

TLCore has a clear purpose, repository strategy, architecture, contribution process, and security baseline.

### Major areas

- Create the GitHub organization
- Define repository naming and ownership
- Write the project charter and initial architecture decision records
- Establish public-repository safety rules
- Configure issue, pull request, and documentation templates
- Define branching, review, versioning, and release conventions
- Create an initial threat model
- Establish cost and credential-handling rules
- Create a high-level system diagram
- Define a consistent developer workflow

### Exit criteria

- A new contributor can understand what TLCore is and how it will evolve.
- No cloud credentials or sensitive personal information are stored in the repositories.
- Important architectural choices are documented with their reasoning.
- The first application milestone is clearly bounded.

---

## Phase 1 — Build the minimal 12-factor system

### Outcome

A minimal polyglot distributed application runs directly on a development machine and demonstrates real service communication.

### Major areas

- Define service responsibilities and API contracts
- Build the initial JavaScript, Python, and Ruby services
- Add PostgreSQL and a message broker
- Implement asynchronous job processing
- Use environment-based configuration
- Write structured logs to standard output
- Implement graceful startup and shutdown
- Add health and readiness endpoints
- Add database migrations
- Establish unit, integration, and contract testing
- Document the full request and event lifecycle

### Exit criteria

A request can enter TLCore, cross multiple service boundaries, trigger asynchronous processing, persist a result, and return a useful system state.

The system follows applicable 12-factor principles, and each service can be started, stopped, configured, and tested independently.

---

## Phase 2 — Containerize the system

### Outcome

The complete application runs as a reproducible local container environment.

### Major areas

- Create secure, efficient Dockerfiles
- Use multi-stage builds where useful
- Run containers as non-root users
- Add container health checks
- Build a Docker Compose environment
- Configure networks, volumes, and service dependencies
- Handle startup ordering through readiness rather than timing assumptions
- Add persistent development data
- Establish container naming and tagging conventions
- Add local development commands
- Document common container troubleshooting techniques

### Operational exercises

- Stop a worker while events are being produced
- Restart the database
- Corrupt or remove local configuration
- Fill or disconnect a message queue
- Rebuild one service without rebuilding the entire system
- Verify that persistent data survives application restarts

### Exit criteria

A new environment can run TLCore from documented commands without manually installing service-specific dependencies.

---

## Phase 3 — Continuous integration and software supply chain

### Outcome

Every change is automatically tested, inspected, packaged, and traceable.

### Major areas

- Create GitHub Actions workflows
- Run language-specific tests and quality checks
- Run integration and contract tests
- Build all container images
- Scan dependencies, source code, and container images
- Detect accidentally committed secrets
- Generate software bills of materials
- Publish versioned images to a container registry
- Associate images with commits and releases
- Configure dependency update automation
- Protect important branches
- Add status and security information to project documentation
- Introduce artifact signing when the basic pipeline is stable

### Exit criteria

A pull request cannot be merged unless the expected quality and security checks pass. Every released image can be traced to its source commit, workflow run, dependencies, and test results.

---

## Phase 4 — Kubernetes orchestration

### Outcome

TLCore runs on a reproducible local Kubernetes platform.

### Major areas

- Create a local cluster using `kind` or `k3d`
- Deploy application workloads and supporting services
- Configure Services and Ingress
- Add ConfigMaps and Secrets
- Implement startup, readiness, and liveness probes
- Add resource requests and limits
- Manage persistent storage
- Add disruption and scheduling controls
- Test horizontal scaling
- Perform rolling deployments and rollbacks
- Package configuration with Helm or Kustomize
- Separate environment-independent and environment-specific configuration

### Operational exercises

- Delete application pods during active traffic
- Deploy an unhealthy version
- Exhaust a service’s memory or CPU allocation
- Scale workers up and down
- Break service discovery
- Test a failed readiness probe
- Roll back to the last known-good release

### Exit criteria

TLCore recovers from ordinary workload failures, supports repeatable deployments, and can be upgraded or rolled back without manually editing live resources.

---

## Phase 5 — Infrastructure as code

### Outcome

The infrastructure needed to operate TLCore is declared, reviewed, tested, and reproducible.

### Major areas

- Create Terraform modules
- Manage local and AWS-oriented infrastructure definitions
- Define networking, identity, registries, compute, and data dependencies
- Establish environment boundaries
- Manage Terraform state safely
- Add formatting, validation, linting, and security scanning
- Produce reviewed infrastructure plans
- Detect configuration drift
- Define cost-related safeguards
- Document creation and destruction procedures
- Add policy checks before infrastructure changes

### Exit criteria

An authorized operator can create an environment from version-controlled definitions, inspect the proposed change, apply it, verify it, and destroy it without undocumented manual setup.

---

## Phase 6 — Continuous delivery and GitOps

### Outcome

A validated artifact moves through environments using an auditable and recoverable delivery process.

### Major areas

- Separate application delivery from image construction
- Create development and staging-style environments
- Use immutable image references
- Add deployment approvals where appropriate
- Run smoke tests after deployment
- Verify deployment health
- Automate rollback or provide a safe rollback procedure
- Introduce Argo CD or Flux
- Detect and correct deployment drift
- Promote the same artifact between environments
- Record release history and deployment evidence
- Use short-lived identity instead of permanent deployment credentials

### Exit criteria

A source change can move through testing, artifact creation, deployment, verification, and rollback without an operator manually changing cluster resources.

---

## Phase 7 — Observability and service reliability

### Outcome

Operators can understand the system’s behavior, identify failures, and measure reliability.

### Major areas

- Standardize structured logs
- Define application and platform metrics
- Implement distributed tracing with OpenTelemetry
- Correlate requests across services
- Build dashboards around operational questions
- Define service-level indicators
- Establish initial service-level objectives
- Create actionable alerts
- Add synthetic health checks
- Write alert-linked runbooks
- Define log and metric retention appropriate to the lab
- Monitor the monitoring system itself

### Operational exercises

- Investigate a slow request across service boundaries
- Find a failed background job
- Diagnose database connection exhaustion
- Distinguish an application failure from an infrastructure failure
- Evaluate whether an alert is actionable
- Use telemetry to reconstruct an incident timeline

### Exit criteria

An operator can detect, investigate, and explain important failures using system telemetry rather than inspecting every component manually.

---

## Phase 8 — DevSecOps and platform security

### Outcome

Security controls are embedded in development, delivery, deployment, and operations.

### Major areas

- Expand the threat model as the system evolves
- Apply least-privilege access
- Improve secrets management and rotation
- Enforce container security contexts
- Implement Kubernetes network policies
- Add admission or policy-as-code controls
- Scan infrastructure definitions and deployed environments
- Track vulnerabilities and remediation decisions
- Verify artifact provenance and signatures
- Protect administrative interfaces
- Add audit logging
- Practice credential revocation
- Define a vulnerability response workflow
- Review public repositories for information exposure

### Security exercises

- Introduce a vulnerable dependency in a controlled branch
- Attempt to deploy a privileged container
- Test access between services that should be isolated
- Rotate a compromised development credential
- Investigate a simulated suspicious access event
- Document risk acceptance when remediation is intentionally deferred

### Exit criteria

TLCore can explain what is trusted, how access is granted, how artifacts are verified, and how security findings are prevented, detected, prioritized, and resolved.

---

## Phase 9 — Resilience, performance, and incident response

### Outcome

TLCore is operated as a reliability system rather than merely a deployed application.

### Major areas

- Establish load and performance baselines
- Test service and dependency saturation
- Define timeouts, retries, and backoff behavior
- Prevent retry storms
- Add graceful degradation where appropriate
- Test queue backlogs and recovery
- Create backup and restoration procedures
- Define recovery objectives
- Conduct controlled failure experiments
- Create incident roles and response procedures
- Write blameless post-incident reviews
- Track reliability improvements
- Measure operational toil

### Exit criteria

The system has documented failure modes, tested recovery procedures, meaningful reliability targets, and evidence that important data and services can be recovered.

---

## Phase 10 — Ephemeral AWS environments

### Outcome

TLCore demonstrates cloud engineering without requiring a permanently running cloud platform.

### Strategy

The authoritative development platform remains local. AWS environments are created for specific exercises, verified, and destroyed afterward.

### Major areas

- Design an AWS architecture with explicit cost constraints
- Use Terraform to provision temporary environments
- Authenticate GitHub Actions using short-lived identity
- Create budgets and cost alerts before substantial resources
- Automate environment creation and teardown
- Practice AWS networking and identity
- Compare managed and self-managed service tradeoffs
- Test deployment from the existing delivery process
- Confirm that no unexpected resources remain
- Record cost, security, and architectural lessons

### Exit criteria

TLCore can be deployed to AWS through a controlled, repeatable process and removed cleanly. Cloud deployment does not become a financial requirement for ordinary development.

---

## Phase 11 — Personal devices and edge integrations

### Outcome

Personal devices become controlled clients, event sources, and operational experiments without weakening the core platform.

### Possible capabilities

- Receive events from phones, tablets, watches, or home automation
- Deliver notifications and status updates
- Trigger approved workflows
- Authenticate individual devices
- Handle intermittent connectivity
- Synchronize state safely
- Separate trusted and untrusted networks
- Introduce an edge gateway
- Protect personal data
- Revoke a lost or compromised device
- Observe events across cloud, local, and edge boundaries

### Exit criteria

At least one real device interacts with TLCore through a documented, authenticated, observable, and revocable integration.

---

## Phase 12 — Internal developer platform evolution

### Outcome

TLCore becomes a platform that makes additional experiments safer and easier to create.

### Major areas

- Create reusable service templates
- Standardize CI and delivery interfaces
- Create reusable infrastructure modules
- Define platform “golden paths”
- Automate new-service onboarding
- Provide environment self-service
- Establish shared security and observability defaults
- Measure developer experience
- Document supported capabilities and boundaries
- Evaluate whether new abstractions genuinely reduce cognitive load

### Exit criteria

A new service can inherit secure building, testing, deployment, observability, and operational conventions without duplicating the entire platform implementation.

---

## Continuing evolution

TLCore does not have a final completion date. It has maturity levels.

A phase is complete when its stated operational capability works and has evidence—not when every tool in that field has been installed. Completed phases can be revisited as the system gains new services, devices, environments, risks, and reliability requirements.

Future experiments may include:

- Multi-cluster operations
- Alternative deployment strategies
- Service mesh evaluation
- Event-streaming platforms
- Policy engines
- Secret-management platforms
- Chaos engineering
- FinOps
- Disaster recovery
- Multi-account AWS architecture
- Serverless workloads
- Edge computing
- AI-assisted operations
- Additional languages and runtimes

These should be introduced only when they deepen the core laboratory rather than distract from it.
