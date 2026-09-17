import {
  checkFixture,
  checkFixtureRegistration,
  createContractAjv,
  loadJson,
} from "./helpers.mjs";

const ajv = createContractAjv();

const batterySubmissionSchema = loadJson(
  "./docs/contracts/http/battery-submission.schema.json",
);

const fixtureRegistration = [
  {
    name: "battery-submission.valid",
    expectedValid: true,
  },
  { name: "battery-submission.missing-event-id.invalid", expectedValid: false },
  { name: "battery-submission.invalid-event-id.invalid", expectedValid: false },
  {
    name: "battery-submission.missing-event-type.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.unsupported-event.type.invalid",
    expectedValid: false,
  },
  { name: "battery-submission.missing-source.invalid", expectedValid: false },
  { name: "battery-submission.null-source.invalid", expectedValid: false },
  {
    name: "battery-submission.missing-source-id.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.blank-source-id.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-source-type.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.unsupported-source-type.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-occurrence-time.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.malformed-date-time.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-timezone.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-data.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.null-data.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.missing-percentage.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.fractional-percentage.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.numeric-string-percentage.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.percentage-below-zero.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.percentage-above-100.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.percentage-at-0.valid",
    expectedValid: true,
  },
  {
    name: "battery-submission.percentage-at-100.valid",
    expectedValid: true,
  },
  {
    name: "battery-submission.extra-outer-property.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.extra-source-property.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.extra-data-property.invalid",
    expectedValid: false,
  },
  {
    name: "battery-submission.client-supplied-lifecycle-id.invalid",
    expectedValid: false,
  },
];

export default function validateSubmission() {
  checkFixtureRegistration(
    "./docs/contracts/examples/http",
    "battery-submission",
    fixtureRegistration,
  );

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/http/battery-submission/${name}.json`,
    );
    const validate = ajv.compile(batterySubmissionSchema);

    checkFixture(name, validate, data, expectedValid);
  }
}
