import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import { Gender } from "@modules/patients/infra/typeorm/entities/Gender";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";

export default interface IPatientRepository {
  create(data: ICreatePatientDTO): Promise<Patient>;
  findByDoctorIdAndPatientId(
    doctorId: string,
    patientId: string
  ): Promise<Patient | undefined>;
  listPatientsByDoctorId(doctorId: string): Promise<Patient[]>;
  findByEmailAndDoctorId(
    email: string,
    doctorId: string
  ): Promise<Patient | undefined>;
  findByPhoneAndDoctorId(
    phone: string,
    doctorId: string
  ): Promise<Patient | undefined>;
  save(patient: Patient): Promise<Patient>;
  findGenderById(id: number): Promise<Gender | undefined>;
}
