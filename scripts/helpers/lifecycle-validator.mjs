import createContractAjv from "./create-contract-ajv.mjs";
import createEventValidator from "./event-validator.mjs";
import loadJson from "./load-json.mjs";

const checkStructure = (lifecycle) => {
  if (
    typeof lifecycle !== "object" ||
    lifecycle === null ||
    Array.isArray(lifecycle)
  ) {
    return false;
  }

  const requiredStages = [
    "submission",
    "acceptance",
    "accepted_event",
    "classified_event",
    "outcome_event",
    "status",
  ];

  const savedStages = Object.keys(lifecycle);

  return (
    savedStages.length === requiredStages.length &&
    requiredStages.every((name) => {
      const stage = lifecycle[name];

      return (
        savedStages.includes(name) &&
        typeof stage === "object" &&
        stage !== null &&
        !Array.isArray(stage)
      );
    })
  );
};

const checkLifecycleIdConsistency = (lifecycle) => {
  return (
    lifecycle?.accepted_event?.lifecycle_id ===
      lifecycle?.acceptance?.lifecycle_id &&
    lifecycle?.classified_event?.lifecycle_id ===
      lifecycle?.acceptance?.lifecycle_id &&
    lifecycle?.outcome_event?.lifecycle_id ===
      lifecycle?.acceptance?.lifecycle_id &&
    lifecycle?.status?.lifecycle_id === lifecycle?.acceptance?.lifecycle_id
  );
};

const checkOriginalEventIdConsistency = (lifecycle) => {
  return (
    lifecycle?.accepted_event?.event_id === lifecycle?.submission?.event_id &&
    lifecycle?.classified_event?.original_event_id ===
      lifecycle?.submission?.event_id &&
    lifecycle?.outcome_event?.original_event_id ===
      lifecycle?.submission?.event_id &&
    lifecycle?.status?.original_event_id === lifecycle?.submission?.event_id
  );
};

const checkDistinctIds = (lifecycle) => {
  const a = lifecycle?.acceptance?.lifecycle_id;
  const b = lifecycle?.submission?.event_id;
  const c = lifecycle?.classified_event?.event_id;
  const d = lifecycle?.outcome_event?.event_id;

  const ids = [a, b, c, d];

  return ids.length === new Set(ids).size;
};

const checkSourceConsistency = (lifecycle) => {
  return (
    lifecycle?.accepted_event?.source?.id ===
      lifecycle?.submission?.source?.id &&
    lifecycle?.classified_event?.source?.id ===
      lifecycle?.submission?.source?.id &&
    lifecycle?.outcome_event?.source?.id ===
      lifecycle?.submission?.source?.id &&
    lifecycle?.status?.source?.id === lifecycle?.submission?.source?.id &&
    lifecycle?.accepted_event?.source?.type ===
      lifecycle?.submission?.source?.type &&
    lifecycle?.classified_event?.source?.type ===
      lifecycle?.submission?.source?.type &&
    lifecycle?.outcome_event?.source?.type ===
      lifecycle?.submission?.source?.type &&
    lifecycle?.status?.source?.type === lifecycle?.submission?.source?.type
  );
};

const checkOccurredAtConsistency = (lifecycle) => {
  return (
    lifecycle?.accepted_event?.occurred_at ===
      lifecycle?.submission?.occurred_at &&
    lifecycle?.classified_event?.occurred_at ===
      lifecycle?.submission?.occurred_at &&
    lifecycle?.outcome_event?.occurred_at ===
      lifecycle?.submission?.occurred_at &&
    lifecycle?.status?.occurred_at === lifecycle?.submission?.occurred_at
  );
};

const checkPercentageConsistency = (lifecycle) => {
  return (
    lifecycle?.accepted_event?.data?.battery_percentage ===
      lifecycle?.submission?.data?.battery_percentage &&
    lifecycle?.classified_event?.data?.battery_percentage ===
      lifecycle?.submission?.data?.battery_percentage &&
    lifecycle?.outcome_event?.data?.battery_percentage ===
      lifecycle?.submission?.data?.battery_percentage
  );
};

const checkFinalResultConsistency = (lifecycle) => {
  if (lifecycle?.outcome_event?.data?.worker_state === "completed") {
    return (
      lifecycle?.status?.state === "completed" &&
      lifecycle?.outcome_event?.data?.classification ===
        lifecycle?.status?.classification &&
      lifecycle?.outcome_event?.data?.worker_outcome ===
        lifecycle?.status?.worker_outcome
    );
  }
  if (lifecycle?.outcome_event?.data?.worker_state === "failed") {
    return (
      lifecycle?.status?.state === "failed" &&
      lifecycle?.outcome_event?.data?.failure_reason ===
        lifecycle?.status?.failure_reason
    );
  }

  return false;
};

export default function createLifecycleValidator() {
  const ajv = createContractAjv();
  // Set up Ajv and compile the six schemas once.
  const validateSubmission = ajv.compile(
    loadJson("./docs/contracts/http/battery-submission.schema.json"),
  );
  const validateAcceptance = ajv.compile(
    loadJson("./docs/contracts/http/battery-acceptance.schema.json"),
  );
  const validateAcceptedEvent = createEventValidator(
    ajv.compile(
      loadJson("./docs/contracts/events/accepted-battery-event.schema.json"),
    ),
  );
  const validateClassifiedEvent = createEventValidator(
    ajv.compile(
      loadJson("./docs/contracts/events/classified-battery-event.schema.json"),
    ),
  );
  const validateOutcomeEvent = createEventValidator(
    ajv.compile(
      loadJson("./docs/contracts/events/outcome-battery-event.schema.json"),
    ),
  );
  const validateStatus = ajv.compile(
    loadJson("./docs/contracts/http/battery-status.schema.json"),
  );

  return function validateLifecycle(lifecycle) {
    const result = {
      structureValid: false,
      submissionValid: false,
      acceptanceValid: false,
      acceptedEventValid: false,
      classifiedEventValid: false,
      outcomeEventValid: false,
      statusValid: false,
      lifecycleIdConsistent: false,
      originalEventIdConsistent: false,
      eventIdsDistinct: false,
      sourceConsistent: false,
      occurredAtConsistent: false,
      percentageConsistent: false,
      finalResultConsistent: false,
    };

    // Evaluate structure, individual records, and relationships.
    result.structureValid = checkStructure(lifecycle);
    result.submissionValid = validateSubmission(lifecycle?.submission);
    result.acceptanceValid = validateAcceptance(lifecycle?.acceptance);
    result.acceptedEventValid = validateAcceptedEvent(
      lifecycle?.accepted_event,
    );
    result.classifiedEventValid = validateClassifiedEvent(
      lifecycle?.classified_event,
    );
    result.outcomeEventValid = validateOutcomeEvent(lifecycle?.outcome_event);
    result.statusValid = validateStatus(lifecycle?.status);
    result.lifecycleIdConsistent = checkLifecycleIdConsistency(lifecycle);
    result.originalEventIdConsistent =
      checkOriginalEventIdConsistency(lifecycle);
    result.eventIdsDistinct = checkDistinctIds(lifecycle);
    result.sourceConsistent = checkSourceConsistency(lifecycle);
    result.occurredAtConsistent = checkOccurredAtConsistency(lifecycle);
    result.percentageConsistent = checkPercentageConsistency(lifecycle);
    result.finalResultConsistent = checkFinalResultConsistency(lifecycle);

    return result;
  };
}
