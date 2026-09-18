import createEventValidator from "./helpers/event-validator.mjs";
import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  {
    name: "outcome-battery-event.completed.critical.percentage-0.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-11.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-21.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-100.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.failed.critical.percentage-10.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.failed.low.percentage-20.valid.json",
    expectedValid: true,
  },
  {
    name: "outcome-battery-event.failed.normal.percentage-21.valid.json",
    expectedValid: true,
  },
];

export default function validateOutcomeBatteryEvent() {
  console.log("[TLCore] Starting outcome battery event validation...");

  const ajv = createContractAjv();

  const outcomeBatteryEventSchema = loadJson(
    "./docs/contracts/events/outcome-battery-event.schema.json",
  );

  checkFixtureRegistration(
    "./docs/contracts/examples/events",
    "outcome-battery-event",
    fixtureRegistration,
  );

  const schemaValidator = ajv.compile(outcomeBatteryEventSchema);
  const validate = createEventValidator(schemaValidator);

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/events/outcome-battery-event/${name}`,
    );

    checkFixture(name, validate, data, expectedValid);
  }
}
