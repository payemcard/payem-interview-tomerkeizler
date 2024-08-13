import express from "express";
import cors from "cors";
import requestRouter from "./routers/request.router";
import { errorHandler } from "./middlewares/error-handler.middleware";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/requests", requestRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
