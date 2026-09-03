import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the status schema from the JSON file
const statusSchema = loadJson(
  "./docs/contracts/http/battery-status.schema.json",
);

// Define the status fixtures with their expected validity
const statusFixtures = [
  {
    name: "battery-status-pending.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-completed.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-completed-low.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-completed-critical.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-completed-mismatched-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-completed-missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-completed-missing-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-completed-missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-completed-missing-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-completed-additional-property.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-processing.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-failed-follow-up.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-failed-result-rejected.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-status-failed-missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-missing-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-missing-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-invalid-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-invalid-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-status-failed-additional-property.invalid.json",
    expectedValid: false,
  },
];

// Compile the status schema using AJV
const validateStatus = ajv.compile(statusSchema);

// Function to validate status contracts
export function validateStatusContracts() {
  console.log("[TLCore] Validating status fixtures...");

  for (const fixture of statusFixtures) {
    const data = loadJson(`./docs/contracts/examples/http/${fixture.name}`);

    checkFixture(fixture.name, validateStatus, data, fixture.expectedValid);
  }
}
