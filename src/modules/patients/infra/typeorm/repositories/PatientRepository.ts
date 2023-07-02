import { getRepository, Repository } from "typeorm";

import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import { Patient } from "../entities/Patient";

class PatientRepository implements IPatientRepository {
  private ormRepository: Repository<Patient>;

  constructor() {
    this.ormRepository = getRepository(Patient);
  }

  public async create({
    birthDate,
    doctorId,
    email,
    genderId,
    height,
    name,
    phone,
    weight,
  }: ICreatePatientDTO): Promise<Patient> {
    const patient = this.ormRepository.create({
      birth_date: birthDate,
      doctor_id: doctorId,
      email,
      gender_id: genderId,
      height,
      name,
      phone,
      weight,
    });

    return this.ormRepository.save({
      ...patient,
      active: true,
    });
  }

  async getByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Patient | undefined> {
    const patient = await this.ormRepository.findOne({
      where: { id: patientId, doctor_id: doctorId, active: true },
    });

    return patient;
  }

  async listPatientsByDoctorId(doctorId: string): Promise<Patient[]> {
    const patients = await this.ormRepository.find({
      where: { doctor_id: doctorId, active: true },
    });

    return patients;
  }
}

export default PatientRepository;
