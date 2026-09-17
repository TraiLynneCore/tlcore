import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";

export const loadJson = (path) => {
  try {
    const fileContent = readFileSync(path, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    throw new Error(
      `Failed to load JSON from path: ${path}: ${error.message}`,
      { cause: error },
    );
  }
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
