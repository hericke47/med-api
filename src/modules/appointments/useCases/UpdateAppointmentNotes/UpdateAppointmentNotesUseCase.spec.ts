import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Gender";
import { CreatePatientUseCase } from "@modules/patients/useCases/CreatePatient/CreatePatientUseCase";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import FakeAppointmentRepository from "@modules/appointments/repositories/fakes/FakeAppointmentRepository";
import { CreateAppointmentUseCase } from "../CreateAppointment/CreateAppointmentUseCase";
import { UpdateAppointmentNotesUseCase } from "./UpdateAppointmentNotesUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAppointmentRepository: FakeAppointmentRepository;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let createAppointment: CreateAppointmentUseCase;
let updateAppointmentNotes: UpdateAppointmentNotesUseCase;
let dateProvider: DayjsDateProvider;

let doctorId: string;
let patientId: string;
let appointmentDate: Date;

describe("Update Appointment Notes", () => {
  beforeEach(async () => {
    fakeDoctorRepository = new FakeDoctorRepository();
    fakePatientRepository = new FakePatientRepository();
    fakeHashProvider = new FakeHashProvider();
    dateProvider = new DayjsDateProvider();
    fakeAppointmentRepository = new FakeAppointmentRepository();

    createDoctor = new CreateDoctorUseCase(
      fakeDoctorRepository,
      fakeHashProvider
    );

    createPatient = new CreatePatientUseCase(
      fakeDoctorRepository,
      fakePatientRepository
    );

    createAppointment = new CreateAppointmentUseCase(
      fakeDoctorRepository,
      fakeAppointmentRepository,
      fakePatientRepository,
      dateProvider
    );

    updateAppointmentNotes = new UpdateAppointmentNotesUseCase(
      fakeDoctorRepository,
      fakeAppointmentRepository
    );

    const doctor = await createDoctor.execute({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    doctorId = doctor.id;

    const patient = await createPatient.execute({
      doctorId,
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    });

    patientId = patient.id;

    const currentDate = new Date();

    appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
    );
  });

  it("should be able to update appointment notes", async () => {
    const note = "example note";

    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    const updatedAppointment = await updateAppointmentNotes.execute({
      doctorId,
      appointmentId: createdAppointment.id,
      notes: note,
    });

    expect(updatedAppointment).toHaveProperty("id");
    expect(updatedAppointment.notes).toEqual(note);
  });

  it("should not be able to update appointment notes if doctor does not exists", async () => {
    const note = "example note";

    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    await expect(
      updateAppointmentNotes.execute({
        doctorId: "non-existent-doctor-id",
        appointmentId: createdAppointment.id,
        notes: note,
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });

  it("should not be able to update appointment notes if appointment does not exists", async () => {
    const note = "example note";

    await expect(
      updateAppointmentNotes.execute({
        doctorId,
        appointmentId: "non-existent-appointment-id",
        notes: note,
      })
    ).rejects.toEqual(new AppError("Appointment not found!"));
  });
});
