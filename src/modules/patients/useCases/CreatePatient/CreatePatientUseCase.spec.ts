import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Genders";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import { CreatePatientUseCase } from "./CreatePatientUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;

describe("Create Patient", () => {
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
  });
  it("should be able to create a new patient", async () => {
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

    expect(createdPatient.name).toEqual(patient.name);
    expect(createdPatient.email).toEqual(patient.email);
    expect(createdPatient.gender_id).toEqual(patient.genderId);
    expect(createdPatient.height).toEqual(patient.height);
    expect(createdPatient.weight).toEqual(patient.weight);
    expect(createdPatient.phone).toEqual(patient.phone);
    expect(createdPatient.birth_date).toEqual(patient.birthDate);
    expect(createdPatient.doctor_id).toEqual(patient.doctorId);
    expect(createdPatient).toHaveProperty("id");
  });

  it("should not be able to create a new patient if doctor does not exists", async () => {
    const patient: ICreatePatientDTO = {
      doctorId: "non-existent-doctor-uuid",
      birthDate: "09/01/2003",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    await expect(createPatient.execute(patient)).rejects.toEqual(
      new AppError("Doctor not found!")
    );
  });

  it("should not be able to create a new patient if email address is already in use", async () => {
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

    const patientWithSameEmail: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 171,
      name: "Patient Example",
      phone: "48777777777",
      weight: 80,
    };

    await createPatient.execute(patient);

    await expect(createPatient.execute(patientWithSameEmail)).rejects.toEqual(
      new AppError("Email address already used.")
    );
  });

  it("should not be able to create a new patient if email address is already in use", async () => {
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

    const patientWithSamePhoneNumber: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "another-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 171,
      name: "Patient Example",
      phone: "48999999999",
      weight: 80,
    };

    await createPatient.execute(patient);

    await expect(
      createPatient.execute(patientWithSamePhoneNumber)
    ).rejects.toEqual(new AppError("Phone number already used."));
  });
});
