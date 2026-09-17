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
