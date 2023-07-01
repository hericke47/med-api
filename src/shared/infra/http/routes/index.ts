import { Router } from "express";
import doctorsRouter from "./doctors.routes";
import sessionsRouter from "./sessions.routes";

const routes = Router();

routes.use("/doctors", doctorsRouter);
routes.use("/sessions", sessionsRouter);

export default routes;
