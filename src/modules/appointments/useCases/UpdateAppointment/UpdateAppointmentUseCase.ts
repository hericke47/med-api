import { Appointment } from "@modules/appointments/infra/typeorm/entities/Appointment";
import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";
import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import appointmentConfig from "@config/appointment";

interface IRequest {
  date: Date;
  patientId: string;
  doctorId: string;
  appointmentId: string;
  appointmentStatusId: number;
}

@injectable()
class UpdateAppointmentUseCase {
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

  async execute({
    doctorId,
    date,
    patientId,
    appointmentId,
    appointmentStatusId,
  }: IRequest): Promise<Appointment> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found!");
    }

    const patient = await this.patientRepository.findByDoctorIdAndPatientId(
      doctorId,
      patientId
    );

    if (!patient) {
      throw new AppError("Patient not found!");
    }

    const appointment = await this.appointmentRepository.findByIdAndDoctorId(
      appointmentId,
      doctor.id
    );

    if (!appointment) {
      throw new AppError("Appointment does not exists!");
    }

    if (this.dateProvider.compareIfBefore(new Date(date), new Date())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    const alreadyExistentAppointmentOnThisDate =
      await this.appointmentRepository.findByDateAndDoctorId(
        doctorId,
        date,
        appointmentId
      );

    if (alreadyExistentAppointmentOnThisDate) {
      throw new AppError("Already exists an appointment on this date");
    }

    const { appointmentDuration } = appointmentConfig;

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
        greatestDate,
        appointmentId
      );

    if (appointmentAtTheSameTime) {
      throw new AppError(
        "There is already an appointment in the range of this appointment"
      );
    }

    appointment.appointment_status_id = appointmentStatusId;
    appointment.patient_id = patientId;
    appointment.date = date;

    const updatedAppointment = await this.appointmentRepository.save(
      appointment
    );

    return updatedAppointment;
  }
}

export { UpdateAppointmentUseCase };
