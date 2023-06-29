import { celebrate, Segments, Joi } from "celebrate";
import { Router } from "express";

import { CreateDoctorController } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorController";

const doctorsRouter = Router();

const createDoctorController = new CreateDoctorController();

doctorsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(6),
    },
  }),
  createDoctorController.handle
);

export default doctorsRouter;
