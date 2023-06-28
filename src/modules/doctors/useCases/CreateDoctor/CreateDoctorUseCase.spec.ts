import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "./CreateDoctorUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakeHashProvider: FakeHashProvider;
let createDoctor: CreateDoctorUseCase;

describe("CreateDoctor", () => {
  beforeEach(() => {
    fakeDoctorRepository = new FakeDoctorRepository();
    fakeHashProvider = new FakeHashProvider();

    createDoctor = new CreateDoctorUseCase(
      fakeDoctorRepository,
      fakeHashProvider
    );
  });
  it("should be able to create a new doctor", async () => {
    const doctor = await createDoctor.execute({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "123456",
    });

    expect(doctor).toHaveProperty("id");
  });

  it("should not be able to create a new doctor whith email from another", async () => {
    await createDoctor.execute({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "123456",
    });

    await expect(
      createDoctor.execute({
        name: "Doctor john Doe",
        email: "doctorjhondoe@example.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
