import { Router } from "express";

import { CreateDoctorController } from "@modules/doctors/useCases/CreateDoctor/CreateDoctorController";

const doctorsRouter = Router();

const createDoctorController = new CreateDoctorController();

doctorsRouter.post("/", createDoctorController.handle);

export default doctorsRouter;
