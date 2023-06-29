import { celebrate, Segments, Joi } from "celebrate";
import { Router } from "express";

import AuthenticateDoctorController from "@modules/doctors/useCases/AuthenticateDoctor/AuthenticateDoctorController";
import { RefreshDoctorTokenController } from "@modules/doctors/useCases/RefreshDoctorToken/RefreshDoctorTokenController";

const sessionsRouter = Router();
const authenticateDoctorController = new AuthenticateDoctorController();
const refreshDoctorTokenController = new RefreshDoctorTokenController();

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

sessionsRouter.post(
  "/refreshToken",
  celebrate({
    [Segments.BODY]: {
      refreshToken: Joi.string().required(),
    },
  }),
  refreshDoctorTokenController.handle
);

export default sessionsRouter;
