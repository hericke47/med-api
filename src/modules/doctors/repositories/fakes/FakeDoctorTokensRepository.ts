import { v4 as uuidV4 } from "uuid";

import { ICreateDoctorTokenDTO } from "@modules/doctors/dtos/ICreateDoctorTokenDTO";
import { DoctorTokens } from "@modules/doctors/infra/typeorm/entities/DoctorTokens";
import IDoctorTokensRepository from "../models/IDoctorTokensRepository";

class FakeDoctorTokensRepository implements IDoctorTokensRepository {
  private doctorTokens: DoctorTokens[] = [];

  public async create({
    expiresDate,
    refreshToken,
    doctorId,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens> {
    const doctorToken = new DoctorTokens();

    Object.assign(doctorToken, {
      id: uuidV4(),
      doctor_id: doctorId,
      expires_date: expiresDate,
      refresh_token: refreshToken,
    });

    this.doctorTokens.push(doctorToken);

    return doctorToken;
  }

  async findByDoctorIdAndRefreshToken(
    doctorId: string,
    refreshToken: string
  ): Promise<DoctorTokens | undefined> {
    const doctorTokens = this.doctorTokens.find(
      (doctorToken) =>
        doctorToken.doctor_id === doctorId &&
        doctorToken.refresh_token === refreshToken
    );

    return doctorTokens;
  }

  async deleteById(id: string): Promise<void> {
    const findedIndex = this.doctorTokens.findIndex(
      (doctorToken) => doctorToken.id === id
    );

    this.doctorTokens.splice(findedIndex, 1);
  }
}

export default FakeDoctorTokensRepository;
