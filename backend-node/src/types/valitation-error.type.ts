import { ErrorObject } from "ajv";
import { HttpStatusCode } from "./http-status-code.type";
import { PayEmError } from "./payem-error.type";

export class PayEmValidationError extends PayEmError {
  public readonly validationErrors: Array<ErrorObject>;

  constructor(validationErrors: Array<ErrorObject>) {
    super(HttpStatusCode.BAD_REQUEST, "Data validation failed");
    this.validationErrors = validationErrors;

    Object.setPrototypeOf(this, PayEmValidationError.prototype);
  }
}
