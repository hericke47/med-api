import { ICreateDoctorTokenDTO } from "@modules/doctors/dtos/ICreateDoctorTokenDTO";
import { DoctorTokens } from "@modules/doctors/infra/typeorm/entities/DoctorTokens";

interface IDoctorTokensRepository {
  create({
    expires_date,
    refresh_token,
    doctor_id,
  }: ICreateDoctorTokenDTO): Promise<DoctorTokens>;
}

export default IDoctorTokensRepository;
