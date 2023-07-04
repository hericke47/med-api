import { getRepository, Not, Repository } from "typeorm";

import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import { Appointment } from "../entities/Appointment";
import { AppointmentStatus } from "../entities/AppointmentStatus";

class AppointmentRepository implements IAppointmentRepository {
  private ormAppointmentRepository: Repository<Appointment>;
  private ormAppointmentStatusRepository: Repository<AppointmentStatus>;

  constructor() {
    this.ormAppointmentRepository = getRepository(Appointment);
    this.ormAppointmentStatusRepository = getRepository(AppointmentStatus);
  }

  create({
    appointmentStatusId,
    date,
    doctorId,
    patientId,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormAppointmentRepository.create({
      appointment_status_id: appointmentStatusId,
      date,
      doctor_id: doctorId,
      patient_id: patientId,
    });

    return this.ormAppointmentRepository.save({
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

    const appointment = await this.ormAppointmentRepository.findOne({
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
    const appointment = await this.ormAppointmentRepository
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
    return this.ormAppointmentRepository.save(appointment);
  }

  async findByIdAndDoctorId(
    id: string,
    doctorId: string
  ): Promise<Appointment | undefined> {
    const appointment = await this.ormAppointmentRepository.findOne({
      where: {
        id,
        doctor_id: doctorId,
      },
    });

    return appointment;
  }

  async findAppointmentStatusById(
    id: number
  ): Promise<AppointmentStatus | undefined> {
    const appointmentStatus = await this.ormAppointmentStatusRepository.findOne(
      {
        where: {
          id,
        },
      }
    );

    return appointmentStatus;
  }

  async deleteById(id: string): Promise<void> {
    this.ormAppointmentRepository.update(
      { id },
      { appointment_status_id: AppointmentStatusEnum.CANCELED }
    );
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.ormAppointmentRepository.find({
      select: ["id", "date", "notes"],
      where: {
        doctor_id: doctorId,
      },
    });

    return appointments;
  }
}

export default AppointmentRepository;
