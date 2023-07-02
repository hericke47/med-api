import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  doctorId: string;
}

@injectable()
class ListPatientsUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {}

  async execute({ doctorId }: IRequest): Promise<Patient[]> {
    const doctor = await this.doctorRepository.findById(doctorId);

    if (!doctor) {
      throw new AppError("Doctor not found!");
    }

    const patients = await this.patientRepository.listPatientsByDoctorId(
      doctorId
    );

    return patients;
  }
}

export { ListPatientsUseCase };
