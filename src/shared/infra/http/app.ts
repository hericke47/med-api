import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import { errors } from "celebrate";
import { serve, setup } from "swagger-ui-express";

import express, { NextFunction, Request, Response } from "express";
import AppError from "@shared/errors/AppError";
import { swaggerConfig } from "doc";
import getConnection from "@shared/infra/typeorm/";
import routes from "./routes";

import "@shared/container";

getConnection();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());

if (process.env.NODE_ENV !== "production") {
  app.use("/api-docs", serve, setup(swaggerConfig));
}

app.use(
  (err: Error, _request: Request, response: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        message: err.message,
      });
    }
    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${err.message}`,
    });
  }
);

export { app };
