import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Genders";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import { CreatePatientUseCase } from "../CreatePatient/CreatePatientUseCase";
import { GetPatientUseCase } from "./GetPatientUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let getPatient: GetPatientUseCase;

describe("Get Patient", () => {
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

    getPatient = new GetPatientUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );
  });

  it("should be able to get patient by doctor", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const patient: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const createdPatient = await createPatient.execute(patient);

    const searchedPatient = await getPatient.execute({
      doctorId: createdDoctor.id,
      patientId: createdPatient.id,
    });

    expect(searchedPatient.name).toEqual(patient.name);
    expect(searchedPatient.email).toEqual(patient.email);
    expect(searchedPatient.gender_id).toEqual(patient.genderId);
    expect(searchedPatient.height).toEqual(patient.height);
    expect(searchedPatient.weight).toEqual(patient.weight);
    expect(searchedPatient.phone).toEqual(patient.phone);
    expect(searchedPatient.birth_date).toEqual(patient.birthDate);
    expect(searchedPatient.doctor_id).toEqual(patient.doctorId);
    expect(searchedPatient).toHaveProperty("id");
  });

  it("should not be able to get patient if doctor does not exists", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const patient: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const createdPatient = await createPatient.execute(patient);

    await expect(
      getPatient.execute({
        doctorId: "non-existent-doctor-uuid",
        patientId: createdPatient.id,
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });

  it("should not be able to get patient if patient does not exists", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    await expect(
      getPatient.execute({
        doctorId: createdDoctor.id,
        patientId: "non-existent-patient-uuid",
      })
    ).rejects.toEqual(new AppError("Patient not found!"));
  });
});
