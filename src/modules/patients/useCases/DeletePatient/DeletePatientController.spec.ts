import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";

let connection: Connection;
let doctorUUID: string;
describe("Delete Patient", () => {
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

  it("should be able to delete patient", async () => {
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

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .delete(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to delete patient if doctor does not exists", async () => {
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
      phone: "48999999999",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    await connection.query(
      `delete from doctors where id = '${createdDoctor.body.id}'`
    );

    const response = await request(app)
      .delete(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should not be able to delete patient if patient does not exists", async () => {
    const createdDoctor = await request(app).post("/doctors").send({
      name: "Another Doctor john Doe",
      email: "anotherdoctorjhondoe@example.com",
      password: "another-example-password",
    });

    const authentication = await request(app).post("/sessions").send({
      email: createdDoctor.body.email,
      password: "another-example-password",
    });

    const response = await request(app)
      .delete(`/patients/${uuidV4()}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Patient not found!");
  });
});
