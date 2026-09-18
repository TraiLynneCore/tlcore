import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "node:fs";
import createEventValidator from "../../scripts/contract-validation/helpers/event-validator.mjs";
import {
  createContractAjv,
  loadJson,
} from "../../scripts/contract-validation/helpers/helpers.mjs";

const fixtureRegistration = [
  // Valid events and percentage boundaries
  {
    name: "accepted-battery-event.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event.percentage-at-0.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event.percentage-at-100.valid.json",
    expectedValid: true,
  },

  // Event ID
  {
    name: "accepted-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },

  // Lifecycle ID
  {
    name: "accepted-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // Identifier relationships
  {
    name: "accepted-battery-event.matching-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },

  // Event type
  {
    name: "accepted-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.unsupported-event-type.invalid.json",
    expectedValid: false,
  },

  // Source
  {
    name: "accepted-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },

  // Occurrence time
  {
    name: "accepted-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.occurrence-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Creation time
  {
    name: "accepted-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.created-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Payload structure
  {
    name: "accepted-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.null-data.invalid.json",
    expectedValid: false,
  },

  // Battery percentage
  {
    name: "accepted-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },

  // Extra payload fields
  {
    name: "accepted-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },

  // Extra outer fields
  {
    name: "accepted-battery-event.extra-field.invalid.json",
    expectedValid: false,
  },
];

const fixtureDirectory =
  "./docs/contracts/examples/events/accepted-battery-event";

const ajv = createContractAjv();
const schema = loadJson(
  "./docs/contracts/events/accepted-battery-event.schema.json",
);

const schemaValidator = ajv.compile(schema);
const validate = createEventValidator(schemaValidator);

describe("Accepted battery events", () => {
  test("every saved fixture is registered exactly once", () => {
    const savedNames = readdirSync(fixtureDirectory)
      .filter(
        (name) =>
          name.startsWith("accepted-battery-event.") && name.endsWith(".json"),
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
      `${fixtureDirectory}/accepted-battery-event.matching-event-and-lifecycle-ids.invalid.json`,
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
