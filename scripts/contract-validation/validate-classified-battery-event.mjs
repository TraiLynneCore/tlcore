import createEventValidator from "./helpers/event-validator.mjs";
import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  {
    name: "classified-battery-event.critical.percentage-0.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.low.percentage-11.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.normal.percentage-21.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.normal.percentage-100.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.low.percentage-21.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-timezone-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-timezone-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.null-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.unsupported-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.wrong-stage-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "classified-battery-event.extra-outer-field.invalid.json",
    expectedValid: false,
  },
];

export default function validateClassifiedBatteryEvent() {
  console.log("[TLCore] Starting classified battery event validation...");

  const ajv = createContractAjv();

  const classifiedBatteryEventSchema = loadJson(
    "./docs/contracts/events/classified-battery-event.schema.json",
  );

  checkFixtureRegistration(
    "./docs/contracts/examples/events",
    "classified-battery-event",
    fixtureRegistration,
  );

  const schemaValidator = ajv.compile(classifiedBatteryEventSchema);
  const validate = createEventValidator(schemaValidator);

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/events/classified-battery-event/${name}`,
    );

    checkFixture(name, validate, data, expectedValid);
  }
}
