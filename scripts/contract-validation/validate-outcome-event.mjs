import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { checkFixture, createEventValidator, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

// Load the event schema from the JSON file
const outcomeEventSchema = loadJson(
  "./docs/contracts/events/outcome-battery-event.schema.json",
);

// Define the event fixtures with their expected validity
const outcomeEventFixtures = [
  {
    name: "outcome-battery-event-critical-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-critical-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-low-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-low-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-normal-minimum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-normal-maximum.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-critical-failed.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-low-failed.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-normal-failed.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event-low-at-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-critical-at-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-normal-at-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-low-at-21.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-normal-wrong-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-low-wrong-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-critical-wrong-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-completed-missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-failed-missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-completed-with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-failed-with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-device-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-missing-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-matching-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-device-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-classified-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-percentage-below-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-percentage-above-range.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-invalid-created-at.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event-additional-property.invalid.json",
    expectedValid: false,
  },
];

// Compile the event schema using AJV
const validateOutcomeEventSchema = ajv.compile(outcomeEventSchema);

const validate = createEventValidator(validateOutcomeEventSchema);

// Function to validate event contracts
export function validateOutcomeEvents() {
  console.log(
    "[TLCore][contracts] Validating outcome battery event fixtures...",
  );
  for (const fixture of outcomeEventFixtures) {
    const data = loadJson(
      `./docs/contracts/examples/events/outcome/${fixture.name}`,
    );

    checkFixture(fixture.name, validate, data, fixture.expectedValid);
  }
}
