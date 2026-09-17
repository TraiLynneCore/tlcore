import validateSubmission from "./contract-validation/validate-submission.mjs";

try {
  validateSubmission();
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
  process.exitCode = 1;
}
