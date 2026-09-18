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
  {
    name: "outcome-battery-event.completed.critical.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.wrong-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.unsupported-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.critical.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.critical.with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.critical.missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.critical.with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.missing-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.with-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.missing-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.with-worker-outcome.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-failure-reason.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.percentage-10.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.critical.percentage-11.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.normal.percentage-20.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.completed.low.percentage-21.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.failed.low.percentage-21.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-original-event-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.matching-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.matching-event-and-original-event-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.matching-original-event-and-lifecycle-ids.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.null-source.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.blank-source-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-source-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.extra-source-field.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-occurrence-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.occurrence-time-without-timezone.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.malformed-created-time.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.created-time-without-timezone.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.null-data.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.unsupported-classification.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.fractional-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.numeric-string-percentage.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.percentage-below-0.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.percentage-above-100.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.extra-data-field.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.wrong-stage-event-type.invalid.json",
    expectedValid: false,
  },
  {
    name: "outcome-battery-event.extra-field.invalid.json",
    expectedValid: false,
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
