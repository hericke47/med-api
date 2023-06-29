import { v4 as uuidV4 } from "uuid";

import { ICreateDoctorTokenDTO } from "@modules/doctors/dtos/ICreateDoctorTokenDTO";
import { DoctorTokens } from "@modules/doctors/infra/typeorm/entities/DoctorTokens";
import IDoctorTokensRepository from "../models/IDoctorTokensRepository";

class FakeDoctorTokensRepository implements IDoctorTokensRepository {
  private doctorTokens: DoctorTokens[] = [];

  public async create({
    expires_date,
    refresh_token,
    doctor_id,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens> {
    const doctorToken = new DoctorTokens();

    Object.assign(doctorToken, {
      id: uuidV4(),
      doctor_id,
      expires_date,
      refresh_token,
    });

    this.doctorTokens.push(doctorToken);

    return doctorToken;
  }
}

export default FakeDoctorTokensRepository;
