import { ErrorObject } from "ajv";
import { HttpStatusCode } from "./http-status-code.type";
import { PayEmError } from "./payem-error.type";
import ErrorMessage from "./error-message.type";

export class PayEmValidationError extends PayEmError {
  public readonly validationErrors: Array<ErrorObject>;

  constructor(validationErrors: Array<ErrorObject>) {
    super(
      HttpStatusCode.BAD_REQUEST,
      ErrorMessage.ERROR_DATA_VALIDATION_FAILED
    );
    this.validationErrors = validationErrors;

    Object.setPrototypeOf(this, PayEmValidationError.prototype);
  }
}
