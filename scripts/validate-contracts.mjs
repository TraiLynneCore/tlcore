import { validateAcceptanceContracts } from "./contract-validation/validate-acceptance.mjs";
import { validateEventContracts } from "./contract-validation/validate-event.mjs";
import { validateStatusContracts } from "./contract-validation/validate-status.mjs";
import { validateSubmissionContracts } from "./contract-validation/validate-submission.mjs";

console.log("[TLCore][contracts] Validating all contracts...");

validateSubmissionContracts();
validateAcceptanceContracts();
validateStatusContracts();
validateEventContracts();
