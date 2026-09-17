import validateAcceptance from "./contract-validation/validate-acceptance.mjs";
import validateAcceptedBatteryEvent from "./contract-validation/validate-accepted-battery-event.mjs";
import validateClassifiedBatteryEvent from "./contract-validation/validate-classified-battery-event.mjs";
import validateSubmission from "./contract-validation/validate-submission.mjs";

try {
  validateSubmission();
  validateAcceptance();
  validateAcceptedBatteryEvent();
  validateClassifiedBatteryEvent();
} catch (error) {
  console.error(`Validation failed: ${error.message}`);
  process.exitCode = 1;
}
