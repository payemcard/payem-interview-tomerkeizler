export default class ErrorMessage {
  static get ERROR_FINANCIAL_REQUEST_NOT_FOUND(): string {
    return "request does not exist";
  }
  static get ERROR_MISSING_REQUEST_ID(): string {
    return "request ID parameter is missing";
  }
  static get ERROR_DATA_VALIDATION_FAILED(): string {
    return "Data validation failed";
  }
  static get ERROR_CANNOT_APPROVE_DECLINED_REQUEST(): string {
    return "Cannot approve an already declined request";
  }
  static get ERROR_CANNOT_DECLINE_APPROVED_REQUEST(): string {
    return "Cannot decline an already approved request";
  }
}
