import { Router } from "express";

import { CreateAppointmentController } from "@modules/appointments/useCases/CreateAppointment/CreateAppointmentController";
import { Joi, Segments, celebrate } from "celebrate";
import { UpdateAppointmentController } from "@modules/appointments/useCases/UpdateAppointment/UpdateAppointmentController";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const appointmentsRouter = Router();

const createAppointmentController = new CreateAppointmentController();
const updateAppointmentController = new UpdateAppointmentController();

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

export default appointmentsRouter;
