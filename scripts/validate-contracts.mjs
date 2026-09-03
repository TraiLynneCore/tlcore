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

const acceptanceSchema = loadJson(
  "./docs/contracts/http/battery-acceptance.schema.json",
);

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

const validateSubmission = ajv.compile(submissionSchema);
const validateAcceptance = ajv.compile(acceptanceSchema);

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

for (const fixture of acceptanceFixtures) {
  const data = loadJson(`./docs/contracts/examples/http/${fixture.name}`);

  checkFixture(fixture.name, validateAcceptance, data, fixture.expectedValid);
}
