import { readFileSync } from "node:fs";

export function loadJson(filePath) {
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

export function checkFixture(name, validate, data, expectedValid) {
  const actualValid = validate(data);

  if (actualValid === expectedValid) {
    console.log(`PASS ${name}`);
    return;
  }

  console.error(
    `FAIL ${name} was ${actualValid ? "accepted" : "rejected"} unexpectedly`,
  );

  if (validate.errors) {
    console.error(validate.errors);
  }

  process.exitCode = 1;
}
