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

  async findByDoctorIdAndPatientId(
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

  async listPatientsByDoctorId(doctorId: string): Promise<Patient[]> {
    return this.patients.filter(
      (patient) => patient.doctor_id === doctorId && patient.active === true
    );
  }

  async findByEmailAndDoctorId(
    email: string,
    doctorId: string
  ): Promise<Patient | undefined> {
    const findPatient = this.patients.find(
      (patient) =>
        patient.doctor_id === doctorId &&
        patient.email === email &&
        patient.active === true
    );

    return findPatient;
  }
  async findByPhoneAndDoctorId(
    phone: string,
    doctorId: string
  ): Promise<Patient | undefined> {
    const findPatient = this.patients.find(
      (patient) =>
        patient.doctor_id === doctorId &&
        patient.phone === phone &&
        patient.active === true
    );

    return findPatient;
  }

  async save(patient: Patient): Promise<Patient> {
    const findIndex = this.patients.findIndex(
      (findPatient) => findPatient.id === patient.id
    );

    this.patients[findIndex] = patient;

    return patient;
  }
}

export default FakePatientRepository;
