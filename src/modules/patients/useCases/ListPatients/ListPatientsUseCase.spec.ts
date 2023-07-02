import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Genders";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import { CreatePatientUseCase } from "../CreatePatient/CreatePatientUseCase";
import { ListPatientsUseCase } from "./ListPatientsUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let listPatients: ListPatientsUseCase;

describe("List Patients", () => {
  beforeEach(() => {
    fakeDoctorRepository = new FakeDoctorRepository();
    fakePatientRepository = new FakePatientRepository();
    fakeHashProvider = new FakeHashProvider();

    createDoctor = new CreateDoctorUseCase(
      fakeDoctorRepository,
      fakeHashProvider
    );

    createPatient = new CreatePatientUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );

    listPatients = new ListPatientsUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );
  });

  it("should be able to list patients by doctor", async () => {
    const doctor1: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor1 = await createDoctor.execute(doctor1);

    const doctor2: ICreateDoctorDTO = {
      name: "Doctor john Doe 2",
      email: "doctorjhondoe2@example.com",
      password: "example-password2",
    };

    const createdDoctor2 = await createDoctor.execute(doctor2);

    const firstPatientDoctor1: ICreatePatientDTO = {
      doctorId: createdDoctor1.id,
      birthDate: "09/01/2003",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const secondPatientDoctor1: ICreatePatientDTO = {
      doctorId: createdDoctor1.id,
      birthDate: "12/02/1990",
      email: "patient-example2@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example 2",
      phone: "4888888888",
      weight: 68.8,
    };

    const thirdPatientDoctor2: ICreatePatientDTO = {
      doctorId: createdDoctor2.id,
      birthDate: "12/02/1990",
      email: "patient-example2@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example 2",
      phone: "4888888888",
      weight: 68.8,
    };

    const firstCreatedPatientDoctor1 = await createPatient.execute(
      firstPatientDoctor1
    );
    const secondCreatedPatientDoctor1 = await createPatient.execute(
      secondPatientDoctor1
    );
    await createPatient.execute(thirdPatientDoctor2);

    const patients = await listPatients.execute({
      doctorId: createdDoctor1.id,
    });

    expect(patients).toStrictEqual([
      firstCreatedPatientDoctor1,
      secondCreatedPatientDoctor1,
    ]);
  });

  it("should not be able to list patients if doctor does not exists", async () => {
    await expect(
      listPatients.execute({
        doctorId: "non-existent-doctor-uuid",
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });
});
