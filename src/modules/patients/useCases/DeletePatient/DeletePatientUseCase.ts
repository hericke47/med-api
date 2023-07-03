import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  doctorId: string;
  patientId: string;
}

@injectable()
class DeletePatientUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {}

  async execute({ doctorId, patientId }: IRequest): Promise<void> {
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

    patient.name = "Removed Name";
    patient.email = "Removed Email";
    patient.phone = "Removed Phone";
    patient.birth_date = new Date();
    patient.weight = 0;
    patient.height = 0;
    patient.active = false;

    await this.patientRepository.save(patient);
  }
}

export { DeletePatientUseCase };
