import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

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

export default function validateSubmission() {
  console.log("[TLCore] Starting submission validation...");

  const ajv = createContractAjv();

  const batterySubmissionSchema = loadJson(
    "./docs/contracts/http/battery-submission.schema.json",
  );

  checkFixtureRegistration(
    "./docs/contracts/examples/http",
    "battery-submission",
    fixtureRegistration,
  );

  const validate = ajv.compile(batterySubmissionSchema);

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/http/battery-submission/${name}`,
    );

    checkFixture(name, validate, data, expectedValid);
  }

  const validateIncoming = ajv.compile({
    $ref: "urn:tlcore:contracts:event-envelope#/$defs/incoming",
  });

  const data = loadJson(
    "./docs/contracts/examples/http/battery-submission/battery-submission.unsupported-event-type.invalid.json",
  );

  checkFixture(
    "shared incoming accepts a general event type",
    validateIncoming,
    data,
    true,
  );
}
