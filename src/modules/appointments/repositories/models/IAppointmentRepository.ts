import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";

export default interface IAppointmentRepository {
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  getByDateAndDoctorId(
    doctorId: string,
    date: Date
  ): Promise<Appointment | undefined>;
  findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string
  ): Promise<Appointment | undefined>;
}
