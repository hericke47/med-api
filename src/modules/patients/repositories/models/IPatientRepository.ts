import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";

export default interface IPatientRepository {
  create(data: ICreatePatientDTO): Promise<Patient>;
}
