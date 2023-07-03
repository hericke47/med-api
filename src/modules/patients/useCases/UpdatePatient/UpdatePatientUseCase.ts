import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";

interface IRequest {
  doctorId: string;
  name: string;
  phone: string;
  email: string;
  birthDate: string;
  genderId: number;
  height: number;
  weight: number;
  patientId: string;
}

@injectable()
class UpdatePatientUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("PatientRepository")
    private patientRepository: IPatientRepository
  ) {}

  async execute({
    birthDate,
    doctorId,
    email,
    genderId,
    height,
    name,
    phone,
    weight,
    patientId,
  }: IRequest): Promise<Patient> {
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

    const alreadyExistentPatientEmailByDoctor =
      await this.patientRepository.findByEmailAndDoctorId(email, doctorId);

    if (alreadyExistentPatientEmailByDoctor) {
      throw new AppError("Email address already used.");
    }

    const alreadyExistentPatientPhoneByDoctor =
      await this.patientRepository.findByPhoneAndDoctorId(phone, doctorId);

    if (alreadyExistentPatientPhoneByDoctor) {
      throw new AppError("Phone number already used.");
    }

    patient.birth_date = new Date(birthDate);
    patient.doctor_id = doctorId;
    patient.email = email;
    patient.gender_id = genderId;
    patient.height = height;
    patient.name = name;
    patient.phone = phone;
    patient.weight = weight;

    const updatedPatient = await this.patientRepository.save(patient);

    return updatedPatient;
  }
}

export { UpdatePatientUseCase };
