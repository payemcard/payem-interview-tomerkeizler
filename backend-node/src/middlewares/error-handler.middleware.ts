import { Request, Response, NextFunction } from "express";
import { HttpStatusCode } from "../types/http-status-code.type";
import { PayEmError } from "../types/payem-error.type";
import { PayEmValidationError } from "../types/valitation-error.type";

export const errorHandler = (
  error: PayEmError | Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Error handling for PayEm Validation errors
  if (error instanceof PayEmValidationError) {
    console.log("error", error);

    res.status(error.httpStatusCode).json({
      status: "ERROR",
      httpStatusCode: error.httpStatusCode,
      message: error.message,
      validationErrors: error.validationErrors.map(
        ({ instancePath, message }) => ({ instancePath, message })
      ),
    });
  }
  // Error handling for the custom PayEmError exception
  else if (error instanceof PayEmError) {
    res.status(error.httpStatusCode).json({
      status: "ERROR",
      httpStatusCode: error.httpStatusCode,
      message: error.message,
    });
  }
  // Generic error handling for unknown errors
  else {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
      status: "ERROR",
      httpStatusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: "Something went wrong...",
    });
  }
};
