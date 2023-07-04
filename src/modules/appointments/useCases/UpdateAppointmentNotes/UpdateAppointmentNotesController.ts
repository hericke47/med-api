import { Request, Response } from "express";
import { container } from "tsyringe";

import { UpdateAppointmentNotesUseCase } from "./UpdateAppointmentNotesUseCase";

class UpdateAppointmentNotesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { appointmentId } = request.params;
    const { notes } = request.body;

    const updateAppointmentNotesUseCase = container.resolve(
      UpdateAppointmentNotesUseCase
    );

    const updatedAppointment = await updateAppointmentNotesUseCase.execute({
      appointmentId,
      notes,
      doctorId: request.doctor.id,
    });

    return response.json(updatedAppointment);
  }
}

export { UpdateAppointmentNotesController };
