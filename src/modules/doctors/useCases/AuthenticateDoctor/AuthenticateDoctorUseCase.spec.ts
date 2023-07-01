import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import FakeDoctorTokensRepository from "@modules/doctors/repositories/fakes/FakeDoctorTokensRepository";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import { AuthenticateDoctorUseCase } from "./AuthenticateDoctorUseCase";
import { CreateDoctorUseCase } from "../CreateDoctor/CreateDoctorUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakeHashProvider: FakeHashProvider;
let fakeDoctorTokenRepository: FakeDoctorTokensRepository;
let dateProvider: DayjsDateProvider;
let authenticateDoctor: AuthenticateDoctorUseCase;
let createDoctor: CreateDoctorUseCase;

describe("Authenticate Doctor", () => {
  beforeEach(() => {
    fakeDoctorRepository = new FakeDoctorRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeDoctorTokenRepository = new FakeDoctorTokensRepository();
    dateProvider = new DayjsDateProvider();

    authenticateDoctor = new AuthenticateDoctorUseCase(
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

  it("should be able to authenticate", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const auth = await authenticateDoctor.execute({
      email: createdDoctor.email,
      password: createdDoctor.password,
    });

    expect(auth).toHaveProperty("token");
    expect(auth).toHaveProperty("refreshToken");
    expect(auth.doctor.name).toEqual(doctor.name);
    expect(auth.doctor.email).toEqual(doctor.email);
  });

  it("should not be able to authenticate if doctor does not exists", async () => {
    await expect(
      authenticateDoctor.execute({
        email: "non-existent-doctor-email@example.com",
        password: "example-password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect!"));
  });

  it("should not be able to authenticate doctor with incorrect password", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    await expect(
      authenticateDoctor.execute({
        email: createdDoctor.email,
        password: "incorrect-password",
      })
    ).rejects.toEqual(new AppError("Email or password incorrect!"));
  });
});
