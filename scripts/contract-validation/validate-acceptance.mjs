import {
  checkFixture,
  createContractAjv,
  loadJson,
} from "./helpers/helpers.mjs";
import { checkFixtureRegistration } from "./helpers/validate-fixture-registration.mjs";

const fixtureRegistration = [
  // Valid response
  {
    name: "battery-acceptance.valid.json",
    expectedValid: true,
  },

  // Lifecycle ID
  {
    name: "battery-acceptance.missing-lifecycle-id.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance.malformed-lifecycle-id.invalid.json",
    expectedValid: false,
  },

  // State
  {
    name: "battery-acceptance.missing-state.invalid.json",
    expectedValid: false,
  },
  {
    name: "battery-acceptance.non-pending-state.invalid.json",
    expectedValid: false,
  },

  // Extra fields
  {
    name: "battery-acceptance.extra-field.invalid.json",
    expectedValid: false,
  },
];

export default function validateAcceptance() {
  console.log("[TLCore] Starting Battery Acceptance validation...");

  const ajv = createContractAjv();

  const batteryAcceptanceSchema = loadJson(
    "./docs/contracts/http/battery-acceptance.schema.json",
  );

  checkFixtureRegistration(
    "./docs/contracts/examples/http",
    "battery-acceptance",
    fixtureRegistration,
  );

  const validate = ajv.compile(batteryAcceptanceSchema);

  for (const fixture of fixtureRegistration) {
    const { name, expectedValid } = fixture;
    const data = loadJson(
      `./docs/contracts/examples/http/battery-acceptance/${name}`,
    );

    checkFixture(name, validate, data, expectedValid);
  }
}
