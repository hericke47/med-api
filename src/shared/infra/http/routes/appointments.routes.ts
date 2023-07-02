import { Router } from "express";

import { CreateAppointmentController } from "@modules/appointments/useCases/CreateAppointment/CreateAppointmentController";
import { Joi, Segments, celebrate } from "celebrate";
import { ensureDoctorAuthenticated } from "../middlewares/ensureDoctorAuthenticated";

const appointmentsRouter = Router();

const createAppointmentController = new CreateAppointmentController();

appointmentsRouter.post(
  "/:patientId",
  celebrate({
    [Segments.BODY]: {
      date: Joi.date().iso().required(),
    },
  }),
  ensureDoctorAuthenticated,
  createAppointmentController.handle
);

export default appointmentsRouter;
