/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";

interface IPayload {
  sub: string;
}

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authorization } = request.headers;

  if (!authorization) {
    return response.status(401).json({
      error: true,
      code: "token.invalid",
      message: "Token not present.",
    });
  }

  const [, token] = authorization.split(" ");

  if (!token) {
    return response.status(401).json({
      error: true,
      code: "token.invalid",
      message: "Token not present.",
    });
  }

  try {
    const { sub: doctorId } = verify(token, auth.secretToken) as IPayload;

    request.doctor = {
      id: doctorId,
    };

    next();
  } catch (err) {
    return response.status(401).json({
      error: true,
      code: "token.expired",
      message: "Token invalid.",
    });
  }
}
