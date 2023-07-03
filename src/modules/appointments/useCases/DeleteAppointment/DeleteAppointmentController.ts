import { Request, Response } from "express";
import { container } from "tsyringe";

import { DeleteAppointmentUseCase } from "./DeleteAppointmentUseCase";

class DeleteAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;

    const deleteAppointmentUseCase = container.resolve(
      DeleteAppointmentUseCase
    );

    const appointment = await deleteAppointmentUseCase.execute({
      appointmentId,
      doctorId: request.doctor.id,
    });

    return response.json(appointment);
  }
}

export { DeleteAppointmentController };
