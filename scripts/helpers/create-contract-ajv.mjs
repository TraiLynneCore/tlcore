import addFormats from "ajv-formats";
import Ajv2020 from "ajv/dist/2020.js";
import loadJson from "./load-json.mjs";

const createContractAjv = () => {
  const ajv = new Ajv2020({ allErrors: true });
  addFormats(ajv);
  ajv.addSchema(loadJson("./docs/contracts/common/event-envelope.schema.json"));
  return ajv;
};
export default createContractAjv;
