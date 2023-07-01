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
  refreshToken: string;
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
      expiresInToken,
      secretRefreshToken,
      secretToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
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

    const token = sign({}, secretToken, {
      subject: doctor.id,
      expiresIn: expiresInToken,
    });

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: doctor.id,
      expiresIn: expiresInRefreshToken,
    });

    const refreshTokenExpiresDate = this.dateProvider.addDays(
      expiresRefreshTokenDays
    );

    await this.doctorTokensRepository.create({
      doctorId: doctor.id,
      refreshToken,
      expiresDate: refreshTokenExpiresDate,
    });

    const tokenReturn: IResponse = {
      doctor: {
        name: doctor.name,
        email: doctor.email,
      },
      token,
      refreshToken,
    };

    return tokenReturn;
  }
}

export { AuthenticateDoctorUseCase };
