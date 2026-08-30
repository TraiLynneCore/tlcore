# TLCore Project Charter

- **Status:** Approved
- **Project owner:** Trai Lynne Compton
- **Approved:** 2026-08-29

## Purpose

TLCore is a long-lived engineering laboratory for developing practical skills in DevOps, platform engineering, site reliability engineering, cloud infrastructure, and security.

The project centers on a small but realistic polyglot distributed application. The application provides a consistent system through which deployment, automation, observability, reliability, security, troubleshooting, and infrastructure practices can be learned and demonstrated.

TLCore is designed to evolve incrementally. Each new capability must strengthen the same architectural and operational foundation rather than becoming a disconnected experiment.

## Audience and stakeholders

The primary user and operator of TLCore is Trai Lynne Compton, who uses the system to develop, practice, and demonstrate skills across software delivery, infrastructure, reliability, cloud engineering, and security.

Secondary audiences include:

- Prospective employers and technical interviewers evaluating the project
- Engineers learning from its architecture, documentation, and operational exercises
- Future contributors who may propose improvements or participate in experiments

TLCore is not initially intended to provide a production service to external customers. Personal-device integrations may be added in later phases, but they must not weaken the project’s security, privacy, or operational foundations.

## Project goals

TLCore exists to:

1. Build and evolve a small, realistic distributed application that creates meaningful deployment, security, reliability, and operational challenges.
2. Develop practical experience across the full software-delivery lifecycle, including development, testing, containerization, continuous integration, orchestration, infrastructure as code, delivery, observability, security, and incident response.
3. Maintain a permanent local environment that can operate at essentially no cost while supporting temporary, automated cloud environments for focused exercises.
4. Make infrastructure, configuration, deployment processes, operational procedures, and architectural decisions reproducible and reviewable through version control.
5. Produce credible public evidence of engineering judgment, troubleshooting ability, documentation skill, and responsible system operation.
6. Establish a reusable foundation for future services, personal-device integrations, cloud experiments, and platform-engineering capabilities without allowing those additions to become disconnected projects.

## Guiding principles

1. **The system is the laboratory.** Tools must solve a real deployment, reliability, security, or operational problem.
2. **Local-first and cloud-compatible.** The permanent environment must operate locally at essentially no cost. Cloud environments will be temporary, automated, and destroyed when exercises finish.
3. **Everything reproducible.** Infrastructure, environments, deployments, configuration, dashboards, policies, and operational procedures should be version-controlled.
4. **Security from the beginning.** Secrets, identity, permissions, dependency risk, and supply-chain controls are designed into each phase.
5. **Observability supports operations.** Logs, metrics, traces, dashboards, and alerts must answer useful questions about system behavior.
6. **Failure is part of the curriculum.** Each major capability should eventually be tested through controlled failures, investigation, recovery, and documentation.
7. **Complexity must be earned.** A new tool or abstraction should be introduced only when TLCore has a problem that it helps solve.
8. **Every phase leaves the system working.** The project should never require completing the entire roadmap before it becomes useful.

## Non-goals

TLCore is not intended to:

1. Become a large consumer application or commercial product during its initial roadmap.
2. Introduce tools solely for résumé value or technology coverage. Each tool must solve a real problem within the system.
3. Maintain a permanently running cloud environment. Cloud resources should be temporary, automated, cost-controlled, and removed after their intended exercises.
4. Simulate production scale without evidence that scale is necessary for a specific learning or operational objective.
5. Add languages, services, infrastructure layers, or abstractions before the system has a clear need for them.
6. Store production secrets, sensitive personal information, or irreplaceable personal data.
7. Complete every possible feature within a discipline before progressing. Each phase is complete when its stated capability works and has evidence.

## Governance and decision ownership

Trai Lynne Compton is the project founder and currently serves as:

- **Product owner:** Defines the project vision, priorities, phase boundaries, and acceptance criteria.
- **Technical owner:** Approves architecture, engineering standards, and major technology decisions.
- **Security owner:** Reviews security risks, credential practices, and risk-acceptance decisions.
- **Repository owner:** Manages organization access, repository settings, branch protections, and releases.

These responsibilities remain conceptually separate even while held by one person. Important architectural and security decisions must be documented so they can be reviewed by future contributors.

TLCore may add maintainers or contributors later. Repository ownership and decision authority will be reviewed before granting elevated access or introducing shared operational responsibilities.

## Project success criteria

TLCore is successful when:

1. Each completed phase leaves behind a working, documented, and verifiable operational capability.
2. Infrastructure, application behavior, deployment processes, security controls, and recovery procedures can be reproduced from version-controlled instructions and automation.
3. Engineering tools are introduced in response to demonstrated system needs, with the reasoning and tradeoffs documented.
4. The system can be deliberately failed, investigated through appropriate evidence, recovered through documented procedures, and improved based on what was learned.
5. Local development remains practical and essentially free, while temporary cloud exercises stay automated, budgeted, and removable.
6. A new contributor or technical reviewer can understand the system’s purpose, architecture, current maturity, major decisions, and development workflow without relying on undocumented knowledge.
7. The public project demonstrates not only technical breadth, but also sound judgment in architecture, security, cost management, documentation, and operations.

## First application milestone: simulated device battery status

### User story

As the TLCore operator, I can submit a simulated device battery-status event and later retrieve the device’s processed state so that I can verify the complete event lifecycle across the distributed system.

### Event lifecycle

1. A client submits a battery-status event to the JavaScript gateway.
2. The gateway validates the request format and publishes the event to the message broker.
3. The Python processor consumes the event and classifies the battery level as `normal`, `low`, or `critical`.
4. The processed event triggers the Ruby worker to create and complete a simulated follow-up job when attention is required.
5. PostgreSQL stores the event, its processing state, and any follow-up-job result.
6. A client requests the device’s latest state through the JavaScript gateway.

### Initial event data

The first event contains only:

- A generated event identifier
- A non-personal demonstration device identifier
- The event type
- The battery percentage
- The time the event was recorded

### Completion criteria

The milestone is complete when:

- One documented request submits a valid simulated battery event.
- The event crosses the JavaScript, Python, and Ruby service boundaries asynchronously.
- PostgreSQL contains the resulting state.
- One documented request retrieves the latest device state.
- Duplicate event delivery does not create duplicate processing results.
- Invalid events fail safely and return useful errors.
- Each service can be started, stopped, configured, and tested independently.
- The complete event lifecycle is covered by appropriate unit, integration, and contract tests.
- The workflow runs locally without paid services or real device data.

### Explicit non-goals

This milestone does not include:

- Real phones, watches, sensors, or smart-home devices
- User accounts or multi-user authorization
- A mobile application
- Email, SMS, or push-notification delivery
- Production cloud deployment
- A sophisticated dashboard
- Multiple event types
- Machine learning or predictive battery analysis
- Long-term personal-device history
