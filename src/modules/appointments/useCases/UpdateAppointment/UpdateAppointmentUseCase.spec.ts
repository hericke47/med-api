import FakeDoctorRepository from "@modules/doctors/repositories/fakes/FakeDoctorRepository";
import { CreateDoctorUseCase } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorUseCase";
import FakePatientRepository from "@modules/patients/repositories/fakes/FakePatientRepository";
import { GendersEnum } from "@modules/patients/types/Gender";
import { CreatePatientUseCase } from "@modules/patients/useCases/CreatePatient/CreatePatientUseCase";
import FakeHashProvider from "@shared/container/providers/HashProvider/fakes/FakeHashProvider";
import AppError from "@shared/errors/AppError";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import FakeAppointmentRepository from "@modules/appointments/repositories/fakes/FakeAppointmentRepository";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";
import { CreateAppointmentUseCase } from "../CreateAppointment/CreateAppointmentUseCase";
import { UpdateAppointmentUseCase } from "./UpdateAppointmentUseCase";

let fakeDoctorRepository: FakeDoctorRepository;
let fakePatientRepository: FakePatientRepository;
let fakeHashProvider: FakeHashProvider;
let fakeAppointmentRepository: FakeAppointmentRepository;
let createPatient: CreatePatientUseCase;
let createDoctor: CreateDoctorUseCase;
let createAppointment: CreateAppointmentUseCase;
let updateAppointment: UpdateAppointmentUseCase;
let dateProvider: DayjsDateProvider;

let doctorId: string;
let patientId: string;
let appointmentDate: Date;
let secondAppointmentDate: Date;
let thirdAppointmentDate: Date;

describe("Update Appointment", () => {
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

    updateAppointment = new UpdateAppointmentUseCase(
      fakeDoctorRepository,
      fakeAppointmentRepository,
      fakePatientRepository,
      dateProvider
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

    secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 15:00:00`
    );

    thirdAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 2
      }-${currentDate.getMonth()}-${currentDate.getDate()} 15:00:00`
    );
  });

  it("should be able to update appointment", async () => {
    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    const updatedAppointment = await updateAppointment.execute({
      appointmentId: createdAppointment.id,
      appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
      date: secondAppointmentDate,
      doctorId,
      patientId,
    });

    expect(updatedAppointment).toHaveProperty("id");
    expect(updatedAppointment.appointment_status_id).toEqual(
      AppointmentStatusEnum.CONCLUDED
    );
    expect(updatedAppointment.date).toEqual(secondAppointmentDate);
  });

  it("should not be able to update appointment if appointment status does not exists", async () => {
    const nonExistentAppointmentStatus = NaN;

    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    await expect(
      updateAppointment.execute({
        appointmentId: createdAppointment.id,
        appointmentStatusId: nonExistentAppointmentStatus,
        date: secondAppointmentDate,
        doctorId,
        patientId,
      })
    ).rejects.toEqual(new AppError("Appointment Status not found!"));
  });

  it("should not be able to update appointment if doctor does not exists", async () => {
    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    await expect(
      updateAppointment.execute({
        appointmentId: createdAppointment.id,
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        doctorId: "non-existent-doctor-id",
        patientId,
      })
    ).rejects.toEqual(new AppError("Doctor not found!"));
  });

  it("should not be able to update appointment if patient does not exists", async () => {
    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    await expect(
      updateAppointment.execute({
        appointmentId: createdAppointment.id,
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        doctorId,
        patientId: "non-existent-patient-id",
      })
    ).rejects.toEqual(new AppError("Patient not found!"));
  });

  it("should not be able to update if appointment does not exists", async () => {
    await expect(
      updateAppointment.execute({
        appointmentId: "non-existent-appointment-id",
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        doctorId,
        patientId,
      })
    ).rejects.toEqual(new AppError("Appointment not found!"));
  });

  it("should not be able to update appointment in a past date", async () => {
    const createdAppointment = await createAppointment.execute({
      date: appointmentDate,
      doctorId,
      patientId,
    });

    await expect(
      updateAppointment.execute({
        appointmentId: createdAppointment.id,
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: new Date("1990-07-22 12:10:00"),
        doctorId,
        patientId,
      })
    ).rejects.toEqual(
      new AppError("You can't create an appointment on a past date.")
    );
  });

  it("should not be able to update appointment if already exist appointment on this date", async () => {
    const appointment = {
      date: thirdAppointmentDate,
      doctorId,
      patientId,
    };

    const secondAppointment = {
      date: secondAppointmentDate,
      doctorId,
      patientId,
    };

    await createAppointment.execute(appointment);

    const secondCreatedAppointment = await createAppointment.execute(
      secondAppointment
    );

    await expect(
      updateAppointment.execute({
        appointmentId: secondCreatedAppointment.id,
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: thirdAppointmentDate,
        doctorId,
        patientId,
      })
    ).rejects.toEqual(
      new AppError("Already exists an appointment on this date")
    );
  });

  it("should not be able to update appointment if already exist appointment on this range", async () => {
    const appointment = {
      date: secondAppointmentDate,
      doctorId,
      patientId,
    };

    const secondAppointment = {
      date: thirdAppointmentDate,
      doctorId,
      patientId,
    };

    await createAppointment.execute(appointment);

    const secondCreatedAppointment = await createAppointment.execute(
      secondAppointment
    );

    await expect(
      updateAppointment.execute({
        appointmentId: secondCreatedAppointment.id,
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: appointmentDate,
        doctorId,
        patientId,
      })
    ).rejects.toEqual(
      new AppError(
        "There is already an appointment in the range of this appointment"
      )
    );
  });
});
