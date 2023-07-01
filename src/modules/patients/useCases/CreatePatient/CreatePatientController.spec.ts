import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Genders";

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
      birthDate: "09/01/2003",
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
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    await connection.query(`delete from doctors where id = '${doctorUUID}'`);

    const patient = {
      birthDate: "09/01/2003",
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
});
