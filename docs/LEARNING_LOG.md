# TLCore Learning Log

This log records meaningful lessons from building and operating TLCore. It focuses on technical understanding, engineering judgment, problems encountered, and decisions that may affect future work.

An entry is useful after a meaningful issue, experiment, failure, or project decision. Small maintenance changes do not need an entry.

## 2026-09-01 — Simplifying the project foundation

### What changed

I reviewed the project documentation and simplified the active files before beginning Phase 1 implementation.

### What I learned

A workflow can be thorough and still be the wrong size for the project. TLCore had detailed governance and planning documents before it had working application code. The amount of process made it harder for me to understand the project and move forward confidently.

Documentation is most useful when I understand why it exists, can explain what it says, and know when it needs to change. A personal learning lab still benefits from structure, security rules, architecture decisions, and a roadmap, but those documents should support the work rather than become most of the work.

### What I will do differently

- Plan the phase broadly and the next issue in detail.
- Build one working capability at a time.
- Add documentation when it helps explain, operate, secure, or reproduce something meaningful.
- Keep important rules and decisions, but write them in language I can maintain.
- Let implementation evidence shape later plans instead of answering every future question early.

### Why this matters for Phase 1

Phase 1 should produce working software and practical learning evidence. The project will still use issues, branches, tests, pull requests, architecture decisions, and security guardrails, but each part of the workflow should have a clear purpose.

## 2026-09-04 — Defining the Phase 1 service contracts

### What changed

I defined the shared Phase 1 battery-event contracts before building the gateway, processor, or worker. The work included HTTP submission, acceptance, and status schemas; accepted, classified, and outcome event schemas; valid, invalid, boundary, and complete-lifecycle fixtures; contract validators; and the documentation that explains the workflow.

The final lifecycle validator verifies both individual records and the relationships between them. It checks that the lifecycle ID, device ID, and battery percentage remain consistent; event IDs are unique; the classification reaches the worker outcome unchanged; and the final client-visible state agrees with that outcome.

### What I learned

An individual schema answers, “Is this one object shaped correctly?” A lifecycle validator answers, “Do these separately valid objects tell one consistent story?” Both are necessary in an event-driven system because a message can be valid on its own while referring to the wrong device, lifecycle, or final result.

I learned to build contract work in small, reviewable steps: define one schema, create its valid and invalid fixtures, add the validator, run the test suite, and then move to the next contract. Asking for focused reviews along the way helped me catch copy-and-paste mistakes in fixture names and test wiring before they became harder to find.

Invalid fixtures are strongest when they change one rule while keeping every other rule valid. That makes a failing result meaningful: it shows exactly what the validator caught. I also learned to test the test runner itself by intentionally changing an expected result, confirming it failed, and restoring the correct expectation.

### Decisions I will remember

- A `lifecycle_id` identifies one workflow and remains unchanged throughout it. An `event_id` identifies one published event and must be unique within that workflow.
- Battery classifications are complete and non-overlapping: `0`–`10` is `critical`, `11`–`20` is `low`, and `21`–`100` is `normal`.
- The worker handles every classification. `normal` produces `no_action_required`; `low` produces `routine_follow_up_completed`; and `critical` produces `urgent_follow_up_completed`. Any classification may instead produce the failed outcome `follow_up_failed`.
- Contract documentation must change with the executable contracts. It should explain the behavior and ownership without pretending that the services have already been implemented.

### What I will do differently next time

- Start with a short fixture checklist before creating files.
- Use a dedicated expected-results map for multi-rule tests, so each invalid fixture proves the intended rule failed and the others still passed.
- Confirm that the main test command actually invokes new validators, rather than relying only on a manually run script.
- Compile fixed schemas once per validator module, not once per fixture.
- Do a knowledge check before committing so I can explain the contract choices in my own words.

### Why this matters for Phase 1

The contracts now give independently developed services one shared definition of the first workflow while preserving asynchronous processing. That reduces assumptions before implementation and gives future gateway, processor, and worker work a tested reference point.
