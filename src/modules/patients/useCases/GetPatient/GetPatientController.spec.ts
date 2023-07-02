import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";

let connection: Connection;
let doctorUUID: string;
describe("Get Patient", () => {
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

  it("should be able to get patient by doctor", async () => {
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
      weight: "68.8",
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .get(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual(patient.name);
    expect(response.body.email).toEqual(patient.email);
    expect(response.body.gender_id).toEqual(patient.genderId);
    expect(response.body.height).toEqual(patient.height);
    expect(response.body.weight).toEqual(patient.weight);
    expect(response.body.phone).toEqual(patient.phone);
    expect(response.body.doctor_id).toEqual(doctorUUID);
  });

  it("should not be able to get patient if doctor does not exists", async () => {
    const createdDoctor = await request(app).post("/doctors").send({
      name: "Doctor john Doe",
      email: "doctorjhondoe2@example.com",
      password: "example-password2",
    });

    const authentication = await request(app).post("/sessions").send({
      email: createdDoctor.body.email,
      password: "example-password2",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: "68.8",
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    await connection.query(
      `delete from doctors where id = '${createdDoctor.body.id}'`
    );

    const response = await request(app)
      .get(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should not be able to get patient if patient does not exists", async () => {
    const createdDoctor = await request(app).post("/doctors").send({
      name: "Another Doctor john Doe",
      email: "another-doctorjhondoe@example.com",
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
      phone: "48999999999",
      weight: "68.8",
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    await connection.query(
      `delete from patients where id = '${createdPatient.body.id}'`
    );

    const response = await request(app)
      .get(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Patient not found!");
  });
});
