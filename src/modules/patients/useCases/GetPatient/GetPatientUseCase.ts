import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  doctorId: string;
  patientId: string;
}

@injectable()
class GetPatientUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {}

  async execute({ doctorId, patientId }: IRequest): Promise<Patient> {
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

    return patient;
  }
}

export { GetPatientUseCase };
