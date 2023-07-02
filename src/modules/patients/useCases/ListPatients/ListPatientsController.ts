import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListPatientsUseCase } from "./ListPatientsUseCase";

class ListPatientsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listPatientsUseCase = container.resolve(ListPatientsUseCase);

    const patient = await listPatientsUseCase.execute({
      doctorId: request.doctor.id,
    });

    return response.json(patient);
  }
}

export { ListPatientsController };
