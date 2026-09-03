import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the event schema from the JSON file
const eventSchema = loadJson(
  "./docs/contracts/events/accepted-battery-event.schema.json",
);

// Define the event fixtures with their expected validity
const eventFixtures = [
  {
    name: "accepted-battery-event.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event-missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-missing-device-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-missing-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-additional-property.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-invalid-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-invalid-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-invalid-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-percentage-below-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-percentage-above-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-invalid-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "accepted-battery-event-zero-percentage.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event-full-percentage.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event-matching-ids.invalid.json",
    expectedValid: false,
  },
];

// Compile the event schema using AJV
const validateEventSchema = ajv.compile(eventSchema);

function validateEvent(data) {
  const schemaValid = validateEventSchema(data);

  if (!schemaValid) {
    validateEvent.errors = validateEventSchema.errors;
    return false;
  }

  if (data.event_id === data.lifecycle_id) {
    validateEvent.errors = [
      {
        instancePath: "/event_id",
        keyword: "distinctIdentifiers",
        message: "must differ from lifecycle_id",
      },
    ];
    return false;
  }

  validateEvent.errors = null;
  return true;
}

// Function to validate event contracts
export function validateEventContracts() {
  console.log("[TLCore][contracts] Validating event fixtures...");

  for (const fixture of eventFixtures) {
    const data = loadJson(`./docs/contracts/examples/events/${fixture.name}`);

    checkFixture(fixture.name, validateEvent, data, fixture.expectedValid);
  }
}
