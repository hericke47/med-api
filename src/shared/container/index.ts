import "./providers";

import { container } from "tsyringe";

import IDoctorRepository from "@modules/doctors/repositories/models/IDoctorRepository";
import DoctorRepository from "@modules/doctors/infra/typeorm/repositories/DoctorRepository";
import IDoctorTokensRepository from "@modules/doctors/repositories/models/IDoctorTokensRepository";
import DoctorTokensRepository from "@modules/doctors/infra/typeorm/repositories/DoctorTokensRepository";
import IPatientRepository from "@modules/patients/repositories/models/IPatientRepository";
import PatientRepository from "@modules/patients/infra/typeorm/repositories/PatientRepository";
import AppointmentRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentRepository";
import IAppointmentRepository from "@modules/appointments/repositories/models/IAppointmentRepository";

container.registerSingleton<IDoctorRepository>(
  "DoctorRepository",
  DoctorRepository
);

container.registerSingleton<IDoctorTokensRepository>(
  "DoctorTokensRepository",
  DoctorTokensRepository
);

container.registerSingleton<IPatientRepository>(
  "PatientRepository",
  PatientRepository
);

container.registerSingleton<IAppointmentRepository>(
  "AppointmentRepository",
  AppointmentRepository
);
