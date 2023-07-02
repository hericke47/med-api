import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeletePatientUseCase } from "./DeletePatientUseCase";

class DeletePatientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.params;

    const deletePatientController = container.resolve(DeletePatientUseCase);

    const patient = await deletePatientController.execute({
      doctorId: request.doctor.id,
      patientId,
    });

    return response.json(patient);
  }
}

export { DeletePatientController };
