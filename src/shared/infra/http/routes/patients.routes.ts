import { CreatePatientController } from "@modules/patients/useCases/CreatePatient/CreatePatientController";
import { Router } from "express";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const patientsRouter = Router();

const createPatientController = new CreatePatientController();

patientsRouter.post(
  "/",
  ensureDoctorAuthenticated,
  createPatientController.handle
);

export default patientsRouter;
