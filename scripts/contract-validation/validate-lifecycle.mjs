import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import { createEventValidator, loadJson } from "./helpers.mjs";

// Create an AJV instance with allErrors option enabled
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);

const validateSubmissionSchema = ajv.compile(
  loadJson("./docs/contracts/http/battery-submission.schema.json"),
);
const validateAcceptanceSchema = ajv.compile(
  loadJson("./docs/contracts/http/battery-acceptance.schema.json"),
);
const validateAcceptedEventSchema = createEventValidator(
  ajv.compile(
    loadJson("./docs/contracts/events/accepted-battery-event.schema.json"),
  ),
);
const validateClassifiedEventSchema = createEventValidator(
  ajv.compile(
    loadJson("./docs/contracts/events/classified-battery-event.schema.json"),
  ),
);
const validateOutcomeEventSchema = createEventValidator(
  ajv.compile(
    loadJson("./docs/contracts/events/outcome-battery-event.schema.json"),
  ),
);
const validateStatusSchema = ajv.compile(
  loadJson("./docs/contracts/http/battery-status.schema.json"),
);

const lifecycles = [
  {
    name: "battery-lifecycle-normal-complete.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-low-complete.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-critical-complete.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-normal-failed.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-low-failed.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-critical-failed.valid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-mismatched-lifecycle-id.invalid.json",
    expected: {
      lifecycleIdConsistent: false,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-duplicate-event-id.invalid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: false,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-mismatched-device-id.invalid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: false,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-mismatched-percentage.invalid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: false,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: true,
    },
  },
  {
    name: "battery-lifecycle-mismatched-final-result.invalid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: false,
    },
  },
  {
    name: "battery-lifecycle-mismatched-final-state.invalid.json",
    expected: {
      lifecycleIdConsistent: true,
      eventIdsUnique: true,
      percentageConsistent: true,
      classificationConsistent: true,
      deviceIdConsistent: true,
      submissionStatus: true,
      acceptanceStatus: true,
      acceptanceEventStatus: true,
      classificationEventStatus: true,
      outcomeEventStatus: true,
      statusStatus: true,
      finalStatusConsistent: false,
    },
  },
];

function validateLifecycleId(lifecycle) {
  const lifecycleIds = [
    lifecycle[1].lifecycle_id,
    lifecycle[2].lifecycle_id,
    lifecycle[3].lifecycle_id,
    lifecycle[4].lifecycle_id,
    lifecycle[5].lifecycle_id,
  ];

  return lifecycleIds.every((lifecycleId) => lifecycleId === lifecycleIds[0]);
}

function validateEventIds(lifecycle) {
  const eventIds = [
    lifecycle[2].event_id,
    lifecycle[3].event_id,
    lifecycle[4].event_id,
  ];

  return new Set(eventIds).size === eventIds.length;
}

function validateBatteryPercentage(lifecycle) {
  const batteryPercentages = [
    lifecycle[0].battery_percentage,
    lifecycle[2].battery_percentage,
    lifecycle[3].battery_percentage,
    lifecycle[4].battery_percentage,
  ];

  return batteryPercentages.every(
    (batteryPercentage) => batteryPercentage === batteryPercentages[0],
  );
}

function validateClassification(lifecycle) {
  return lifecycle[3].classification === lifecycle[4].classification;
}

function validateDeviceId(lifecycle) {
  const deviceIds = [
    lifecycle[0].device_id,
    lifecycle[2].device_id,
    lifecycle[3].device_id,
    lifecycle[4].device_id,
  ];

  return deviceIds.every((deviceId) => deviceId === deviceIds[0]);
}

function validateFinalStatusConsistency(lifecycle) {
  const outcomeEvent = lifecycle[4];
  const finalStatus = lifecycle[5];

  if (outcomeEvent.state !== finalStatus.state) {
    return false;
  }

  if (outcomeEvent.state === "completed") {
    return (
      outcomeEvent.classification === finalStatus.classification &&
      outcomeEvent.worker_outcome === finalStatus.worker_outcome
    );
  }

  return outcomeEvent.failure_reason === finalStatus.failure_reason;
}

function validateLifecycle(lifecycleFile) {
  const lifecycle = loadJson(
    `./docs/contracts/examples/lifecycles/${lifecycleFile}`,
  );

  return {
    lifecycleIdConsistent: validateLifecycleId(lifecycle),
    eventIdsUnique: validateEventIds(lifecycle),
    percentageConsistent: validateBatteryPercentage(lifecycle),
    classificationConsistent: validateClassification(lifecycle),
    deviceIdConsistent: validateDeviceId(lifecycle),
    submissionStatus: validateSubmissionSchema(lifecycle[0]),
    acceptanceStatus: validateAcceptanceSchema(lifecycle[1]),
    acceptanceEventStatus: validateAcceptedEventSchema(lifecycle[2]),
    classificationEventStatus: validateClassifiedEventSchema(lifecycle[3]),
    outcomeEventStatus: validateOutcomeEventSchema(lifecycle[4]),
    statusStatus: validateStatusSchema(lifecycle[5]),
    finalStatusConsistent: validateFinalStatusConsistency(lifecycle),
  };
}

export function validateLifecycles() {
  console.log("[TLCore][contracts] Validating battery lifecycles...");

  for (const data of lifecycles) {
    const validationResult = validateLifecycle(data.name);

    let passed = true;

    for (const result in validationResult) {
      if (validationResult[result] !== data.expected[result]) {
        console.error(`FAIL ${data.name}: ${result}`);
        process.exitCode = 1;
        passed = false;
      }
    }

    if (passed) {
      console.log(`PASS ${data.name}`);
    }
  }
}
