import { describe, expect, test } from "@jest/globals";
import { readdirSync } from "fs";
import createContractAjv from "../../scripts/helpers/create-contract-ajv.mjs";
import loadJson from "../../scripts/helpers/load-json.mjs";

const fixtureRegistration = [
  // Valid response
  {
    name: "battery-acceptance.valid.json",
    expectedValid: true,
  },

  // Lifecycle ID
  {
    name: "battery-acceptance.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // State
  {
    name: "battery-acceptance.missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance.non-pending-state.invalid.json",
    expectedValid: false,
  },

  // Extra fields
  {
    name: "battery-acceptance.extra-field.invalid.json",
    expectedValid: false,
  },
];

const ajv = createContractAjv();
const batteryAcceptanceSchema = loadJson(
  "./docs/contracts/http/battery-acceptance.schema.json",
);
const validate = ajv.compile(batteryAcceptanceSchema);

describe("Battery acceptance", () => {
  test("every saved fixture is registered exactly once", () => {
    const directory = "./docs/contracts/examples/http/battery-acceptance";

    const savedNames = readdirSync(directory)
      .filter(
        (name) =>
          name.startsWith("battery-acceptance.") && name.endsWith(".json"),
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
      `./docs/contracts/examples/http/battery-acceptance/${name}`,
    );

    expect(validate(data)).toBe(expectedValid);
  });
});
