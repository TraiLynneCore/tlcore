import validateAcceptance from "./contract-validation/validate-acceptance.mjs";
import validateAcceptedBatteryEvent from "./contract-validation/validate-accepted-battery-event.mjs";
import validateSubmission from "./contract-validation/validate-submission.mjs";

try {
  validateSubmission();
  validateAcceptance();
  validateAcceptedBatteryEvent();
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
  process.exitCode = 1;
}
