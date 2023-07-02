import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdatePatientUseCase } from "./UpdatePatientUseCase";

class UpdatePatientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { birthDate, email, genderId, height, name, phone, weight } =
      request.body;
    const { patientId } = request.params;

    const updatePatientUseCase = container.resolve(UpdatePatientUseCase);

    const updatedPatient = await updatePatientUseCase.execute({
      birthDate,
      doctorId: request.doctor.id,
      email,
      genderId,
      height,
      name,
      phone,
      weight,
      patientId,
    });

    return response.json(updatedPatient);
  }
}

export { UpdatePatientController };
