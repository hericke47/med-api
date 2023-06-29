import { v4 as uuidV4 } from "uuid";

import { Doctor } from "@modules/doctors/infra/typeorm/entities/Doctor";
import ICreateDoctorDTO from "@modules/doctors/dtos/ICreateDoctorDTO";
import IDoctorRepository from "../models/IDoctorRepository";

class FakeDoctorRepository implements IDoctorRepository {
  private doctors: Doctor[] = [];

  public async findByEmail(email: string): Promise<Doctor | undefined> {
    const findDoctor = this.doctors.find(
      (doctor) => doctor.email === email && doctor.active === true
    );

    return findDoctor;
  }

  public async create(doctorData: ICreateDoctorDTO): Promise<Doctor> {
    const doctor = new Doctor();

    Object.assign(
      doctor,
      { id: uuidV4() },
      {
        ...doctorData,
        active: true,
      }
    );

    this.doctors.push(doctor);

    return doctor;
  }

  public async save(doctor: Doctor): Promise<Doctor> {
    const findIndex = this.doctors.findIndex(
      (findDoctor) => findDoctor.id === doctor.id
    );

    this.doctors[findIndex] = doctor;

    return doctor;
  }
}

export default FakeDoctorRepository;
