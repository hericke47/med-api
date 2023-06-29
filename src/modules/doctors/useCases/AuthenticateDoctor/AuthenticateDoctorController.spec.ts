import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("Authenticate Doctor Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const uuid = uuidV4();
    const password = await hash("example-password", 8);

    await connection.query(
      `INSERT INTO doctors(id, name, email, password, created_at, updated_at, active)
        values('${uuid}', 'Doctor john Doe', 'doctorjhondoe@example.com', '${password}', 'now()', 'now()', true)`
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to authenticate", async () => {
    const response = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("doctor");
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("refreshToken");
    expect(response.body.doctor.email).toEqual("doctorjhondoe@example.com");
    expect(response.body.doctor.name).toEqual("Doctor john Doe");
  });

  it("should not be able to authenticate a non existent doctor", async () => {
    const response = await request(app).post("/sessions").send({
      email: "non-existent-email@example.com",
      password: "example-password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Email or password incorrect!");
  });

  it("should not be able to authenticate a doctor with incorrect password", async () => {
    const response = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "incorrect-password",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Email or password incorrect!");
  });
});
