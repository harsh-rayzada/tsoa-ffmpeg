import express, {Response as ExResponse, Request as ExRequest} from "express";
import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";

import swaggerUI from "swagger-ui-express";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/docs", swaggerUI.serve, async (_req: ExRequest, res: ExResponse) => {
  return res.send(
    swaggerUI.generateHTML(await import("../build/swagger.json"))
  );
});

// const swaggerDoc = require('../build/swagger.json');
// app.use("/docs1", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

RegisterRoutes(app);

