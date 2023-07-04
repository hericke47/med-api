import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";

let connection: Connection;
let doctorUUID: string;
let currentDate: Date;
describe("Delete Appointment", () => {
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

  it("should be able to delete appointment", async () => {
    const appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
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
      .delete(`/appointments/${createdAppointment.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to delete appointment if doctor does not exists", async () => {
    const appointmentDate = new Date(
      `${
        currentDate.getFullYear() + 1
      }-${currentDate.getMonth()}-${currentDate.getDate()} 14:30:00`
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

    await connection.query(
      `delete from doctors where id = '${createdDoctor.body.id}'`
    );

    const response = await request(app)
      .delete(`/appointments/${createdAppointment.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should not be able to delete appointment if appointment does not exists", async () => {
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const response = await request(app)
      .delete(`/appointments/${uuidV4()}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Appointment not found!");
  });
});
