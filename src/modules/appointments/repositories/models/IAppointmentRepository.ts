import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentStatus } from "@modules/appointments/infra/typeorm/entities/AppointmentStatus";

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  findByDateAndDoctorId(
    doctorId: string,
    date: Date,
    appointmentId?: string
  ): Promise<Appointment | undefined>;
  findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string,
    appointmentId?: string
  ): Promise<Appointment | undefined>;
  save(appointment: Appointment): Promise<Appointment>;
  findByIdAndDoctorId(
    id: string,
    doctorId: string
  ): Promise<Appointment | undefined>;
  findAppointmentStatusById(id: number): Promise<AppointmentStatus | undefined>;
}
