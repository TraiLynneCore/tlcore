import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "fs";
import createContractAjv from "../../scripts/helpers/create-contract-ajv.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const fixtureRegistration = [
  {
    name: "battery-status.pending.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.completed.critical.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.completed.low.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.completed.normal.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.failed.follow-up-failed.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.failed.result-rejected.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.malformed-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.unsupported-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.extra-source-field.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status.occurrence-time-without-timezone.invalid.json",
    expectedValid: false,
  },
];

const ajv = createContractAjv();
const batteryStatusSchema = loadJson(
  "./docs/contracts/http/battery-status.schema.json",
);
const validate = ajv.compile(batteryStatusSchema);

describe("Battery status", () => {
  test("every saved fixture is registered exactly once", () => {
    const directory = "./docs/contracts/examples/http/battery-status";

    const savedNames = readdirSync(directory)
      .filter(
        (name) => name.startsWith("battery-status.") && name.endsWith(".json"),
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
      `./docs/contracts/examples/http/battery-status/${name}`,
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
});
