import "reflect-metadata";
import "dotenv/config";
import "express-async-errors";
import cors from "cors";
import { errors } from "celebrate";

import "@shared/container";
import getConnection from "@shared/infra/typeorm/";

import express, { NextFunction, Request, Response } from "express";
import AppError from "@shared/errors/AppError";
import routes from "./routes";

getConnection();

const app = express();

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(errors());

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
