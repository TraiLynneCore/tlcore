import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the acceptance schema from the JSON file
const acceptanceSchema = loadJson(
  "./docs/contracts/http/battery-acceptance.schema.json",
);

// Define the acceptance fixtures with their expected validity
const acceptanceFixtures = [
  {
    name: "battery-acceptance.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-acceptance-missing-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance-invalid-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance-invalid-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance-additional-property.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance-missing-state.invalid.json",
    expectedValid: false,
  },
];

// Compile the acceptance schema using AJV
const validateAcceptance = ajv.compile(acceptanceSchema);

// Function to validate acceptance contracts
export function validateAcceptanceContracts() {
  console.log("[TLCore] Validating acceptance fixtures...");

  for (const fixture of acceptanceFixtures) {
    const data = loadJson(`./docs/contracts/examples/http/${fixture.name}`);

    checkFixture(fixture.name, validateAcceptance, data, fixture.expectedValid);
  }
}
