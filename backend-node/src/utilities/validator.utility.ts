import Ajv, { AnySchema } from "ajv";
import { PayEmValidationError } from "../types/valitation-error.type";
import { ErrorObject } from "ajv";

export class Validator {
  private static instance: Ajv;

  static getInstance(): Ajv {
    if (!Validator.instance) {
      const ajv = new Ajv({ $data: true, allErrors: true });
      Validator.instance = ajv;
    }
    return Validator.instance;
  }

  static validate(schema: AnySchema, data: any): void {
    const ajv = Validator.getInstance();
    const validate = ajv.compile(schema);
    const is_valid = validate(data);

    if (!is_valid) {
      const validationErrorList = validate.errors;
      throw new PayEmValidationError(validationErrorList as Array<ErrorObject>);
    }
  }
}
