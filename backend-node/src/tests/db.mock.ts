import {
  FinancialRequest,
  FinancialRequestStatus,
  FinancialRequestType,
} from "../models/financial-request.model";

let mockDb: Array<FinancialRequest> = [
  {
    id: 1,
    type: FinancialRequestType.Purchase,
    name: "Test Request 1",
    description: "Request to purchase office supplies",
    amount: 100,
    currency: "USD",
    employee_name: "John Doe",
    status: FinancialRequestStatus.Pending,
    created_at: new Date("2024-07-19T08:30:00Z"),
    approved_amount: 90,
  },
  {
    id: 2,
    type: FinancialRequestType.Reimbursement,
    name: "Test Request 2",
    description: "Reimbursement for travel expenses",
    amount: 150,
    currency: "EUR",
    employee_name: "Jane Smith",
    status: FinancialRequestStatus.Declined,
    created_at: new Date("2024-07-18T10:15:00Z"),
    updated_at: new Date("2024-07-20T14:20:00Z"),
    approved_amount: 140,
  },
  {
    id: 3,
    type: FinancialRequestType.Purchase,
    name: "Test Request 3",
    description: "Request to purchase new laptops",
    amount: 80,
    currency: "USD",
    employee_name: "Alice Johnson",
    status: FinancialRequestStatus.Pending,
    created_at: new Date("2024-07-17T12:45:00Z"),
    approved_amount: 75,
  },
  {
    id: 4,
    type: FinancialRequestType.Reimbursement,
    name: "Test Request 4",
    description: "Reimbursement for conference fees",
    amount: 120,
    currency: "EUR",
    employee_name: "Bob Brown",
    status: FinancialRequestStatus.Approved,
    created_at: new Date("2024-07-16T09:00:00Z"),
    updated_at: new Date("2024-07-18T11:30:00Z"),
    approved_amount: 110,
  },
];

const mockFilters = {
  name: "test",
  status: FinancialRequestStatus.Approved,
  employee_name: "bob",
};

export { mockDb, mockFilters };
