import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";

let connection: Connection;
let doctorUUID: string;
describe("Create Patient", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    doctorUUID = uuidV4();
    const password = await hash("example-password", 8);

    await connection.query(
      `INSERT INTO doctors(id, name, email, password, created_at, updated_at, active)
        values('${doctorUUID}', 'Doctor john Doe', 'doctorjhondoe@example.com', '${password}', 'now()', 'now()', true)`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new patient", async () => {
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
      phone: "48999999999",
      weight: 68.8,
    };

    const response = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual(patient.name);
    expect(response.body.email).toEqual(patient.email);
    expect(response.body.gender_id).toEqual(patient.genderId);
    expect(response.body.height).toEqual(patient.height);
    expect(response.body.weight).toEqual(patient.weight);
    expect(response.body.phone).toEqual(patient.phone);
    expect(response.body.doctor_id).toEqual(doctorUUID);
  });

  it("should not be able to create a new patient if doctor does not exists", async () => {
    const createdDoctor = await request(app).post("/doctors").send({
      name: "Another Doctor john Doe",
      email: "anotherdoctorjhondoe@example.com",
      password: "another-example-password",
    });

    const authentication = await request(app).post("/sessions").send({
      email: createdDoctor.body.email,
      password: "another-example-password",
    });

    await connection.query(
      `delete from doctors where id = '${createdDoctor.body.id}'`
    );

    const patient = {
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const response = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should be able to create a new patient if email already in use", async () => {
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const sameEmail = "patient-example@gmail.com";

    const patient = {
      birthDate: "2003-01-09",
      email: sameEmail,
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const patientWithSameEmail = {
      birthDate: "2003-01-09",
      email: sameEmail,
      genderId: GendersEnum.FEMININE,
      height: 171,
      name: "Patient Example",
      phone: "48777777777",
      weight: 80,
    };

    await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .post("/patients")
      .send(patientWithSameEmail)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Email address already used.");
  });

  it("should be able to create a new patient if phone number already in use", async () => {
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const samePhoneNumber = "48999999999";

    const patient = {
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: samePhoneNumber,
      weight: 68.8,
    };

    const patientWithSamePhone = {
      birthDate: "2003-01-09",
      email: "another-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 171,
      name: "Patient Example",
      phone: samePhoneNumber,
      weight: 80,
    };

    await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .post("/patients")
      .send(patientWithSamePhone)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Phone number already used.");
  });
});
