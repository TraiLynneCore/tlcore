import { validateAcceptanceContracts } from "./contract-validation/validate-acceptance.mjs";
import { validateAcceptedEvents } from "./contract-validation/validate-accepted-event.mjs";
import { validateClassifiedEvents } from "./contract-validation/validate-classified-event.mjs";
import { validateStatusContracts } from "./contract-validation/validate-status.mjs";
import { validateSubmissionContracts } from "./contract-validation/validate-submission.mjs";

console.log("[TLCore][contracts] Validating all contracts...");

validateSubmissionContracts();
validateAcceptanceContracts();
validateStatusContracts();
console.log("[TLCore][contracts] Validating event fixtures...");
validateAcceptedEvents();
validateClassifiedEvents();
