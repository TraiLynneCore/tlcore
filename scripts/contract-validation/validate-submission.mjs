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
