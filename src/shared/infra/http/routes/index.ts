import { Router } from "express";
import doctorsRouter from "./doctors.routes";
import sessionsRouter from "./sessions.routes";
import patientsRouter from "./patients.routes";

const routes = Router();

routes.use("/doctors", doctorsRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/patients", patientsRouter);

export default routes;
