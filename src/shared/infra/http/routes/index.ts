import { Router } from "express";
import doctorsRouter from "./doctors.routes";

const routes = Router();

routes.use("/doctors", doctorsRouter);

export default routes;
