import { db, incrementNextId, nextId } from "../db";
import {
  FinancialRequest,
  FinancialRequestSearchParams,
  FinancialRequestUpdateParams,
} from "../models/financial-request.model";
import { HttpStatusCode } from "../types/http-status-code.type";
import { PayEmError } from "../types/payem-error.type";

export default class RequestProvider {
  get dbData(): Array<FinancialRequest> {
    return db;
  }

  public getRequestList(
    searchParams: FinancialRequestSearchParams
  ): Array<FinancialRequest> {
    if (!searchParams || Object.keys(searchParams).length === 0) {
      return this.dbData;
    }

    // define search type for FinancialRequest searchable fields
    const freeTextSearchfields: Array<keyof FinancialRequest> = [
      "name",
      "employee_name",
    ];
    const exactSearchfields: Array<keyof FinancialRequest> = ["status"];

    const filteredRequests = this.dbData.filter((request) => {
      // for each request in the DB: check whether it satisfies the seacrh params
      return Object.keys(searchParams).every((param) => {
        if (!request.hasOwnProperty(param)) {
          return false;
        }

        const typedSearchParam = param as keyof FinancialRequest;
        const actualValue = (request[typedSearchParam] as string).toLowerCase();
        const searchValue = searchParams[typedSearchParam].toLowerCase();

        // in case the search value should be CONTAINED in the actual field value
        if (freeTextSearchfields.includes(typedSearchParam)) {
          return actualValue.includes(searchValue);
        }
        // in case the search value should be EQUAL to the actual field value
        if (exactSearchfields.includes(typedSearchParam)) {
          return actualValue === searchValue;
        }
      });
    });

    return filteredRequests;
  }

  public getRequest(requestId: number): FinancialRequest {
    const request = this.dbData.find((request) => request.id === requestId);

    if (!request) {
      throw new PayEmError(HttpStatusCode.NOT_FOUND, `request does not exist`);
    }
    return request;
  }

  public updateRequest(
    requestId: number,
    updateParams: FinancialRequestUpdateParams
  ): void {
    // Find the index of the request in the database
    const requestIndex = this.dbData.findIndex(
      (request) => request.id === requestId
    );

    if (requestIndex === -1) {
      // Request not found
      throw new PayEmError(HttpStatusCode.NOT_FOUND, `request does not exist`);
    }

    // Update the existing request with the new values
    const updatedRequest = {
      ...this.dbData[requestIndex],
      ...updateParams,
      updated_at: new Date(),
    };

    // Replace the old request with the updated request in the database
    this.dbData[requestIndex] = updatedRequest;
  }

  public createRequest(newRequest: Omit<FinancialRequest, "id">): number {
    const newRequestId = nextId;
    this.dbData.push({ id: newRequestId, ...newRequest }); // Assign the next available ID
    incrementNextId(); // Increment the next ID for the next entry
    return newRequestId; // Return the new request ID
  }
}
