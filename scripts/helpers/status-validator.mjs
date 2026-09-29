export default function createStatusValidator(schemaValidator) {
  function validateStatus(data) {
    const schemaValid = schemaValidator(data);
    if (!schemaValid) {
      validateStatus.errors = schemaValidator.errors;
      return false;
    }

    if (data.original_event_id === data.lifecycle_id) {
      validateStatus.errors = [
        {
          instancePath: "/original_event_id",
          keyword: "distinctIdentifiers",
          message: "must differ from lifecycle_id",
        },
      ];
      return false;
    }

    validateStatus.errors = null;
    return true;
  }

  return validateStatus;
}
