import { readdirSync } from "fs";

const getFiles = (directory, prefix) => {
  const filePath = `${directory}/${prefix}`;
  return readdirSync(filePath);
};

const checkFor0Lengths = (files, fixtures) => {
  if (files.length === 0) {
    console.log("FAIL: No files found in the specified directory and prefix");
    process.exitCode = 1;
    return false;
  }

  if (fixtures.length === 0) {
    console.log("FAIL: No fixtures provided");
    process.exitCode = 1;
    return false;
  }

  return true;
};

const compareFileFixtureLength = (files, fixtures) => {
  if (files.length !== fixtures.length) {
    console.log(
      "we have a problem: number of files does not match number of fixtures",
    );
    if (files.length > fixtures.length) {
      console.log(
        "Extra files found:",
        files.filter((f) => !fixtures.some((fx) => fx.name === f)),
      );
    }
    if (files.length < fixtures.length) {
      console.log(
        "Missing files:",
        fixtures.filter((fx) => !files.includes(fx.name)).map((fx) => fx.name),
      );
    }
    process.exitCode = 1;
    return false;
  }
  return true;
};

const compareFileFixtureNames = (files, fixtures) => {
  const extraFiles = files.filter((f) => !fixtures.some((fx) => fx.name === f));
  const missingFiles = fixtures
    .filter((fx) => !files.includes(fx.name))
    .map((fx) => fx.name);

  if (extraFiles.length > 0) {
    console.log("Extra files found:", extraFiles);
  }

  if (missingFiles.length > 0) {
    console.log("Missing files:", missingFiles);
  }

  return extraFiles.length === 0 && missingFiles.length === 0;
};

const checkRegisterDuplicates = (fixtures) => {
  const seen = new Set();
  const duplicates = [];
  for (const fixture of fixtures) {
    if (seen.has(fixture.name)) {
      duplicates.push(fixture.name);
    } else {
      seen.add(fixture.name);
    }
  }
  if (duplicates.length > 0) {
    console.log("Duplicate fixtures found:", duplicates);
    process.exitCode = 1;
    return false;
  }
  return true;
};

export const checkFixtureRegistration = (directory, prefix, fixtures) => {
  const files = getFiles(directory, prefix);
  if (!checkFor0Lengths(files, fixtures)) {
    process.exitCode = 1;
    return;
  }

  if (!checkRegisterDuplicates(fixtures)) {
    process.exitCode = 1;
    return;
  }

  if (!compareFileFixtureLength(files, fixtures)) {
    process.exitCode = 1;
    return;
  }

  if (!compareFileFixtureNames(files, fixtures)) {
    process.exitCode = 1;
    return;
  }

  console.log(`Checked ${fixtures.length} fixtures`);
  return fixtures;
};
