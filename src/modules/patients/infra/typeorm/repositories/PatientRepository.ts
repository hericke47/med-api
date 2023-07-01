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

    await this.ormRepository.save({
      ...patient,
      active: true,
    });

    return patient;
  }
}

export default PatientRepository;
