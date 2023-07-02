import { getRepository, Repository } from "typeorm";

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
      active: true,
    });
  }

  async getByDateAndDoctorId(
    doctorId: string,
    date: Date
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: { doctor_id: doctorId, active: true, date },
    });

    return appointment;
  }

  async findByIntervalAndDoctorId(
    doctorId: string,
    lowestDate: string,
    greatestDate: string
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
      .andWhere("appointment.active = true")
      .andWhere("appointment.appointment_status_id = :appointmentStatusId", {
        appointmentStatusId: AppointmentStatusEnum.PENDING,
      })
      .getOne();

    return appointment;
  }
}

export default AppointmentRepository;
