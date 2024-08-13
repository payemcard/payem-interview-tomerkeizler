import { NextFunction, Request, Response } from "express";
import RequestService from "../services/request.service";
import {
  FinancialRequestCreateParams,
  FinancialRequestStatus,
  FinancialRequestType,
} from "../models/financial-request.model";
import { HttpStatusCode } from "../types/http-status-code.type";
import { ObjectUtility } from "../utilities/object.utility";

export default class RequestController {
  private static _requestService: RequestService;

  private get requestService(): RequestService {
    if (!RequestController._requestService) {
      RequestController._requestService = new RequestService();
    }
    return RequestController._requestService;
  }

  public getRequestList(req: Request, res: Response, next: NextFunction): void {
    try {
      const inputParams = {
        name: req.query.name as string,
        status: req.query.status as FinancialRequestStatus,
        employee_name: req.query.employeeName as string,
      };

      // filter only defined search params
      const searchParams = ObjectUtility.cleanObject(inputParams);

      const requests = this.requestService.getRequestList(searchParams);

      res.status(HttpStatusCode.OK).json(requests);
    } catch (error) {
      next(error);
    }
  }

  public getRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      const requestId = Number(req.params.request_id);
      const request = this.requestService.getRequest(requestId);

      res.status(HttpStatusCode.OK).json(request);
    } catch (error) {
      next(error);
    }
  }

  public approveRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      const requestId = Number(req.params.request_id);
      this.requestService.approveRequest(requestId);

      res
        .status(HttpStatusCode.OK)
        .send(`Request ${requestId} was approved successfully`);
    } catch (error) {
      next(error);
    }
  }

  public declineRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      const requestId = Number(req.params.request_id);
      this.requestService.declineRequest(requestId);

      res
        .status(HttpStatusCode.OK)
        .send(`Request ${requestId} was declined successfully`);
    } catch (error) {
      next(error);
    }
  }

  public createRequest(req: Request, res: Response, next: NextFunction): void {
    try {
      /* 
      In the future we may want to implement here an idempotency mechanism, in order to 
      ensure that multiple identical requests do not result in duplicate write operations.
      const idempotencyToken = req.headers.['Idempotency-Token'];
      */

      const newRequestParams: FinancialRequestCreateParams = {
        type: req.body.type as FinancialRequestType,
        name: req.body.name as string,
        description: req.body.description as string,
        amount: req.body.amount as number,
        currency: req.body.currency as string,
        employee_name: req.body.employee_name as string,
      };

      const newRequest = this.requestService.createRequest(newRequestParams);

      res.status(HttpStatusCode.CREATED).json(newRequest);
    } catch (error) {
      next(error);
    }
  }
}
