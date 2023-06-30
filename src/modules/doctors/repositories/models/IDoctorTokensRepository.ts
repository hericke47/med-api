import { ICreateDoctorTokenDTO } from "@modules/doctors/dtos/ICreateDoctorTokenDTO";
import { DoctorTokens } from "@modules/doctors/infra/typeorm/entities/DoctorTokens";

interface IDoctorTokensRepository {
  create({
    expiresDate,
    refreshToken,
    doctorId,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens>;

  findByDoctorIdAndRefreshToken(
    doctorId: string,
    refreshToken: string
  ): Promise<DoctorTokens | undefined>;

  deleteById(id: string): Promise<void>;
}

export default IDoctorTokensRepository;
