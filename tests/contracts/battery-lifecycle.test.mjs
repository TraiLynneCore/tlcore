import { beforeAll, describe, expect, test } from "@jest/globals";
import { readdirSync } from "fs";
import createLifecycleValidator from "../../scripts/helpers/lifecycle-validator.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const lifecycleValidator = createLifecycleValidator();
const lifecycleChecks = [
  [
    "structureValid",
    "recognizes the expected lifecycle structure",
    "detects an invalid lifecycle structure",
  ],
  [
    "submissionValid",
    "accepts a valid submission",
    "rejects an invalid submission",
  ],
  [
    "acceptanceValid",
    "accepts a valid acceptance response",
    "rejects an invalid acceptance response",
  ],
  [
    "acceptedEventValid",
    "accepts a valid accepted event",
    "rejects an invalid accepted event",
  ],
  [
    "classifiedEventValid",
    "accepts a valid classified event",
    "rejects an invalid classified event",
  ],
  [
    "outcomeEventValid",
    "accepts a valid outcome event",
    "rejects an invalid outcome event",
  ],
  [
    "statusValid",
    "accepts a valid status response",
    "rejects an invalid status response",
  ],
  [
    "lifecycleIdConsistent",
    "finds matching lifecycle IDs",
    "detects mismatched lifecycle IDs",
  ],
  [
    "originalEventIdConsistent",
    "finds matching original-event IDs and references",
    "detects mismatched original-event IDs or references",
  ],
  [
    "eventIdsDistinct",
    "finds distinct event and lifecycle IDs",
    "detects repeated event or lifecycle IDs",
  ],
  [
    "sourceConsistent",
    "finds matching source IDs and types",
    "detects mismatched source IDs or types",
  ],
  [
    "occurredAtConsistent",
    "finds matching occurrence times",
    "detects mismatched occurrence times",
  ],
  [
    "percentageConsistent",
    "finds matching battery percentages",
    "detects mismatched battery percentages",
  ],
  [
    "finalResultConsistent",
    "finds agreement between outcome and final status",
    "detects disagreement between outcome and final status",
  ],
];

const lifecycleRegistration = [
  {
    name: "battery-lifecycle.normal.completed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.low.completed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.critical.completed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.normal.follow-up-failed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.low.follow-up-failed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.critical.follow-up-failed.valid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-lifecycle-id.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: false,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-accepted-event-id.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: false,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-original-event-id.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: false,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.reused-result-event-id.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: false,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-source-id.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: false,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-occurrence-time.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: false,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-percentage.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: false,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.mismatched-completed-result.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: false,
    },
  },
  {
    name: "battery-lifecycle.completed-status-after-failure.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: false,
    },
  },
  {
    name: "battery-lifecycle.pending-status-after-outcome.invalid.json",
    expectedChecks: {
      structureValid: true,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: false,
    },
  },
  {
    name: "battery-lifecycle.missing-outcome-stage.invalid.json",
    expectedChecks: {
      structureValid: false,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: false,
      statusValid: true,
      lifecycleIdConsistent: false,
      originalEventIdConsistent: false,
      eventIdsDistinct: true,
      sourceConsistent: false,
      occurredAtConsistent: false,
      percentageConsistent: false,
      finalResultConsistent: false,
    },
  },
  {
    name: "battery-lifecycle.extra-stage.invalid.json",
    expectedChecks: {
      structureValid: false,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: true,
      statusValid: true,
      lifecycleIdConsistent: true,
      originalEventIdConsistent: true,
      eventIdsDistinct: true,
      sourceConsistent: true,
      occurredAtConsistent: true,
      percentageConsistent: true,
      finalResultConsistent: true,
    },
  },
  {
    name: "battery-lifecycle.null-outcome-stage.invalid.json",
    expectedChecks: {
      structureValid: false,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: false,
      statusValid: true,
      lifecycleIdConsistent: false,
      originalEventIdConsistent: false,
      eventIdsDistinct: true,
      sourceConsistent: false,
      occurredAtConsistent: false,
      percentageConsistent: false,
      finalResultConsistent: false,
    },
  },
  {
    name: "battery-lifecycle.array-outcome-stage.invalid.json",
    expectedChecks: {
      structureValid: false,
      submissionValid: true,
      acceptanceValid: true,
      acceptedEventValid: true,
      classifiedEventValid: true,
      outcomeEventValid: false,
      statusValid: true,
      lifecycleIdConsistent: false,
      originalEventIdConsistent: false,
      eventIdsDistinct: true,
      sourceConsistent: false,
      occurredAtConsistent: false,
      percentageConsistent: false,
      finalResultConsistent: false,
    },
  },
];

const lifeCycleDirectory = "./docs/contracts/examples/lifecycle";

describe("Battery Lifecycle Validation", () => {
  test("every saved fixture is registered exactly once", () => {
    const savedNames = readdirSync(lifeCycleDirectory)
      .filter(
        (name) =>
          name.startsWith("battery-lifecycle.") && name.endsWith(".json"),
      )
      .sort();

    const registeredNames = lifecycleRegistration
      .map(({ name }) => name)
      .sort();

    expect(savedNames.length).toBeGreaterThan(0);
    expect(registeredNames.length).toBeGreaterThan(0);
    expect(new Set(registeredNames).size).toBe(registeredNames.length);
    expect(registeredNames).toEqual(savedNames);
  });

  describe.each(lifecycleRegistration)(
    "validates lifecycle fixture: $name",
    ({ name, expectedChecks }) => {
      let result;

      const checkCases = lifecycleChecks.map(([key, whenTrue, whenFalse]) => ({
        key,
        description: expectedChecks[key] ? whenTrue : whenFalse,
        expected: expectedChecks[key],
      }));

      beforeAll(() => {
        const lifecycle = loadJson(`${lifeCycleDirectory}/${name}`);
        result = lifecycleValidator(lifecycle);
      });

      test("returns and expects every documented check", () => {
        const checkNames = lifecycleChecks.map(([key]) => key).sort();

        expect(Object.keys(result).sort()).toEqual(checkNames);
        expect(Object.keys(expectedChecks).sort()).toEqual(checkNames);
      });

      test.each(checkCases)("$key — $description", ({ key, expected }) => {
        expect(typeof result[key]).toBe("boolean");
        expect(typeof expected).toBe("boolean");
        expect(result[key]).toBe(expected);
      });
    },
  );
});
