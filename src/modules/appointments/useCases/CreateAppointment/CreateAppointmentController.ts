import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateAppointmentUseCase } from "./CreateAppointmentUseCase";

class CreateAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { date } = request.body;
    const { patientId } = request.params;

    const createAppointmentController = container.resolve(
      CreateAppointmentUseCase
    );

    const appointment = await createAppointmentController.execute({
      date,
      doctorId: request.doctor.id,
      patientId,
    });

    return response.status(201).json(appointment);
  }
}

export { CreateAppointmentController };
