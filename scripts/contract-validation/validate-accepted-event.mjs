import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, createEventValidator, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the event schema from the JSON file
const eventSchema = loadJson(
  "./docs/contracts/events/accepted-battery-event.schema.json",
);

// Define the event fixtures with their expected validity
const acceptedEventFixtures = [
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

const validate = createEventValidator(validateEventSchema);

// Function to validate event contracts
export function validateAcceptedEvents() {
  console.log(
    "[TLCore][contracts] Validating accepted battery event fixtures...",
  );
  for (const fixture of acceptedEventFixtures) {
    const data = loadJson(`./docs/contracts/examples/events/${fixture.name}`);

    checkFixture(fixture.name, validate, data, fixture.expectedValid);
  }
}
