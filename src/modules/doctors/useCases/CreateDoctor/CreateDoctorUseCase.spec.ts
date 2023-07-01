import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import { CreateDoctorUseCase } from "./CreateDoctorUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakeHashProvider: FakeHashProvider;
let createDoctor: CreateDoctorUseCase;

describe("Create Doctor", () => {
  beforeEach(() => {
    fakeDoctorRepository = new FakeDoctorRepository();
    fakeHashProvider = new FakeHashProvider();

    createDoctor = new CreateDoctorUseCase(
      fakeDoctorRepository,
      fakeHashProvider
    );
  });
  it("should be able to create a new doctor", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    expect(createdDoctor.name).toEqual(doctor.name);
    expect(createdDoctor.email).toEqual(doctor.email);
    expect(createdDoctor).toHaveProperty("id");
  });

  it("should not be able to create a new doctor whith email from another", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const anotherDoctorWithSameEmail = {
      name: "Another Doctor",
      email: "doctorjhondoe@example.com",
      password: "another-example-password",
    };

    await createDoctor.execute(doctor);

    await expect(
      createDoctor.execute(anotherDoctorWithSameEmail)
    ).rejects.toEqual(new AppError("Email address already used."));
  });
});
