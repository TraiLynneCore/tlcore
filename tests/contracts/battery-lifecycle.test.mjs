import { beforeAll, describe, expect, test } from "@jest/globals";
import { readdirSync } from "fs";
import createLifecycleValidator from "../../scripts/helpers/lifecycle-validator.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const lifecycleValidator = createLifecycleValidator();
const lifecycleChecks = [
  ["structureValid", "Structure is valid"],
  ["submissionValid", "Submission is valid"],
  ["acceptanceValid", "Acceptance is valid"],
  ["acceptedEventValid", "Accepted event is valid"],
  ["classifiedEventValid", "Classified event is valid"],
  ["outcomeEventValid", "Outcome event is valid"],
  ["statusValid", "Status is valid"],
  ["lifecycleIdConsistent", "Lifecycle ID is consistent"],
  ["originalEventIdConsistent", "Original event ID is consistent"],
  ["eventIdsDistinct", "Event IDs are distinct"],
  ["sourceConsistent", "Source is consistent"],
  ["occurredAtConsistent", "Occurred at is consistent"],
  ["percentageConsistent", "Percentage is consistent"],
  ["finalResultConsistent", "Final result is consistent"],
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
];

const lifeCycleDirectory = "./docs/contracts/examples/lifecycles";

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

      beforeAll(() => {
        const lifecycle = loadJson(`${lifeCycleDirectory}/${name}`);
        result = lifecycleValidator(lifecycle);
      });

      test("returns and expects every documented check", () => {
        const checkNames = lifecycleChecks.map(([key]) => key).sort();

        expect(Object.keys(result).sort()).toEqual(checkNames);
        expect(Object.keys(expectedChecks).sort()).toEqual(checkNames);
      });

      test.each(lifecycleChecks)("%s — %s", (key) => {
        expect(typeof result[key]).toBe("boolean");
        expect(typeof expectedChecks[key]).toBe("boolean");
        expect(result[key]).toBe(expectedChecks[key]);
      });
    },
  );
});
