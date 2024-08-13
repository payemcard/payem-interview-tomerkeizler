import { ObjectUtility } from "../utilities/object.utility";

export enum FinancialRequestType {
  Purchase = "purchase",
  Reimbursement = "reimbursement",
}

export enum FinancialRequestStatus {
  Pending = "PEN",
  Approved = "APR",
  Declined = "DEC",
}

export class FinancialRequest {
  id: number;
  type: FinancialRequestType;
  name: string;
  description: string;
  amount: number;
  currency: string;
  employee_name: string;
  status: FinancialRequestStatus;
  created_at: Date;
  updated_at?: Date;
  approved_amount: number;

  constructor(financialRequest: FinancialRequest) {
    this.id = financialRequest.id;
    this.type = financialRequest.type;
    this.name = financialRequest.name;
    this.description = financialRequest.description;
    this.amount = financialRequest.amount;
    this.currency = financialRequest.currency;
    this.employee_name = financialRequest.employee_name;
    this.status = financialRequest.status;
    this.created_at = financialRequest.created_at;
    this.updated_at = financialRequest.updated_at;
    this.approved_amount = financialRequest.approved_amount;
  }

  static readonly createSchema = {
    type: "object",
    properties: {
      type: { type: "string", enum: Object.values(FinancialRequestType) },
      name: { type: "string", pattern: "^[a-zA-Z]+$" },
      description: { type: "string" },
      amount: { type: "number", minimum: 0 },
      currency: {
        type: "string",
        pattern: "[A-Z]",
        minLength: 3,
        maxLength: 3,
      },
      employee_name: { type: "string", pattern: "^[a-zA-Z]+$" },
    },
    required: [
      "type",
      "name",
      "description",
      "amount",
      "currency",
      "employee_name",
    ],
    additionalProperties: false,
  };

  static readonly updateSchema = {
    type: "object",
    properties: {
      name: { type: "string", pattern: "^[a-zA-Z]+$" },
      description: { type: "string" },
      amount: { type: "number", minimum: 0 },
      currency: {
        type: "string",
        pattern: "[A-Z]",
        minLength: 3,
        maxLength: 3,
      },
      employee_name: { type: "string", pattern: "^[a-zA-Z]+$" },
      status: { type: "string", enum: Object.values(FinancialRequestStatus) },
    },
    minProperties: 1,
    additionalProperties: false,
  };

  static readonly searchSchema = {
    type: "object",
    properties: {
      name: { type: "string" },
      employee_name: { type: "string" },
      status: { type: "string", enum: Object.values(FinancialRequestStatus) },
    },
  };
}

export type FinancialRequestCreateParams = Pick<
  FinancialRequest,
  "type" | "name" | "description" | "amount" | "currency" | "employee_name"
>;

export type FinancialRequestUpdateParams = Partial<
  Pick<
    FinancialRequest,
    "name" | "description" | "amount" | "currency" | "employee_name" | "status"
  >
>;

export type FinancialRequestSearchParams = Partial<
  Record<keyof FinancialRequest, any>
>;
