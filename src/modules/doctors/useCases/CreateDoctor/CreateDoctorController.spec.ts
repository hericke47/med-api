import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";
import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";

let connection: Connection;
describe("Create Doctor", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new doctor ", async () => {
    const doctor: ICreateDoctorDTO = {
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    };

    const response = await request(app).post("/doctors").send(doctor);

    expect(response.body.name).toEqual(doctor.name);
    expect(response.body.email).toEqual(doctor.email);
    expect(response.status).toBe(201);
  });

  it("should not be able to create a new doctor whith email from another", async () => {
    const response = await request(app).post("/doctors").send({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    expect(response.status).toBe(400);
  });
});
