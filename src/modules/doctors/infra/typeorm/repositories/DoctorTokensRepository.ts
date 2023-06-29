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
    expiresDate,
    refreshToken,
    doctorId,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens> {
    const doctorToken = this.ormRepository.create({
      expires_date: expiresDate,
      refresh_token: refreshToken,
      doctor_id: doctorId,
    });

    await this.ormRepository.save(doctorToken);

    return doctorToken;
  }

  async findByDoctorIdAndRefreshToken(
    doctorId: string,
    refreshToken: string
  ): Promise<DoctorTokens | undefined> {
    const doctorTokens = await this.ormRepository.findOne({
      doctor_id: doctorId,
      refresh_token: refreshToken,
    });

    return doctorTokens;
  }

  async deleteById(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default DoctorTokensRepository;
