import { getRepository, Repository } from "typeorm";

import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import { Patient } from "../entities/Patient";
import { Gender } from "../entities/Gender";

class PatientRepository implements IPatientRepository {
  private ormPatientRepository: Repository<Patient>;
  private ormGenderRepository: Repository<Gender>;

  constructor() {
    this.ormPatientRepository = getRepository(Patient);
    this.ormGenderRepository = getRepository(Gender);
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
    const patient = this.ormPatientRepository.create({
      birth_date: birthDate,
      doctor_id: doctorId,
      email,
      gender_id: genderId,
      height,
      name,
      phone,
      weight,
    });

    return this.ormPatientRepository.save({
      ...patient,
      active: true,
    });
  }

  async findByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Patient | undefined> {
    const patient = await this.ormPatientRepository.findOne({
      where: { id: patientId, doctor_id: doctorId, active: true },
    });

    return patient;
  }

  async listPatientsByDoctorId(doctorId: string): Promise<Patient[]> {
    const patients = await this.ormPatientRepository.find({
      where: { doctor_id: doctorId, active: true },
    });

    return patients;
  }

  async findByEmailAndDoctorId(
    email: string,
    doctorId: string
  ): Promise<Patient | undefined> {
    const patient = await this.ormPatientRepository.findOne({
      where: { email, doctor_id: doctorId, active: true },
    });

    return patient;
  }

  async findByPhoneAndDoctorId(
    phone: string,
    doctorId: string
  ): Promise<Patient | undefined> {
    const patient = await this.ormPatientRepository.findOne({
      where: { phone, doctor_id: doctorId, active: true },
    });

    return patient;
  }

  public async save(patient: Patient): Promise<Patient> {
    return this.ormPatientRepository.save(patient);
  }

  async findGenderById(id: number): Promise<Gender | undefined> {
    const gender = await this.ormGenderRepository.findOne({
      where: { id },
    });

    return gender;
  }
}

export default PatientRepository;
