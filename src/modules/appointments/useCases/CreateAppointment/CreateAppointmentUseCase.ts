import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  date: Date;
  patientId: string;
  doctorId: string;
}

@injectable()
class CreateAppointmentUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("AppointmentRepository")
    private appointmentRepository: IAppointmentRepository,

    @inject("PatientRepository")
    private patientRepository: IPatientRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ doctorId, date, patientId }: IRequest): Promise<Appointment> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found!");
    }

    const patient = await this.patientRepository.getByDoctorIdAndPatientId(
      doctorId,
      patientId
    );

    if (!patient) {
      throw new AppError("Patient not found!");
    }

    if (this.dateProvider.compareIfBefore(new Date(date), new Date())) {
      throw new AppError("You can't create an appointemnt on a past date.");
    }

    const alreadyExistentAppointmentOnThisDate =
      await this.appointmentRepository.getByDateAndDoctorId(doctorId, date);

    if (alreadyExistentAppointmentOnThisDate) {
      throw new AppError("Already exists an appointment on this date");
    }

    const appointmentDuration = 60; // in minutes

    const lowestDate = this.dateProvider
      .subtractMinutes(date, appointmentDuration)
      .toISOString();

    const greatestDate = this.dateProvider
      .addMinutes(date, appointmentDuration)
      .toISOString();

    const appointmentAtTheSameTime =
      await this.appointmentRepository.findByIntervalAndDoctorId(
        doctor.id,
        lowestDate,
        greatestDate
      );

    if (appointmentAtTheSameTime) {
      throw new AppError(
        "There is already an appointment in the range of this appointment"
      );
    }

    const createdAppointment = await this.appointmentRepository.create({
      appointmentStatusId: AppointmentStatusEnum.PENDING,
      date,
      doctorId,
      patientId,
    });

    return createdAppointment;
  }
}

export { CreateAppointmentUseCase };
