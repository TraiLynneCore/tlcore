import createEventValidator from "./helpers/event-validator.mjs";
import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  { name: "accepted-battery-event.valid.json", expectedValid: true },
  {
    name: "accepted-battery-event.percentage-at-0.valid.json",
    expectedValid: true,
  },
  {
    name: "accepted-battery-event.percentage-at-100.valid.json",
    expectedValid: true,
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
