import "./providers";

import { container } from "tsyringe";

import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import DoctorRepository from "@modules/doctors/infra/typeorm/repositories/DoctorRepository";
import IDoctorTokensRepository from "@modules/doctors/repositories/models/IDoctorTokensRepository";
import DoctorTokensRepository from "@modules/doctors/infra/typeorm/repositories/DoctorTokensRepository";

container.registerSingleton<IDoctorRepository>(
  "DoctorRepository",
  DoctorRepository
);

container.registerSingleton<IDoctorTokensRepository>(
  "DoctorTokensRepository",
  DoctorTokensRepository
);
