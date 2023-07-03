import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";
import { AppointmentStatusEnum } from "@modules/appointments/types/AppointmentStatus";

let connection: Connection;
let doctorUUID: string;
let currentDate: Date;
describe("Update Appointment", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    doctorUUID = uuidV4();
    const password = await hash("example-password", 8);

    await connection.query(
      `INSERT INTO doctors(id, name, email, password, created_at, updated_at, active)
        values('${doctorUUID}', 'Doctor john Doe', 'doctorjhondoe@example.com', '${password}', 'now()', 'now()', true)`
    );

    currentDate = new Date();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to update appointment", async () => {
    const appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:00:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(53) 3477-7182",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.appointment_status_id).toEqual(
      AppointmentStatusEnum.CONCLUDED
    );
    expect(response.body.date).toEqual(secondAppointmentDate.toISOString());
    expect(response.body.patient_id).toEqual(createdPatient.body.id);
  });

  it("should not be able to update appointment if appointment status does not exists", async () => {
    const appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:00:00`
    );

    const nonExistentAppointmentStatus = Math.floor(Math.random() * 1000) + 300;

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "another-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(69) 3127-7709",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: nonExistentAppointmentStatus,
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Appointment Status not found!");
  });

  it("should not be able to update appointment if doctor does not exists", async () => {
    const appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:00:00`
    );

    const createdDoctor = await request(app).post("/doctors").send({
      name: "Another Doctor john Doe",
      email: "anotherdoctorjhondoe@example.com",
      password: "another-example-password",
    });

    const authentication = await request(app).post("/sessions").send({
      email: createdDoctor.body.email,
      password: "another-example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "other-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(74) 3380-8274",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    await connection.query(
      `delete from doctors where id = '${createdDoctor.body.id}'`
    );

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should not be able to update appointment if patient does not exists", async () => {
    const appointmentDate = new Date(
      `${currentDate.getFullYear() + 1}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${currentDate.getFullYear() + 1}-${
        currentDate.getMonth() + 2
      }-${currentDate.getDate()} 19:00:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "jhon-doe-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(84) 3985-3663",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        patientId: uuidV4(),
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Patient not found!");
  });

  it("should not be able to update appointment if appointment does not exists", async () => {
    const secondAppointmentDate = new Date(
      `${currentDate.getFullYear() + 1}-${currentDate.getMonth()}-${
        currentDate.getDate() + 12
      } 19:00:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "patient-example2@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(69) 2677-7268",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${uuidV4()}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Appointment does not exists!");
  });

  it("should not be able to update appointment in a past date", async () => {
    const appointmentDate = new Date(
      `${currentDate.getFullYear() + 1}-${currentDate.getMonth() + 3}-${
        currentDate.getDate() + 1
      } 14:30:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "second-jhon-doe-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(11) 3744-5025",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: new Date("1990-07-22 12:10:00"),
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "You can't create an appointment on a past date."
    );
  });

  it("should not be able to update appointment if already exist appointment on this date", async () => {
    const appointmentDate = new Date(
      `${currentDate.getFullYear() + 1}-${currentDate.getMonth()}-${
        currentDate.getDate() + 3
      } 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:00:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "third-jhon-doe-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(99) 2571-7272",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    await request(app)
      .post(`/appointments`)
      .send({
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "Already exists an appointment on this date"
    );
  });

  it("should not be able to update appointment if already exist appointment on this range", async () => {
    const appointmentDate = new Date(
      `${currentDate.getFullYear() + 3}-${currentDate.getMonth()}-${
        currentDate.getDate() + 4
      } 14:30:00`
    );

    const secondAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 14
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:00:00`
    );

    const thirdAppointmentDate = new Date(
      `${
        currentDate.getFullYear() + 14
      }-${currentDate.getMonth()}-${currentDate.getDate()} 19:30:00`
    );

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "fourth-jhon-doe-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "(96) 2651-2877",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    await request(app)
      .post(`/appointments`)
      .send({
        date: secondAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const createdAppointment = await request(app)
      .post(`/appointments`)
      .send({
        date: appointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/appointments/${createdAppointment.body.id}`)
      .send({
        appointmentStatusId: AppointmentStatusEnum.CONCLUDED,
        date: thirdAppointmentDate,
        patientId: createdPatient.body.id,
      })
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      "There is already an appointment in the range of this appointment"
    );
  });
});
