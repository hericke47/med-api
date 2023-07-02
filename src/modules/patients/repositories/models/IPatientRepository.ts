import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";

export default interface IPatientRepository {
  create(data: ICreatePatientDTO): Promise<Patient>;
  getByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Patient | undefined>;
  listPatientsByDoctorId(doctorId: string): Promise<Patient[]>;
  getByEmailAndDoctorId(
    email: string,
    doctorId: string
  ): Promise<Patient | undefined>;
  getByPhoneAndDoctorId(
    phone: string,
    doctorId: string
  ): Promise<Patient | undefined>;
  save(patient: Patient): Promise<Patient>;
}
