import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateAppointmentUseCase } from "./UpdateAppointmentUseCase";

class UpdateAppointmentController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;
    const { date, patientId, appointmentStatusId } = request.body;

    const updateAppointmentUseCase = container.resolve(
      UpdateAppointmentUseCase
    );

    const updatedAppointment = await updateAppointmentUseCase.execute({
      appointmentId,
      date,
      appointmentStatusId,
      doctorId: request.doctor.id,
      patientId,
    });

    return response.json(updatedAppointment);
  }
}

export { UpdateAppointmentController };
