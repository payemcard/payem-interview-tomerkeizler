import RequestProvider from "../providers/request.provider";
import {
  FinancialRequest,
  FinancialRequestCreateParams,
  FinancialRequestSearchParams,
  FinancialRequestStatus,
  FinancialRequestUpdateParams,
} from "../models/financial-request.model";
import { HttpStatusCode } from "../types/http-status-code.type";
import { PayEmError } from "../types/payem-error.type";
import { Validator } from "../utilities/validator.utility";
import ErrorMessage from "../types/error-message.type";

export default class RequestService {
  private static _requestProvider: RequestProvider;

  private get requestProvider(): RequestProvider {
    if (!RequestService._requestProvider) {
      RequestService._requestProvider = new RequestProvider();
    }
    return RequestService._requestProvider;
  }

  public getRequestList(
    searchParams: FinancialRequestSearchParams
  ): Array<FinancialRequest> {
    // validation of search params
    Validator.validate(FinancialRequest.searchSchema, searchParams);

    return this.requestProvider.getRequestList(searchParams);
  }

  public getRequest(requestId: number): FinancialRequest {
    if (!requestId) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_MISSING_REQUEST_ID
      );
    }

    const request = this.requestProvider.getRequest(requestId);
    return request;
  }

  public updateRequest(
    requestId: number,
    updateParams: FinancialRequestUpdateParams
  ): FinancialRequest {
    if (!requestId) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_MISSING_REQUEST_ID
      );
    }

    // validate the FinancialRequest exists
    this.getRequest(requestId);

    // validation of update params
    Validator.validate(FinancialRequest.updateSchema, updateParams);

    this.requestProvider.updateRequest(requestId, updateParams);

    // Return the updated request
    const updatedRequest = this.getRequest(requestId);
    return updatedRequest;
  }

  public approveRequest(requestId: number): void {
    if (!requestId) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_MISSING_REQUEST_ID
      );
    }

    const request = this.getRequest(requestId);
    if (request.status === FinancialRequestStatus.Declined) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_CANNOT_APPROVE_DECLINED_REQUEST
      );
    }

    this.updateRequest(requestId, {
      status: FinancialRequestStatus.Approved,
    });

    // any other business logic related to approving a request...
  }

  public declineRequest(requestId: number): void {
    if (!requestId) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_MISSING_REQUEST_ID
      );
    }

    const request = this.getRequest(requestId);
    if (request.status === FinancialRequestStatus.Approved) {
      throw new PayEmError(
        HttpStatusCode.BAD_REQUEST,
        ErrorMessage.ERROR_CANNOT_DECLINE_APPROVED_REQUEST
      );
    }

    this.updateRequest(requestId, {
      status: FinancialRequestStatus.Declined,
    });

    // any other business logic related to declining a request...
  }

  public createRequest(
    newRequestParams: FinancialRequestCreateParams
  ): FinancialRequest {
    // validation of create params
    Validator.validate(FinancialRequest.createSchema, newRequestParams);

    const newRequest: Omit<FinancialRequest, "id"> = {
      type: newRequestParams.type,
      name: newRequestParams.name,
      description: newRequestParams.description,
      amount: newRequestParams.amount,
      currency: newRequestParams.currency,
      employee_name: newRequestParams.employee_name,
      status: FinancialRequestStatus.Pending,
      created_at: new Date(),
      approved_amount: 0,
    };

    const newRequestId = this.requestProvider.createRequest(newRequest);

    // Return the created request
    const createdRequest = this.getRequest(newRequestId);
    return createdRequest;
  }
}
