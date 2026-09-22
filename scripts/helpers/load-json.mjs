import { readFileSync } from "node:fs";

const loadJson = (path) => {
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

export default loadJson;
