import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import dayjs from "dayjs";
import { AppointmentStatus } from "@modules/appointments/infra/typeorm/entities/AppointmentStatus";
import IAppointmentRepository from "../models/IAppointmentRepository";

class FakeAppointmentRepository implements IAppointmentRepository {
  appointments: Appointment[] = [];
  private appointmentStatus: AppointmentStatus[] = [
    {
      id: AppointmentStatusEnum.PENDING,
      name: "Pending",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: AppointmentStatusEnum.CONCLUDED,
      name: "Concluded",
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: AppointmentStatusEnum.CANCELED,
      name: "Canceled",
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

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

  async findByDateAndDoctorId(
    doctorId: string,
    date: Date,
    appointmentId?: string
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(
      (appointment) =>
        appointment.doctor_id === doctorId &&
        appointment.date.getTime() ===
          dayjs(date).utc(true).toDate().getTime() &&
        appointment.appointment_status_id === AppointmentStatusEnum.PENDING &&
        appointment.id !== appointmentId
    );

    return appointment;
  }

  async findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string,
    appointmentId?: string
  ): Promise<Appointment | undefined> {
    const appointment = this.appointments.find(
      (appointment) =>
        appointment.doctor_id === doctorId &&
        appointment.date >= new Date(lowestDate) &&
        appointment.date <= new Date(greatestDate) &&
        appointment.id !== appointmentId
    );

    return appointment;
  }

  async save(appointment: Appointment): Promise<Appointment> {
    const findIndex = this.appointments.findIndex(
      (findAppointment) => findAppointment.id === appointment.id
    );

    this.appointments[findIndex] = appointment;

    return appointment;
  }

  async findByIdAndDoctorId(
    id: string,
    doctorId: string
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) =>
        appointment.id === id && appointment.doctor_id === doctorId
    );

    return findAppointment;
  }

  async findAppointmentStatusById(
    id: number
  ): Promise<AppointmentStatus | undefined> {
    const findAppointmentStatus = this.appointmentStatus.find(
      (appointmentStatus) => appointmentStatus.id === id
    );

    return findAppointmentStatus;
  }

  async deleteById(id: string): Promise<void> {
    this.appointments.map((appointment) => {
      if (appointment.id === id) {
        appointment.appointment_status_id = AppointmentStatusEnum.CANCELED;

        return appointment;
      }

      return appointment;
    });
  }

  async findByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Appointment[]> {
    const appointments = this.appointments.filter(
      (appointment) =>
        appointment.doctor_id === doctorId &&
        appointment.patient_id === patientId
    );

    return appointments;
  }
}

export default FakeAppointmentRepository;
