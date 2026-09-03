import { validateAcceptanceContracts } from "./contract-validation/validate-acceptance.mjs";
import { validateStatusContracts } from "./contract-validation/validate-status.mjs";
import { validateSubmissionContracts } from "./contract-validation/validate-submission.mjs";

console.log("[TLCore] Validating TLCore contracts...");

validateSubmissionContracts();
validateAcceptanceContracts();
validateStatusContracts();
