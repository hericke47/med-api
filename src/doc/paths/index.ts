import { authenticateDoctor, createDoctor } from "./doctors.swagger";

export default {
  "/doctors": createDoctor,
  "/sessions": authenticateDoctor,
};
