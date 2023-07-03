import request from "supertest";
import { Connection } from "typeorm";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

import { hash } from "bcrypt";
import { v4 as uuidV4 } from "uuid";
import { GendersEnum } from "@modules/patients/types/Gender";

let connection: Connection;
let doctorUUID: string;
describe("Update Patient", () => {
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

  it("should be able to update patient", async () => {
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

    const updatedPatient = {
      birthDate: "2003-01-09",
      email: "updated-patient-example@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 170,
      name: "Updated Patient Example",
      phone: "4812344444",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const updatedPatientResponse = await request(app)
      .put(`/patients/${createdPatient.body.id}`)
      .send(updatedPatient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .get(`/patients/${createdPatient.body.id}`)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toEqual(updatedPatientResponse.body.name);
    expect(response.body.email).toEqual(updatedPatientResponse.body.email);
    expect(response.body.height).toEqual(updatedPatientResponse.body.height);
    expect(response.body.phone).toEqual(updatedPatientResponse.body.phone);
  });

  it("should not be able to update patient if gender does not exists", async () => {
    const nonExistentGender = Math.floor(Math.random() * 1000) + 300;

    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const patient = {
      birthDate: "2003-01-09",
      email: "another-to-update-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "55 98353-0129",
      weight: 68.8,
    };

    const updatedPatient = {
      birthDate: "2003-01-09",
      email: "another-updated-patient-example@gmail.com",
      genderId: nonExistentGender,
      height: 170,
      name: "Updated Patient Example",
      phone: "97 7101-5404",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/patients/${createdPatient.body.id}`)
      .send(updatedPatient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Gender not found!");
  });

  it("should not be able to update patient if doctor does not exists", async () => {
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
      email: "jhon-doe@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const updatedPatient = {
      birthDate: "2003-01-09",
      email: "updated-john-doe@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 170,
      name: "Updated Patient Example",
      phone: "48123224444",
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
      .put(`/patients/${createdPatient.body.id}`)
      .send(updatedPatient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Doctor not found!");
  });

  it("should not be able to update patient if patient does not exists", async () => {
    const createdDoctor = await request(app).post("/doctors").send({
      name: "Another Doctor john Doe",
      email: "another-doctorjhondoe@example.com",
      password: "another-example-password",
    });

    const authentication = await request(app).post("/sessions").send({
      email: createdDoctor.body.email,
      password: "another-example-password",
    });

    const updatedPatient = {
      birthDate: "2003-01-09",
      email: "updated-john-doe@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 170,
      name: "Updated Patient Example",
      phone: "48123224444",
      weight: 68.8,
    };

    const nonExistentPatientUUID = uuidV4();

    const response = await request(app)
      .put(`/patients/${nonExistentPatientUUID}`)
      .send(updatedPatient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Patient not found!");
  });

  it("should not be able to update patient if email address is already in use", async () => {
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const sameEmail = "patient-example-email@gmail.com";

    const patient = {
      birthDate: "2003-01-09",
      email: sameEmail,
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: "48999999999",
      weight: 68.8,
    };

    const updatePatientWithSameEmail = {
      birthDate: "2003-01-09",
      email: sameEmail,
      genderId: GendersEnum.MASCULINE,
      height: 170,
      name: "Updated Patient Example",
      phone: "4812344444",
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/patients/${createdPatient.body.id}`)
      .send(updatePatientWithSameEmail)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Email address already used.");
  });

  it("should not be able to update patient if phone number is already in use", async () => {
    const authentication = await request(app).post("/sessions").send({
      email: "doctorjhondoe@example.com",
      password: "example-password",
    });

    const samePhoneNumber = "480099923912";

    const patient = {
      birthDate: "2003-01-09",
      email: "new-patient-example@gmail.com",
      genderId: GendersEnum.FEMININE,
      height: 170,
      name: "Patient Example",
      phone: samePhoneNumber,
      weight: 68.8,
    };

    const updatePatientWithSamePhone = {
      birthDate: "2003-01-09",
      email: "patient-example-another-email@gmail.com",
      genderId: GendersEnum.MASCULINE,
      height: 170,
      name: "Updated Patient Example",
      phone: samePhoneNumber,
      weight: 68.8,
    };

    const createdPatient = await request(app)
      .post("/patients")
      .send(patient)
      .set("Authorization", `bearer ${authentication.body.token}`);

    const response = await request(app)
      .put(`/patients/${createdPatient.body.id}`)
      .send(updatePatientWithSamePhone)
      .set("Authorization", `bearer ${authentication.body.token}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual("Phone number already used.");
  });
});
