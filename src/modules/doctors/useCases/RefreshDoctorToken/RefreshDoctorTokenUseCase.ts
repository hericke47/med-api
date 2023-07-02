import auth from "@config/auth";
import IDoctorTokensRepository from "@modules/doctors/repositories/models/IDoctorTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/models/IDateProvider";
import AppError from "@shared/errors/AppError";
import { sign, verify } from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

interface IPayload {
  sub: string;
  email: string;
}

interface ITokenResponse {
  token: string;
  refreshToken: string;
}

@injectable()
class RefreshDoctorTokenUseCase {
  constructor(
    @inject("DoctorTokensRepository")
    private doctorTokensRepository: IDoctorTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute(refreshTokenRequest: string): Promise<ITokenResponse> {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
      expiresInToken,
      secretToken,
    } = auth;

    const { email, sub } = verify(
      refreshTokenRequest,
      secretRefreshToken
    ) as IPayload;

    const doctorId = sub;

    const doctorToken =
      await this.doctorTokensRepository.findByDoctorIdAndRefreshToken(
        doctorId,
        refreshTokenRequest
      );

    if (!doctorToken) {
      throw new AppError("Refresh Token does not exists!");
    }

    await this.doctorTokensRepository.deleteById(doctorToken.id);

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: sub,
      expiresIn: expiresInRefreshToken,
    });

    const expiresDate = this.dateProvider.addDays(expiresRefreshTokenDays);

    await this.doctorTokensRepository.create({
      expiresDate,
      refreshToken,
      doctorId,
    });

    const newToken = sign({}, secretToken, {
      subject: doctorId,
      expiresIn: expiresInToken,
    });

    return {
      refreshToken,
      token: newToken,
    };
  }
}

export { RefreshDoctorTokenUseCase };
