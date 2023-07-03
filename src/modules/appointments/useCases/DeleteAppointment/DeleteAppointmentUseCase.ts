import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  appointmentId: string;
  doctorId: string;
}

@injectable()
class DeleteAppointmentUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({ doctorId, appointmentId }: IRequest): Promise<void> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found!");
    }

    const appointment = await this.appointmentRepository.findByIdAndDoctorId(
      appointmentId,
      doctor.id
    );

    if (!appointment) {
      throw new AppError("Appointment does not exists!");
    }

    await this.appointmentRepository.deleteById(appointment.id);
  }
}

export { DeleteAppointmentUseCase };
