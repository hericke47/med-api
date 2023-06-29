import { celebrate, Segments, Joi } from "celebrate";
import { Router } from "express";

import AuthenticateDoctorController from "@modules/doctors/useCases/AuthenticateDoctor/AuthenticateDoctorController";

const sessionsRouter = Router();
const authenticateDoctorController = new AuthenticateDoctorController();

sessionsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  authenticateDoctorController.handle
);

export default sessionsRouter;
