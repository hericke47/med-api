import { CreatePatientController } from "@modules/patients/useCases/CreatePatient/CreatePatientController";
import { Router } from "express";
import { Joi, Segments, celebrate } from "celebrate";
import { GetPatientController } from "@modules/patients/useCases/GetPatient/GetPatientController";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const patientsRouter = Router();

const createPatientController = new CreatePatientController();
const getPatientController = new GetPatientController();

patientsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      birthDate: Joi.date().required(),
      genderId: Joi.number().required(),
      height: Joi.number().required(),
      weight: Joi.number().required(),
      phone: Joi.string().required(),
    },
  }),
  ensureDoctorAuthenticated,
  createPatientController.handle
);

patientsRouter.get(
  "/:patientId",
  ensureDoctorAuthenticated,
  getPatientController.handle
);

export default patientsRouter;
