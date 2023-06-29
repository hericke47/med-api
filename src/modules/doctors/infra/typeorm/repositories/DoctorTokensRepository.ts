import { getRepository, Repository } from "typeorm";

import IDoctorTokensRepository from "@modules/doctors/repositories/models/IDoctorTokensRepository";
import { ICreateDoctorTokenDTO } from "@modules/doctors/dtos/ICreateDoctorTokenDTO";
import { DoctorTokens } from "../entities/DoctorTokens";

class DoctorTokensRepository implements IDoctorTokensRepository {
  private ormRepository: Repository<DoctorTokens>;

  constructor() {
    this.ormRepository = getRepository(DoctorTokens);
  }

  async create({
    expires_date,
    refresh_token,
    doctor_id,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens> {
    const doctorToken = this.ormRepository.create({
      expires_date,
      refresh_token,
      doctor_id,
    });

    await this.ormRepository.save(doctorToken);

    return doctorToken;
  }
}

export default DoctorTokensRepository;
