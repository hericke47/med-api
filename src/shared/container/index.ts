import "./providers";

import { container } from "tsyringe";

import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import DoctorRepository from "@modules/doctors/infra/typeorm/repositories/DoctorRepository";

container.registerSingleton<IDoctorRepository>(
  "DoctorRepository",
  DoctorRepository
);
