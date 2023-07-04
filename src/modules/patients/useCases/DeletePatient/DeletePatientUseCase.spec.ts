import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Gender";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import { Doctor } from "@modules/doctors/infra/typeorm/entities/Doctor";
import { Patient } from "@modules/patients/infra/typeorm/entities/Patient";
import { CreatePatientUseCase } from "../CreatePatient/CreatePatientUseCase";
import { DeletePatientUseCase } from "./DeletePatientUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let deletePatient: DeletePatientUseCase;
let createdDoctor: Doctor;
let createdPatient: Patient;

describe("Delete Patient", () => {
  beforeEach(async () => {
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

    deletePatient = new DeletePatientUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );

    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    createdDoctor = await createDoctor.execute(doctor);

    const patient: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    createdPatient = await createPatient.execute(patient);
  });

  it("should be able to delete patient", async () => {
    await expect(
      deletePatient.execute({
        doctorId: createdDoctor.id,
        patientId: createdPatient.id,
      })
    ).not.toBeInstanceOf(AppError);
  });

  it("should not be able to delete patient if doctor does not exists", async () => {
    await expect(
      deletePatient.execute({
        doctorId: "non-existent-doctor-id",
        patientId: createdPatient.id,
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });

  it("should not be able to delete patient if patient does not exists", async () => {
    await expect(
      deletePatient.execute({
        doctorId: createdDoctor.id,
        patientId: "non-existent-patient-id",
      })
    ).rejects.toEqual(new AppError("Patient not found!"));
  });
});
