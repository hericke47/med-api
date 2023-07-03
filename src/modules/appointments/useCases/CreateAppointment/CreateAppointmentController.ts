import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAppointmentUseCase } from "./CreateAppointmentUseCase";

class CreateAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { date, patientId } = request.body;

    const createAppointmentUseCase = container.resolve(
      CreateAppointmentUseCase
    );

    const appointment = await createAppointmentUseCase.execute({
      date,
      doctorId: request.doctor.id,
      patientId,
    });

    return response.status(201).json(appointment);
  }
}

export { CreateAppointmentController };
