import validateAcceptance from "./contract-validation/validate-acceptance.mjs";
import validateSubmission from "./contract-validation/validate-submission.mjs";

try {
  validateSubmission();
  validateAcceptance();
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
  process.exitCode = 1;
}
