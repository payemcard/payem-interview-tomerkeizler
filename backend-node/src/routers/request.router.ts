import { Router } from "express";
import RequestController from "../controllers/request.controller";

const requestRouter = Router();
const requestController = new RequestController();

// Get all requests
requestRouter.get(
  "/",
  requestController.getRequestList.bind(requestController)
);

requestRouter.get(
  "/:request_id",
  requestController.getRequest.bind(requestController)
);

requestRouter.patch(
  "/:request_id/approve",
  requestController.approveRequest.bind(requestController)
);

requestRouter.patch(
  "/:request_id/decline",
  requestController.declineRequest.bind(requestController)
);

requestRouter.post(
  "/",
  requestController.createRequest.bind(requestController)
);

export default requestRouter;
