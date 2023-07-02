import { v4 as uuidV4 } from "uuid";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import IPatientRepository from "../models/IPatientRepository";

class FakePatientRepository implements IPatientRepository {
  private patients: Patient[] = [];

  async create({
    birthDate,
    doctorId,
    email,
    genderId,
    height,
    name,
    phone,
    weight,
  }: ICreatePatientDTO): Promise<Patient> {
    const patient = new Patient();

    Object.assign(
      patient,
      { id: uuidV4() },
      {
        birth_date: birthDate,
        doctor_id: doctorId,
        email,
        gender_id: genderId,
        height,
        name,
        phone,
        weight,
        active: true,
      }
    );

    this.patients.push(patient);

    return patient;
  }

  async getByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Patient | undefined> {
    const findPatient = this.patients.find(
      (patient) =>
        patient.doctor_id === doctorId &&
        patient.id === patientId &&
        patient.active === true
    );

    return findPatient;
  }
}

export default FakePatientRepository;
