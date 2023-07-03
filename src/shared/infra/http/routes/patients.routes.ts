import { CreatePatientController } from "@modules/patients/useCases/CreatePatient/CreatePatientController";
import { Router } from "express";
import { Joi, Segments, celebrate } from "celebrate";
import { GetPatientController } from "@modules/patients/useCases/GetPatient/GetPatientController";
import { ListPatientsController } from "@modules/patients/useCases/ListPatients/ListPatientsController";
import { UpdatePatientController } from "@modules/patients/useCases/UpdatePatient/UpdatePatientController";
import { DeletePatientController } from "@modules/patients/useCases/DeletePatient/DeletePatientController";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const patientsRouter = Router();

const createPatientController = new CreatePatientController();
const getPatientController = new GetPatientController();
const listPatientsController = new ListPatientsController();
const updatePatientController = new UpdatePatientController();
const deletePatientController = new DeletePatientController();

patientsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      birthDate: Joi.date().iso().required(),
      genderId: Joi.number().required(),
      phone: Joi.string().required(),
      height: Joi.number().integer().positive().required(),
      weight: Joi.number().positive().required(),
    },
  }),
  ensureDoctorAuthenticated,
  createPatientController.handle
);

patientsRouter.get(
  "/:patientId",
  celebrate({
    [Segments.PARAMS]: {
      patientId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  getPatientController.handle
);

patientsRouter.get(
  "/",
  ensureDoctorAuthenticated,
  listPatientsController.handle
);

patientsRouter.put(
  "/:patientId",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      birthDate: Joi.date().iso(),
      genderId: Joi.number(),
      height: Joi.number(),
      weight: Joi.number(),
      phone: Joi.string(),
    },
    [Segments.PARAMS]: {
      patientId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  updatePatientController.handle
);

patientsRouter.delete(
  "/:patientId",
  celebrate({
    [Segments.PARAMS]: {
      patientId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  deletePatientController.handle
);

export default patientsRouter;
