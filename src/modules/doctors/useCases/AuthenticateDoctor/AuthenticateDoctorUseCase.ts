import auth from "@config/auth";
import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import IDoctorTokensRepository from "@modules/doctors/repositories/models/IDoctorTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import IHashProvider from "@shared/container/providers/HashProvider/models/IHashProvider";
import AppError from "@shared/errors/AppError";
import { sign } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  doctor: {
    name: string;
    email: string;
  };
  token: string;
  refresh_token: string;
}

@injectable()
class AuthenticateDoctorUseCase {
  constructor(
    @inject("DoctorRepository")
    private doctorRepository: IDoctorRepository,

    @inject("DoctorTokensRepository")
    private doctorTokensRepository: IDoctorTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const doctor = await this.doctorRepository.findByEmail(email);

    const {
      expires_in_token,
      secret_refresh_token,
      secret_token,
      expires_in_refresh_token,
      expires_refresh_token_days,
    } = auth;

    if (!doctor) {
      throw new AppError("Email or password incorrect!");
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      doctor.password
    );

    if (!passwordMatch) {
      throw new AppError("Email or password incorrect!");
    }

    const token = sign({}, secret_token, {
      subject: doctor.id,
      expiresIn: expires_in_token,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: doctor.id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days
    );

    await this.doctorTokensRepository.create({
      doctor_id: doctor.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    const tokenReturn: IResponse = {
      doctor: {
        name: doctor.name,
        email: doctor.email,
      },
      token,
      refresh_token,
    };

    return tokenReturn;
  }
}

export { AuthenticateDoctorUseCase };
