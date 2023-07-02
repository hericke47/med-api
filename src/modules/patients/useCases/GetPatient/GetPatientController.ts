import { Request, Response } from "express";
import { container } from "tsyringe";

import { GetPatientUseCase } from "./GetPatientUseCase";

class GetPatientController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { patientId } = request.params;

    const getPatientUseCase = container.resolve(GetPatientUseCase);

    const patient = await getPatientUseCase.execute({
      doctorId: request.doctor.id,
      patientId,
    });

    return response.json(patient);
  }
}

export { GetPatientController };
