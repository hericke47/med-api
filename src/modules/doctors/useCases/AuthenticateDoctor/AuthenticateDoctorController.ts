import { Request, Response } from "express";
import { container } from "tsyringe";

import { AuthenticateDoctorUseCase } from "./AuthenticateDoctorUseCase";

class AuthenticateDoctorController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { password, email } = request.body;

    const authenticateDoctorUseCase = container.resolve(
      AuthenticateDoctorUseCase
    );

    const authResponse = await authenticateDoctorUseCase.execute({
      password,
      email,
    });

    return response.json(authResponse);
  }
}

export default AuthenticateDoctorController;
