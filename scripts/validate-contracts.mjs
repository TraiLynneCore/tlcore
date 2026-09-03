import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";

const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

console.log("Validating TLCore contracts...");

function loadJson(filePath) {
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// Load Files

// Schema

const submissionSchema = loadJson(
  "./docs/contracts/http/battery-submission.schema.json",
);

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

const validateSubmission = ajv.compile(submissionSchema);

function checkFixture(name, validate, data, expectedValid) {
  const actualValid = validate(data);

  if (actualValid === expectedValid) {
    console.log(`PASS ${name}`);
    return;
  }

  console.error(
    `FAIL ${name} was ${actualValid ? "accepted" : "rejected"} unexpectedly`,
  );

  if (validate.errors) {
    console.error(validate.errors);
  }

  process.exitCode = 1;
}

for (const fixture of submissionFixtures) {
  const data = loadJson(`./docs/contracts/examples/http/${fixture.name}`);

  checkFixture(fixture.name, validateSubmission, data, fixture.expectedValid);
}
