export default function createEventValidator(schemaValidator) {
  function validateEvent(data) {
    const schemaValid = schemaValidator(data);

    if (!schemaValid) {
      validateEvent.errors = schemaValidator.errors;
      return false;
    }

    if (data.event_id === data.lifecycle_id) {
      validateEvent.errors = [
        {
          instancePath: "/event_id",
          keyword: "distinctIdentifiers",
          message: "must differ from lifecycle_id",
        },
      ];
      return false;
    }

    if (data.original_event_id) {
      if (data.original_event_id === data.event_id) {
        validateEvent.errors = [
          {
            instancePath: "/original_event_id",
            keyword: "distinctIdentifiers",
            message: "must differ from event_id",
          },
        ];
        return false;
      }

      if (data.original_event_id === data.lifecycle_id) {
        validateEvent.errors = [
          {
            instancePath: "/original_event_id",
            keyword: "distinctIdentifiers",
            message: "must differ from lifecycle_id",
          },
        ];
        return false;
      }
    }

    validateEvent.errors = null;
    return true;
  }

  return validateEvent;
}
