import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "node:fs";
import createEventValidator from "../../scripts/contract-validation/helpers/event-validator.mjs";
import {
  createContractAjv,
  loadJson,
} from "../../scripts/contract-validation/helpers/helpers.mjs";

const fixtureRegistration = [
  // Valid events and classification boundaries
  {
    name: "classified-battery-event.critical.percentage-0.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.low.percentage-11.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.normal.percentage-21.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.normal.percentage-100.valid.json",
    expectedValid: true,
  },

  // Event ID
  {
    name: "classified-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },

  // Original event ID
  {
    name: "classified-battery-event.missing-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-original-event-id.invalid.json",
    expectedValid: false,
  },

  // Lifecycle ID
  {
    name: "classified-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // Identifier relationships
  {
    name: "classified-battery-event.matching-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.matching-event-and-original-event-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.matching-original-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },

  // Event type
  {
    name: "classified-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.wrong-stage-event-type.invalid.json",
    expectedValid: false,
  },

  // Source
  {
    name: "classified-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },

  // Occurrence time
  {
    name: "classified-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-timezone-occurrence-time.invalid.json",
    expectedValid: false,
  },

  // Creation time
  {
    name: "classified-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-timezone-created-time.invalid.json",
    expectedValid: false,
  },

  // Payload structure
  {
    name: "classified-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.null-data.invalid.json",
    expectedValid: false,
  },

  // Battery percentage
  {
    name: "classified-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },

  // Classification
  {
    name: "classified-battery-event.missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.unsupported-classification.invalid.json",
    expectedValid: false,
  },

  // Incorrect percentage/classification pairs
  {
    name: "classified-battery-event.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.low.percentage-21.invalid.json",
    expectedValid: false,
  },

  // Extra payload fields
  {
    name: "classified-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },

  // Extra outer fields
  {
    name: "classified-battery-event.extra-outer-field.invalid.json",
    expectedValid: false,
  },
];

const fixtureDirectory =
  "./docs/contracts/examples/events/classified-battery-event";

const ajv = createContractAjv();
const schema = loadJson(
  "./docs/contracts/events/classified-battery-event.schema.json",
);

const schemaValidator = ajv.compile(schema);
const validate = createEventValidator(schemaValidator);

describe("Classified battery events", () => {
  test("every saved fixture is registered exactly once", () => {
    const savedNames = readdirSync(fixtureDirectory)
      .filter(
        (name) =>
          name.startsWith("classified-battery-event.") &&
          name.endsWith(".json"),
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
  test("matching IDs pass the schema but fail the identity check", () => {
    const data = loadJson(
      `${fixtureDirectory}/classified-battery-event.matching-event-and-lifecycle-ids.invalid.json`,
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
  });
});
