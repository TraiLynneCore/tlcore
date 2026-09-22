import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "node:fs";
import createContractAjv from "../../scripts/helpers/create-contract-ajv.mjs";
import createEventValidator from "../../scripts/helpers/event-validator.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const fixtureRegistration = [
  // Valid completed outcomes and classification boundaries
  {
    name: "outcome-battery-event.completed.critical.percentage-0.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-11.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-21.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-100.valid.json",
    expectedValid: true,
  },

  // Valid failed outcomes
  {
    name: "outcome-battery-event.failed.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.failed.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.failed.normal.percentage-21.valid.json",
    expectedValid: true,
  },

  // Event ID
  {
    name: "outcome-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },

  // Original event ID
  {
    name: "outcome-battery-event.missing-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-original-event-id.invalid.json",
    expectedValid: false,
  },

  // Lifecycle ID
  {
    name: "outcome-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // Identifier relationships
  {
    name: "outcome-battery-event.matching-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.matching-event-and-original-event-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.matching-original-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },

  // Event type
  {
    name: "outcome-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.wrong-stage-event-type.invalid.json",
    expectedValid: false,
  },

  // Source
  {
    name: "outcome-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },

  // Occurrence time
  {
    name: "outcome-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.occurrence-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Creation time
  {
    name: "outcome-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.created-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Payload structure
  {
    name: "outcome-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.null-data.invalid.json",
    expectedValid: false,
  },

  // Battery percentage
  {
    name: "outcome-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },

  // Classification
  {
    name: "outcome-battery-event.missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-classification.invalid.json",
    expectedValid: false,
  },

  // Incorrect percentage/classification pairs — completed
  {
    name: "outcome-battery-event.completed.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-21.invalid.json",
    expectedValid: false,
  },

  // Incorrect percentage/classification pairs — failed
  {
    name: "outcome-battery-event.failed.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.percentage-21.invalid.json",
    expectedValid: false,
  },

  // Worker state
  {
    name: "outcome-battery-event.missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-state.invalid.json",
    expectedValid: false,
  },

  // Completed outcomes — unsupported or incorrect result
  {
    name: "outcome-battery-event.completed.unsupported-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.critical.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },

  // Completed outcomes — missing required result
  {
    name: "outcome-battery-event.completed.critical.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },

  // Completed outcomes — forbidden failure reason
  {
    name: "outcome-battery-event.completed.critical.with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.with-failure-reason.invalid.json",
    expectedValid: false,
  },

  // Failed outcomes — unsupported failure reason
  {
    name: "outcome-battery-event.unsupported-failure-reason.invalid.json",
    expectedValid: false,
  },

  // Failed outcomes — missing required failure reason
  {
    name: "outcome-battery-event.failed.critical.missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.missing-failure-reason.invalid.json",
    expectedValid: false,
  },

  // Failed outcomes — forbidden worker outcome
  {
    name: "outcome-battery-event.failed.critical.with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.with-worker-outcome.invalid.json",
    expectedValid: false,
  },

  // Extra payload fields
  {
    name: "outcome-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },

  // Extra outer fields
  {
    name: "outcome-battery-event.extra-field.invalid.json",
    expectedValid: false,
  },
];

const fixtureDirectory =
  "./docs/contracts/examples/events/outcome-battery-event";

const ajv = createContractAjv();
const schema = loadJson(
  "./docs/contracts/events/outcome-battery-event.schema.json",
);

const schemaValidator = ajv.compile(schema);
const validate = createEventValidator(schemaValidator);

describe("Outcome battery events", () => {
  test("every saved fixture is registered exactly once", () => {
    const savedNames = readdirSync(fixtureDirectory)
      .filter(
        (name) =>
          name.startsWith("outcome-battery-event.") && name.endsWith(".json"),
      )
      .sort();

    const registeredNames = fixtureRegistration.map(({ name }) => name).sort();

    expect(savedNames.length).toBeGreaterThan(0);
    expect(registeredNames.length).toBeGreaterThan(0);
    expect(new Set(registeredNames).size).toBe(registeredNames.length);
    expect(registeredNames).toEqual(savedNames);
  });

  test.each(fixtureRegistration)("$name", ({ name, expectedValid }) => {
    const data = loadJson(`${fixtureDirectory}/${name}`);

    expect(validate(data)).toBe(expectedValid);
  });
  const identityFixtures = [
    "matching-event-and-lifecycle-ids",
    "matching-event-and-original-event-ids",
    "matching-original-event-and-lifecycle-ids",
  ];

  test.each(identityFixtures)(
    "%s passes the schema but fails the identity check",
    (caseName) => {
      const data = loadJson(
        `${fixtureDirectory}/outcome-battery-event.${caseName}.invalid.json`,
      );

      expect(schemaValidator(data)).toBe(true);
      expect(validate(data)).toBe(false);
      expect(validate.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            keyword: "distinctIdentifiers",
          }),
        ]),
      );
    },
  );
});
