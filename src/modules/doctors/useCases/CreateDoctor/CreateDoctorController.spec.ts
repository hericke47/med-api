import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

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
    const response = await request(app).post("/doctors").send({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a new doctor whith email from another", async () => {
    const response = await request(app).post("/doctors").send({
      name: "Doctor john Doe",
      email: "doctorjhondoe@example.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
  });
});
