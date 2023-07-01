import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshDoctorTokenUseCase } from "./RefreshDoctorTokenUseCase";

class RefreshDoctorTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body;

    const refreshDoctorTokenUseCase = container.resolve(
      RefreshDoctorTokenUseCase
    );

    const refreshTokenResponse = await refreshDoctorTokenUseCase.execute(
      refreshToken
    );

    return response.json(refreshTokenResponse);
  }
}

export { RefreshDoctorTokenController };
