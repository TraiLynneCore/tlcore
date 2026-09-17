import createEventValidator from "./helpers/event-validator.mjs";
import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  {
    name: "classified-battery-event.percentage-0-critical.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.percentage-10-critical.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.percentage-11-low.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.percentage-20-low.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.percentage-21-normal.valid.json",
    expectedValid: true,
  },
  {
    name: "classified-battery-event.percentage-100-normal.valid.json",
    expectedValid: true,
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
