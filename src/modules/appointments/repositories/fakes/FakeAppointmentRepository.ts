import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import dayjs from "dayjs";
import IAppointmentRepository from "../models/IAppointmentRepository";

class FakeAppointmentRepository implements IAppointmentRepository {
  private appointments: Appointment[] = [];

  async create({
    appointmentStatusId,
    date,
    doctorId,
    patientId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, {
      doctor_id: doctorId,
      patient_id: patientId,
      date: dayjs(date).utc(true).toDate(),
      appointment_status_id: appointmentStatusId,
      active: true,
    });

    this.appointments.push(appointment);

    return appointment;
  }

  async getByDateAndDoctorId(
    doctorId: string,
    date: Date
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(
      (appointment) =>
        appointment.active === true &&
        appointment.doctor_id === doctorId &&
        appointment.date.getTime() ===
          dayjs(date).utc(true).toDate().getTime() &&
        appointment.appointment_status_id === AppointmentStatusEnum.PENDING
    );

    return appointment;
  }

  async findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(
      (appointment) =>
        appointment.doctor_id === doctorId &&
        appointment.date >= new Date(lowestDate) &&
        appointment.date <= new Date(greatestDate)
    );

    return appointment;
  }
}

export default FakeAppointmentRepository;
