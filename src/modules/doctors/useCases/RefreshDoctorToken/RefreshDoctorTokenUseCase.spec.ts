import FakeDoctorTokensRepository from "@modules/doctors/repositories/fakes/FakeDoctorTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import { sign } from "jsonwebtoken";
import auth from "@config/auth";
import AppError from "@shared/errors/AppError";
import { RefreshDoctorTokenUseCase } from "./RefreshDoctorTokenUseCase";
import { AuthenticateDoctorUseCase } from "../AuthenticateDoctor/AuthenticateDoctorUseCase";
import { CreateDoctorUseCase } from "../CreateDoctor/CreateDoctorUseCase";

let refreshDoctorTokenUseCase: RefreshDoctorTokenUseCase;
let fakeDoctorRepository: FakeDoctorRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateDoctorUseCase: AuthenticateDoctorUseCase;
let createDoctor: CreateDoctorUseCase;
let fakeDoctorTokenRepository: FakeDoctorTokensRepository;
let dateProvider: DayjsDateProvider;

describe("Refresh Doctor Token", () => {
  beforeEach(() => {
    fakeDoctorTokenRepository = new FakeDoctorTokensRepository();
    dateProvider = new DayjsDateProvider();
    fakeDoctorRepository = new FakeDoctorRepository();
    fakeHashProvider = new FakeHashProvider();

    refreshDoctorTokenUseCase = new RefreshDoctorTokenUseCase(
      fakeDoctorTokenRepository,
      dateProvider
    );

    authenticateDoctorUseCase = new AuthenticateDoctorUseCase(
      fakeDoctorRepository,
      fakeDoctorTokenRepository,
      fakeHashProvider,
      dateProvider
    );

    createDoctor = new CreateDoctorUseCase(
      fakeDoctorRepository,
      fakeHashProvider
    );
  });

  it("should be able to generate a new token and delete old refresh token", async () => {
    const deleteOldRefreshToken = jest.spyOn(
      fakeDoctorTokenRepository,
      "deleteById"
    );

    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const auth = await authenticateDoctorUseCase.execute({
      email: createdDoctor.email,
      password: createdDoctor.password,
    });

    const doctorToken =
      await fakeDoctorTokenRepository.findByDoctorIdAndRefreshToken(
        createdDoctor.id,
        auth.refreshToken
      );

    const refreshToken = await refreshDoctorTokenUseCase.execute(
      auth.refreshToken
    );

    expect(refreshToken).toHaveProperty("token");
    expect(refreshToken).toHaveProperty("refreshToken");
    expect(deleteOldRefreshToken).toHaveBeenCalledWith(doctorToken?.id);
  });

  it("should not be able to generate a new token for a non existent doctor", async () => {
    const refreshTokenForANonExistentUse = sign(
      { email: "false@example.com" },
      auth.secretRefreshToken
    );

    await expect(
      refreshDoctorTokenUseCase.execute(refreshTokenForANonExistentUse)
    ).rejects.toEqual(new AppError("Refresh Token does not exists!"));
  });
});
