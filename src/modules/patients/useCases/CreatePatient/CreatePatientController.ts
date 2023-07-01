import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreatePatientUseCase } from "./CreatePatientUseCase";

class CreatePatientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { birthDate, email, genderId, height, name, phone, weight } =
      request.body;

    const createPatientUseCase = container.resolve(CreatePatientUseCase);

    const patient = await createPatientUseCase.execute({
      birthDate,
      doctorId: request.doctor.id,
      email,
      genderId,
      height,
      name,
      phone,
      weight,
    });

    return response.status(201).json(patient);
  }
}

export { CreatePatientController };
