import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import ICreatePatientDTO from "@modules/patients/dtos/ICreatePatientDTO";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Gender";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";

import { CreatePatientUseCase } from "../CreatePatient/CreatePatientUseCase";
import { UpdatePatientUseCase } from "./UpdatePatientUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let updatePatient: UpdatePatientUseCase;

describe("Update Patient", () => {
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

    updatePatient = new UpdatePatientUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );
  });
  it("should be able to update a patient", async () => {
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

    const updatedPatient = await updatePatient.execute({
      doctorId: createdDoctor.id,
      patientId: createdPatient.id,
      birthDate: "2010-10-10",
      email: "updated-email@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 180,
      name: "Updated Name",
      phone: "4822222222",
      weight: 88.2,
    });

    const findedUpdatedPatient =
      await fakePatientRepository.findByDoctorIdAndPatientId(
        createdDoctor.id,
        createdPatient.id
      );

    expect(updatedPatient).toEqual(findedUpdatedPatient);
  });

  it("should not be able to update a patient if gender does not exists", async () => {
    const nonExistentGender = NaN;

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
      updatePatient.execute({
        doctorId: createdDoctor.id,
        patientId: createdPatient.id,
        birthDate: "2010-10-10",
        email: "updated-email@gmail.com",
        genderId: nonExistentGender,
        height: 180,
        name: "Updated Name",
        phone: "4822222222",
        weight: 88.2,
      })
    ).rejects.toEqual(new AppError("Gender not found!"));
  });

  it("should not be able to update patient if doctor does not exists", async () => {
    await expect(
      updatePatient.execute({
        doctorId: "non-existent-doctor-id",
        patientId: "patientId",
        birthDate: "09/01/2003",
        email: "patient-example@gmail.com",
        genderId: GendersEnum.FEMININE,
        height: 170,
        name: "Patient Example",
        phone: "48999999999",
        weight: 68.8,
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });

  it("should not be able to update patient if patient does not exists", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    await expect(
      updatePatient.execute({
        doctorId: createdDoctor.id,
        patientId: "non-existent-patient-id",
        birthDate: "09/01/2003",
        email: "patient-example@gmail.com",
        genderId: GendersEnum.FEMININE,
        height: 170,
        name: "Patient Example",
        phone: "48999999999",
        weight: 68.8,
      })
    ).rejects.toEqual(new AppError("Patient not found!"));
  });

  it("should not be able to update patient if email address is already in use", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const patient: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "already-in-use-email@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const createdPatient = await createPatient.execute(patient);

    const updatePatientWithSameEmail = {
      doctorId: createdDoctor.id,
      patientId: createdPatient.id,
      birthDate: "2010-10-10",
      email: "already-in-use-email@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 180,
      name: "Updated Name",
      phone: "48333333333",
      weight: 88.2,
    };

    await expect(
      updatePatient.execute(updatePatientWithSameEmail)
    ).rejects.toEqual(new AppError("Email address already used."));
  });

  it("should not be able to update patient if phone number is already in use", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const createdDoctor = await createDoctor.execute(doctor);

    const patient: ICreatePatientDTO = {
      doctorId: createdDoctor.id,
      birthDate: "09/01/2003",
      email: "email@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "4899999999",
      weight: 68.8,
    };

    const createdPatient = await createPatient.execute(patient);

    const updatePatientWithSameEmail = {
      doctorId: createdDoctor.id,
      patientId: createdPatient.id,
      birthDate: "2010-10-10",
      email: "another-email@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 180,
      name: "Updated Name",
      phone: "4899999999",
      weight: 88.2,
    };

    await expect(
      updatePatient.execute(updatePatientWithSameEmail)
    ).rejects.toEqual(new AppError("Phone number already used."));
  });
});
