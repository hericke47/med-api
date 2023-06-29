import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshDoctorTokenUseCase } from "./RefreshDoctorTokenUseCase";

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const token =
      request.body.token ||
      request.headers["x-access-token"] ||
      request.query.token;

    const refreshDoctorTokenUseCase = container.resolve(
      RefreshDoctorTokenUseCase
    );

    const refreshToken = await refreshDoctorTokenUseCase.execute(token);

    return response.json(refreshToken);
  }
}

export { RefreshTokenController };
