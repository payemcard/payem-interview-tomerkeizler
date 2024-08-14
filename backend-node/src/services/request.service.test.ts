import {
  FinancialRequestCreateParams,
  FinancialRequestStatus,
  FinancialRequestType,
} from "../models/financial-request.model";
import RequestProvider from "../providers/request.provider";
import { mockDb, mockFilters } from "../tests/db.mock";
import RequestService from "./request.service";
import { PayEmError } from "../types/payem-error.type";
import { HttpStatusCode } from "../types/http-status-code.type";
import { PayEmValidationError } from "../types/valitation-error.type";

describe("RequestService", () => {
  let requestService: RequestService;

  beforeEach(() => {
    requestService = new RequestService();
    jest
      .spyOn(RequestProvider.prototype, "dbData", "get")
      .mockReturnValue(mockDb); // Spy on the dbData getter of RequestProvider
  });

  afterEach(() => {
    // getRequestListSpy.mockRestore(); // Restore the original implementation after each test
    jest.restoreAllMocks(); // Restore original implementations after each test
  });

  it("should return all requests", () => {
    const requests = requestService.getRequestList({});

    expect(requests).toBeInstanceOf(Array);
    expect(requests.length).toBe(mockDb.length);
    expect(requests).toEqual(mockDb);
  });

  it("should filter requests by filter parameters", () => {
    const requests = requestService.getRequestList(mockFilters);
    console.log("requests", requests);

    expect(requests).toBeInstanceOf(Array);
    expect(
      requests.every(
        (request) =>
          request.name.toLowerCase().includes(mockFilters.name.toLowerCase()) &&
          request.status === mockFilters.status &&
          request.employee_name
            .toLowerCase()
            .includes(mockFilters.employee_name.toLowerCase())
      )
    ).toBe(true);
  });

  it("should return a single request by ID", () => {
    const request = requestService.getRequest(mockDb[0].id);

    expect(request).toBeDefined();
    expect(request).toBeInstanceOf(Object);
    expect(request).toBe(mockDb[0]);
  });

  it("should fail when trying to get a non-existing request ID", () => {
    const nonExistingId = 1000;

    try {
      requestService.getRequest(nonExistingId);
      fail("Expected function to throw an error"); // If the function doesn't throw, fail the test
    } catch (error) {
      expect(error).toBeInstanceOf(PayEmError);
      expect((error as PayEmError).httpStatusCode).toBe(
        HttpStatusCode.NOT_FOUND
      );
      expect((error as PayEmError).message).toBe("request does not exist");
    }
  });

  it("should approve a request", () => {
    const newRequestParams: FinancialRequestCreateParams = {
      type: FinancialRequestType.Reimbursement,
      name: "My personal request",
      description: "Reimbursement for travel expenses",
      amount: 600,
      currency: "EUR",
      employee_name: "Tomer Keizler",
    };
    const newRequest = requestService.createRequest(newRequestParams); // will be Pending (default status)

    requestService.approveRequest(newRequest.id);
    const request = requestService.getRequest(newRequest.id);

    expect(request.status).toBe(FinancialRequestStatus.Approved);
  });

  it("should decline a request", () => {
    const newRequestParams: FinancialRequestCreateParams = {
      type: FinancialRequestType.Reimbursement,
      name: "My personal request",
      description: "Reimbursement for travel expenses",
      amount: 600,
      currency: "EUR",
      employee_name: "Tomer Keizler",
    };
    const newRequest = requestService.createRequest(newRequestParams); // will be Pending (default status)

    requestService.declineRequest(newRequest.id);
    const request = requestService.getRequest(newRequest.id);

    expect(request.status).toBe(FinancialRequestStatus.Declined);
  });

  it("should not approve an already declined request", () => {
    const newRequestParams: FinancialRequestCreateParams = {
      type: FinancialRequestType.Reimbursement,
      name: "My personal request",
      description: "Reimbursement for travel expenses",
      amount: 600,
      currency: "EUR",
      employee_name: "Tomer Keizler",
    };
    const newRequest = requestService.createRequest(newRequestParams); // will be Pending (default status)
    requestService.declineRequest(newRequest.id);

    try {
      requestService.approveRequest(newRequest.id);
      fail("Expected function to throw an error"); // If the function doesn't throw, fail the test
    } catch (error) {
      expect(error).toBeInstanceOf(PayEmError);
      expect((error as PayEmError).httpStatusCode).toBe(
        HttpStatusCode.BAD_REQUEST
      );
      expect((error as PayEmError).message).toBe(
        "Cannot approve an already declined request"
      );
    }
  });

  it("should create a new request", () => {
    const newRequestParams: FinancialRequestCreateParams = {
      type: FinancialRequestType.Reimbursement,
      name: "My personal request",
      description: "Reimbursement for travel expenses",
      amount: 600,
      currency: "EUR",
      employee_name: "Tomer Keizler",
    };

    const newRequest = requestService.createRequest(newRequestParams);
    expect(newRequest).toBeDefined();
    expect(newRequest.status).toBe(FinancialRequestStatus.Pending);
    expect(newRequest).toMatchObject(newRequestParams);

    const requests = requestService.getRequestList({});
    expect(requests).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: newRequest.id })])
    );
  });

  it("should throw an error when trying to create a request with invalid data", () => {
    const invalidNewRequestParams: FinancialRequestCreateParams = {
      type: FinancialRequestType.Reimbursement,
      name: "123",
      description: "Reimbursement for travel expenses",
      amount: -100,
      currency: "Shekel",
      employee_name: "Tomer Keizler",
    };

    try {
      requestService.createRequest(invalidNewRequestParams);
      fail("Expected function to throw an error"); // If the function doesn't throw, fail the test
    } catch (error) {
      expect(error).toBeInstanceOf(PayEmValidationError);
      expect((error as PayEmValidationError).httpStatusCode).toBe(
        HttpStatusCode.BAD_REQUEST
      );
      expect((error as PayEmValidationError).message).toBe(
        "Data validation failed"
      );
      expect((error as PayEmValidationError).validationErrors).toBeDefined();
      expect((error as PayEmValidationError).validationErrors).toBeInstanceOf(
        Array
      );
    }
  });
});
