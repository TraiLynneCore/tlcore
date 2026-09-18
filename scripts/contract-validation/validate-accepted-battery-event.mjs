import createEventValidator from "./helpers/event-validator.mjs";
import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  // Valid events and percentage boundaries
  {
    name: "accepted-battery-event.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event.percentage-at-0.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event.percentage-at-100.valid.json",
    expectedValid: true,
  },

  // Event ID
  {
    name: "accepted-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },

  // Lifecycle ID
  {
    name: "accepted-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // Identifier relationships
  {
    name: "accepted-battery-event.matching-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },

  // Event type
  {
    name: "accepted-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.unsupported-event-type.invalid.json",
    expectedValid: false,
  },

  // Source
  {
    name: "accepted-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },

  // Occurrence time
  {
    name: "accepted-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.occurrence-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Creation time
  {
    name: "accepted-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.created-time-without-timezone.invalid.json",
    expectedValid: false,
  },

  // Payload structure
  {
    name: "accepted-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.null-data.invalid.json",
    expectedValid: false,
  },

  // Battery percentage
  {
    name: "accepted-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },

  // Extra payload fields
  {
    name: "accepted-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },

  // Extra outer fields
  {
    name: "accepted-battery-event.extra-field.invalid.json",
    expectedValid: false,
  },
];

export default function validateAcceptedBatteryEvent() {
  console.log("[TLCore] Starting accepted battery event validation...");

  const ajv = createContractAjv();

  const acceptedBatteryEventSchema = loadJson(
    "./docs/contracts/events/accepted-battery-event.schema.json",
  );

  checkFixtureRegistration(
    "./docs/contracts/examples/events",
    "accepted-battery-event",
    fixtureRegistration,
  );

  const schemaValidator = ajv.compile(acceptedBatteryEventSchema);
  const validate = createEventValidator(schemaValidator);

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/events/accepted-battery-event/${name}`,
    );

    checkFixture(name, validate, data, expectedValid);
  }
}
