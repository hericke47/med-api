import { Router } from "express";

import { CreateAppointmentController } from "@modules/appointments/useCases/CreateAppointment/CreateAppointmentController";
import { Joi, Segments, celebrate } from "celebrate";
import { UpdateAppointmentController } from "@modules/appointments/useCases/UpdateAppointment/UpdateAppointmentController";
import { DeleteAppointmentController } from "@modules/appointments/useCases/DeleteAppointment/DeleteAppointmentController";
import { UpdateAppointmentNotesController } from "@modules/appointments/useCases/UpdateAppointmentNotes/UpdateAppointmentNotesController";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const appointmentsRouter = Router();

const createAppointmentController = new CreateAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();
const deleteAppointmentController = new DeleteAppointmentController();
const updateAppointmentNotesController = new UpdateAppointmentNotesController();

appointmentsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().iso().required(),
      patientId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  createAppointmentController.handle
);

appointmentsRouter.put(
  "/:appointmentId",
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().iso().required(),
      patientId: Joi.string().uuid().required(),
      appointmentStatusId: Joi.number().required(),
    },
    [Segments.PARAMS]: {
      appointmentId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  updateAppointmentController.handle
);

appointmentsRouter.delete(
  "/:appointmentId",
  celebrate({
    [Segments.PARAMS]: {
      appointmentId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  deleteAppointmentController.handle
);

appointmentsRouter.patch(
  "/:appointmentId",
  celebrate({
    [Segments.BODY]: {
      notes: Joi.string().required().allow("", null),
    },
    [Segments.PARAMS]: {
      appointmentId: Joi.string().uuid().required(),
    },
  }),
  ensureDoctorAuthenticated,
  updateAppointmentNotesController.handle
);

export default appointmentsRouter;
