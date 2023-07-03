import { getRepository, Not, Repository } from "typeorm";

import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import { Appointment } from "../entities/Appointment";

class AppointmentRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  create({
    appointmentStatusId,
    date,
    doctorId,
    patientId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      appointment_status_id: appointmentStatusId,
      date,
      doctor_id: doctorId,
      patient_id: patientId,
    });

    return this.ormRepository.save({
      ...appointment,
    });
  }

  async findByDateAndDoctorId(
    doctorId: string,
    date: Date,
    appointmentId?: string
  ): Promise<Appointment | undefined> {
    const where = {
      doctor_id: doctorId,
      date,
      appointment_status_id: AppointmentStatusEnum.PENDING,
    };

    if (appointmentId) {
      Object.assign(where, { id: Not(appointmentId) });
    }

    const appointment = await this.ormRepository.findOne({
      where,
    });

    return appointment;
  }

  async findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string,
    appointmentId?: string
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository
      .createQueryBuilder("appointment")
      .where("appointment.date BETWEEN :lowestDate AND :greatestDate", {
        lowestDate,
        greatestDate,
      })
      .andWhere("appointment.doctor_id = :doctorId", {
        doctorId,
      })
      .andWhere("appointment.appointment_status_id = :appointmentStatusId", {
        appointmentStatusId: AppointmentStatusEnum.PENDING,
      });

    if (appointmentId) {
      appointment.andWhere("appointment.id != :appointmentId", {
        appointmentId,
      });
    }

    return appointment.getOne();
  }

  public async save(appointment: Appointment): Promise<Appointment> {
    return this.ormRepository.save(appointment);
  }

  async findByIdAndDoctorId(
    id: string,
    doctorId: string
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: {
        id,
        doctor_id: doctorId,
      },
    });

    return appointment;
  }
}

export default AppointmentRepository;
