import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "fs";
import createContractAjv from "../../scripts/helpers/create-contract-ajv.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const fixtureRegistration = [
  // Valid submissions and percentage boundaries
  {
    name: "battery-submission.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-submission.percentage-at-0.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-submission.percentage-at-100.valid.json",
    expectedValid: true,
  },

  // Event ID
  {
    name: "battery-submission.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.invalid-event-id.invalid.json",
    expectedValid: false,
  },

  // Lifecycle ID — assigned by the gateway, not the client
  {
    name: "battery-submission.client-supplied-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // Event type
  {
    name: "battery-submission.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.unsupported-event-type.invalid.json",
    expectedValid: false,
  },

  // Source
  {
    name: "battery-submission.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.extra-source-property.invalid.json",
    expectedValid: false,
  },

  // Occurrence time
  {
    name: "battery-submission.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.malformed-date-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-timezone.invalid.json",
    expectedValid: false,
  },

  // Payload structure
  {
    name: "battery-submission.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.null-data.invalid.json",
    expectedValid: false,
  },

  // Battery percentage
  {
    name: "battery-submission.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.percentage-below-zero.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission.percentage-above-100.invalid.json",
    expectedValid: false,
  },

  // Extra payload fields
  {
    name: "battery-submission.extra-data-property.invalid.json",
    expectedValid: false,
  },

  // Extra outer fields
  {
    name: "battery-submission.extra-outer-property.invalid.json",
    expectedValid: false,
  },
];

const ajv = createContractAjv();
const batterySubmissionSchema = loadJson(
  "./docs/contracts/http/battery-submission.schema.json",
);
const validate = ajv.compile(batterySubmissionSchema);

describe("Battery submission", () => {
  test("every saved fixture is registered exactly once", () => {
    const directory = "./docs/contracts/examples/http/battery-submission";

    const savedNames = readdirSync(directory)
      .filter(
        (name) =>
          name.startsWith("battery-submission.") && name.endsWith(".json"),
      )
      .sort();

    const registeredNames = fixtureRegistration.map(({ name }) => name).sort();

    expect(savedNames.length).toBeGreaterThan(0);
    expect(registeredNames.length).toBeGreaterThan(0);

    expect(new Set(registeredNames).size).toBe(registeredNames.length);
    expect(registeredNames).toEqual(savedNames);
  });

  test.each(fixtureRegistration)("$name", ({ name, expectedValid }) => {
    const data = loadJson(
      `./docs/contracts/examples/http/battery-submission/${name}`,
    );

    const actualValid = validate(data);

    if (actualValid !== expectedValid) {
      const details = actualValid
        ? "The validator accepted a fixture that should have been rejected."
        : JSON.stringify(validate.errors, null, 2);

      throw new Error(
        `Fixture: ${name}\n` +
          `Expected: ${expectedValid ? "accepted" : "rejected"}\n` +
          `Received: ${actualValid ? "accepted" : "rejected"}\n` +
          `Details: ${details}`,
      );
    }
  });

  test("a general event type passes the shared envelope but fails battery submission", () => {
    const validateIncoming = ajv.compile({
      $ref: "urn:tlcore:contracts:event-envelope#/$defs/incoming",
    });

    const data = loadJson(
      "./docs/contracts/examples/http/battery-submission/battery-submission.unsupported-event-type.invalid.json",
    );

    expect(validateIncoming(data)).toBe(true);
    expect(validate(data)).toBe(false);
  });
});
