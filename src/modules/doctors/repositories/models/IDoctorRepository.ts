import { Doctor } from "@modules/doctors/infra/typeorm/entities/Doctor";

import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";

export default interface IDoctorRepository {
  create(data: ICreateDoctorDTO): Promise<Doctor>;
  save(user: Doctor): Promise<Doctor>;
  findByEmail(email: string): Promise<Doctor | undefined>;
}
