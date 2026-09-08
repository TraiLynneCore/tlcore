import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, createEventValidator, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the event schema from the JSON file
const classifiedEventSchema = loadJson(
  "./docs/contracts/events/classified-battery-event.schema.json",
);

// Define the event fixtures with their expected validity
const classifiedEventFixtures = [
  {
    name: "classified-battery-event-critical-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-critical-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-low-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-low-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-normal-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-normal-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event-low-at-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-critical-at-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-normal-at-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-low-at-21.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-device-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-missing-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-matching-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-device-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-percentage-below-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-percentage-above-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-invalid-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-additional-property.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event-accepted-event-type.invalid.json",
    expectedValid: false,
  },
];

// Compile the event schema using AJV
const validateClassifiedEventSchema = ajv.compile(classifiedEventSchema);

const validate = createEventValidator(validateClassifiedEventSchema);

// Function to validate event contracts
export function validateClassifiedEvents() {
  console.log(
    "[TLCore][contracts] Validating classified battery event fixtures...",
  );
  for (const fixture of classifiedEventFixtures) {
    const data = loadJson(
      `./docs/contracts/examples/events/classified/${fixture.name}`,
    );

    checkFixture(fixture.name, validate, data, fixture.expectedValid);
  }
}
