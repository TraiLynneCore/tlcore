import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";

export const loadJson = (path) => {
  const fileContent = readFileSync(path, "utf-8");
  return JSON.parse(fileContent);
};

export const createContractAjv = () => {
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  ajv.addSchema(loadJson("./docs/contracts/common/event-envelope.schema.json"));
  return ajv;
};

export const checkFixture = (name, validate, data, expectedValid) => {
  const actualValid = validate(data);

  if (actualValid !== expectedValid) {
    console.error(
      `FAIL ${name} was ${actualValid ? "accepted" : "rejected"} unexpectedly`,
    );

    if (validate.errors) {
      console.error(validate.errors);
    }

    process.exitCode = 1;
    return;
  }

  console.log(`PASS ${name}`);

  return;
};

export const checkFixtureRegistration = (directory, prefix, fixtures) => {
  fixtures.forEach((fixture) => {
    const { name } = fixture;
    let fixtureData = loadJson(`${directory}/${prefix}/${name}.json`);

    if (!fixtureData) {
      console.error(`FAIL ${name} could not be loaded`);
      process.exitCode = 1;
      return;
    }
  });

  console.log(`Checked ${fixtures.length} fixtures`);
  return fixtures;
};
