import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  notes: string;
  doctorId: string;
  appointmentId: string;
}

@injectable()
class UpdateAppointmentNotesUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository
  ) {}

  async execute({
    appointmentId,
    doctorId,
    notes,
  }: IRequest): Promise<Appointment> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found!");
    }

    const appointment = await this.appointmentRepository.findByIdAndDoctorId(
      appointmentId,
      doctor.id
    );

    if (!appointment) {
      throw new AppError("Appointment not found!");
    }

    appointment.notes = notes;

    await this.appointmentRepository.save(appointment);

    return appointment;
  }
}

export { UpdateAppointmentNotesUseCase };
