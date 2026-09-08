import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the submission schema from the JSON file
const submissionSchema = loadJson(
  "./docs/contracts/http/battery-submission.schema.json",
);

// Define the submission fixtures with their expected validity
const submissionFixtures = [
  {
    name: "battery-submission.valid.json",
    expectedValid: true,
  },
  {
    name: "battery-submission-missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission-fractional.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission-missing-device.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission-out-of-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-submission-additional-property.invalid.json",
    expectedValid: false,
  },
];

// Compile the submission schema using AJV
const validateSubmission = ajv.compile(submissionSchema);

// Function to validate submission contracts
export function validateSubmissionContracts() {
  console.log("[TLCore][contracts] Validating submission fixtures...");

  for (const fixture of submissionFixtures) {
    const data = loadJson(`./docs/contracts/examples/http/${fixture.name}`);

    checkFixture(fixture.name, validateSubmission, data, fixture.expectedValid);
  }
}
