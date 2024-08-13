export class PayEmError extends Error {
  public readonly httpStatusCode: number;

  constructor(httpStatusCode: number, message: string) {
    super(message);
    this.httpStatusCode = httpStatusCode;

    // Maintains proper stack trace for where the error was thrown
    Error.captureStackTrace(this, this.constructor);

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, PayEmError.prototype);
  }
}
